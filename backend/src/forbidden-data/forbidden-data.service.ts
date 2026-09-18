import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { maskSensitive } from "../common/crypto.util";

@Injectable()
export class ForbiddenDataService {
  constructor(private readonly prisma: PrismaService) {}

  listRules(businessId: number) {
    return this.prisma.forbiddenRule.findMany({
      where: { businessId },
      include: { _count: { select: { forbiddenDataEvents: true } } },
    });
  }

  createRule(businessId: number, body: any) {
    return this.prisma.forbiddenRule.create({
      data: {
        businessId,
        name: body.name,
        ruleType: body.ruleType || "KEYWORD",
        pattern: body.pattern,
        action: body.action || "MASK",
        active: body.active ?? true,
        retentionPolicy: body.retentionPolicy,
      },
    });
  }

  async updateRule(id: number, data: any) {
    const rule = await this.prisma.forbiddenRule.update({
      where: { id },
      data,
    });
    return rule;
  }

  async removeRule(id: number) {
    const rule = await this.prisma.forbiddenRule.findUnique({ where: { id } });
    if (!rule) {
      throw new NotFoundException("Rule tidak ditemukan");
    }
    await this.prisma.forbiddenRule.delete({ where: { id } });
    return rule;
  }

  // ===== Forbidden Data Events =====

  listEvents(businessId: number) {
    return this.prisma.forbiddenDataEvent.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      include: {
        forbiddenRule: { select: { id: true, name: true, ruleType: true, action: true } },
        customer: { select: { id: true, name: true, whatsapp: true } },
      },
    });
  }

  async detect(businessId: number, body: any) {
    const { conversationId, customerId, text } = body;

    if (!text) {
      throw new Error("Text wajib diisi untuk deteksi");
    }

    const rules = await this.prisma.forbiddenRule.findMany({
      where: { businessId, active: true },
    });

    const detected: any[] = [];
    for (const rule of rules) {
      let matched = false;
      if (rule.ruleType === "KEYWORD") {
        matched = text.toLowerCase().includes((rule.pattern || "").toLowerCase());
      } else {
        try {
          matched = new RegExp(rule.pattern, "i").test(text);
        } catch {
          matched = false;
        }
      }

      if (matched) {
        const masked = maskSensitive(
          String(rule.pattern).length > 0 ? text.split(rule.pattern).join("****") : "****",
        );
        const event = await this.prisma.forbiddenDataEvent.create({
          data: {
            businessId,
            forbiddenRuleId: rule.id,
            customerId: customerId ? Number(customerId) : null,
            conversationId: conversationId ? Number(conversationId) : null,
            detectedValueMasked: masked,
            actionTaken: rule.action,
          },
        });

        await this.prisma.notification.create({
          data: {
            businessId,
            type: "FORBIDDEN_DATA",
            message: `Data terlarang terdeteksi pada rule "${rule.name}"`,
          },
        });

        detected.push({ event, rule: { id: rule.id, name: rule.name, action: rule.action } });
      }
    }

    return {
      detectedCount: detected.length,
      detected,
      message: detected.length ? "Data terlarang terdeteksi & ditindak" : "Tidak ada data terlarang",
    };
  }

  async removeEvent(id: number) {
    const event = await this.prisma.forbiddenDataEvent.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException("Event tidak ditemukan");
    }
    await this.prisma.forbiddenDataEvent.delete({ where: { id } });
    return event;
  }
}