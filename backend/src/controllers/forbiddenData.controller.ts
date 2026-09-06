import { Request, Response } from "express";
import prisma from "@/lib/prisma";
import { maskSensitive } from "@/utils/crypto";

export async function listForbiddenRules(req: Request, res: Response) {
  const { businessId } = req.params;
  const rules = await prisma.forbiddenRule.findMany({
    where: { businessId: Number(businessId) },
    include: { _count: { select: { forbiddenDataEvents: true } } },
  });
  return res.json(rules);
}

export async function createForbiddenRule(req: Request, res: Response) {
  const { businessId } = req.params;
  const { name, ruleType, pattern, action, active, retentionPolicy } = req.body;

  const rule = await prisma.forbiddenRule.create({
    data: {
      businessId: Number(businessId),
      name,
      ruleType: ruleType || "KEYWORD",
      pattern,
      action: action || "MASK",
      active: active ?? true,
      retentionPolicy,
    },
  });
  res.locals.auditData = { businessId: Number(businessId), action: "CREATE", entity: "FORBIDDEN_RULE", entityId: rule.id };
  return res.status(201).json(rule);
}

export async function updateForbiddenRule(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  const rule = await prisma.forbiddenRule.update({ where: { id: Number(id) }, data });
  res.locals.auditData = { businessId: rule.businessId, action: "UPDATE", entity: "FORBIDDEN_RULE", entityId: rule.id };
  return res.json(rule);
}

export async function deleteForbiddenRule(req: Request, res: Response) {
  const { id } = req.params;
  const rule = await prisma.forbiddenRule.findUnique({ where: { id: Number(id) } });
  if (!rule) return res.status(404).json({ message: "Rule tidak ditemukan" });
  await prisma.forbiddenRule.delete({ where: { id: Number(id) } });
  res.locals.auditData = { businessId: rule.businessId, action: "DELETE", entity: "FORBIDDEN_RULE", entityId: Number(id) };
  return res.json({ message: "Rule dihapus" });
}

// ===== Forbidden Data Events =====

export async function listForbiddenEvents(req: Request, res: Response) {
  const { businessId } = req.params;
  const events = await prisma.forbiddenDataEvent.findMany({
    where: { businessId: Number(businessId) },
    orderBy: { createdAt: "desc" },
    include: {
      forbiddenRule: { select: { id: true, name: true, ruleType: true, action: true } },
      customer: { select: { id: true, name: true, whatsapp: true } },
    },
  });
  return res.json(events);
}

export async function detectForbiddenData(req: Request, res: Response) {
  const { businessId } = req.params;
  const { conversationId, customerId, text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text wajib diisi untuk deteksi" });
  }

  const rules = await prisma.forbiddenRule.findMany({
    where: { businessId: Number(businessId), active: true },
  });

  const detected: any[] = [];
  for (const rule of rules) {
    let matched = false;
    if (rule.ruleType === "KEYWORD") {
      matched = text.toLowerCase().includes(rule.pattern.toLowerCase());
    } else {
      try {
        matched = new RegExp(rule.pattern, "i").test(text);
      } catch (err) {
        matched = false;
      }
    }

    if (matched) {
      const masked = maskSensitive(String(rule.pattern).length > 0 ? text.split(rule.pattern).join("****") : "****");
      const event = await prisma.forbiddenDataEvent.create({
        data: {
          businessId: Number(businessId),
          forbiddenRuleId: rule.id,
          customerId: customerId ? Number(customerId) : null,
          conversationId: conversationId ? Number(conversationId) : null,
          detectedValueMasked: masked,
          actionTaken: rule.action,
        },
      });

      // Ciptakan notifikasi
      await prisma.notification.create({
        data: {
          businessId: Number(businessId),
          type: "FORBIDDEN_DATA",
          message: `Data terlarang terdeteksi pada rule "${rule.name}"`,
        },
      });

      detected.push({ event, rule: { id: rule.id, name: rule.name, action: rule.action } });
    }
  }

  res.locals.auditData = {
    businessId: Number(businessId),
    action: "DETECT_FORBIDDEN",
    entity: "FORBIDDEN_DATA_EVENT",
    metadata: { detectedCount: detected.length },
  };

  return res.json({ detectedCount: detected.length, detected, message: detected.length ? "Data terlarang terdeteksi & ditindak" : "Tidak ada data terlarang" });
}

export async function deleteForbiddenEvent(req: Request, res: Response) {
  const { id } = req.params;
  const event = await prisma.forbiddenDataEvent.findUnique({ where: { id: Number(id) } });
  if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });
  await prisma.forbiddenDataEvent.delete({ where: { id: Number(id) } });
  return res.json({ message: "Event dihapus" });
}
