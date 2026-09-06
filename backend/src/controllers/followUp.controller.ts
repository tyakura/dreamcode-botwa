import { Request, Response } from "express";
import prisma from "@/lib/prisma";
import { AuthedRequest } from "@/middleware/auth";

const FOLLOWUP_STATUSES = ["SCHEDULED", "SENT", "DELIVERED", "REPLIED", "FAILED", "CANCELLED"];

export async function listFollowUps(req: Request, res: Response) {
  const { businessId } = req.params;
  const { status, type, channel, scheduledFrom, scheduledTo } = req.query;

  const where: any = { businessId: Number(businessId) };
  if (status) where.status = String(status);
  if (type) where.type = String(type);
  if (channel) where.channel = String(channel);

  const followUps = await prisma.followUp.findMany({
    where,
    orderBy: { scheduledAt: "asc" },
    include: {
      customer: { select: { id: true, name: true, whatsapp: true, email: true, status: true } },
      creator: { select: { id: true, name: true } },
    },
  });
  return res.json(followUps);
}

export async function createFollowUp(req: AuthedRequest, res: Response) {
  const { businessId } = req.params;
  const { customerId, type, channel, scheduledAt, message, status } = req.body;

  const followUp = await prisma.followUp.create({
    data: {
      businessId: Number(businessId),
      customerId,
      createdBy: req.user?.id,
      type: type || "MANUAL",
      channel: channel || "WHATSAPP",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      message,
      status: status || "SCHEDULED",
    },
  });

  res.locals.auditData = {
    businessId: Number(businessId),
    action: "CREATE",
    entity: "FOLLOW_UP",
    entityId: followUp.id,
    metadata: { type: followUp.type, channel: followUp.channel, scheduledAt: followUp.scheduledAt },
  };

  return res.status(201).json(followUp);
}

export async function updateFollowUp(req: Request, res: Response) {
  const { id } = req.params;
  const { scheduledAt, message, status, sentAt, repliedAt } = req.body;

  const followUp = await prisma.followUp.update({
    where: { id: Number(id) },
    data: {
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      message,
      status,
      sentAt: sentAt ? new Date(sentAt) : undefined,
      repliedAt: repliedAt ? new Date(repliedAt) : undefined,
    },
  });

  res.locals.auditData = { businessId: followUp.businessId, action: "UPDATE", entity: "FOLLOW_UP", entityId: followUp.id, metadata: { status } };
  return res.json(followUp);
}

export async function markSent(req: Request, res: Response) {
  const { id } = req.params;
  const followUp = await prisma.followUp.update({
    where: { id: Number(id) },
    data: { status: "SENT", sentAt: new Date() },
  });
  return res.json(followUp);
}

export async function markReplied(req: Request, res: Response) {
  const { id } = req.params;
  const followUp = await prisma.followUp.update({
    where: { id: Number(id) },
    data: { status: "REPLIED", repliedAt: new Date() },
  });
  return res.json(followUp);
}

export async function deleteFollowUp(req: Request, res: Response) {
  const { id } = req.params;
  const followUp = await prisma.followUp.findUnique({ where: { id: Number(id) } });
  if (!followUp) return res.status(404).json({ message: "Follow up tidak ditemukan" });
  await prisma.followUp.delete({ where: { id: Number(id) } });
  res.locals.auditData = { businessId: followUp.businessId, action: "DELETE", entity: "FOLLOW_UP", entityId: Number(id) };
  return res.json({ message: "Follow up dihapus" });
}

// ===== Follow Up Settings =====

export async function getFollowUpSettings(req: Request, res: Response) {
  const { businessId } = req.params;
  const settings = await prisma.followUpSetting.findMany({
    where: { businessId: Number(businessId) },
    include: { aiAgent: { select: { id: true, name: true } } },
  });
  return res.json(settings);
}

export async function createFollowUpSetting(req: Request, res: Response) {
  const { businessId } = req.params;
  const {
    aiAgentId, maxFollowUp, intervalHours, sendTimeStart,
    sendTimeEnd, sendDays, defaultTemplate, stopConditions,
  } = req.body;

  const setting = await prisma.followUpSetting.create({
    data: {
      businessId: Number(businessId),
      aiAgentId,
      maxFollowUp: maxFollowUp ?? 3,
      intervalHours: intervalHours ?? 24,
      sendTimeStart: sendTimeStart || "09:00",
      sendTimeEnd: sendTimeEnd || "18:00",
      sendDays: sendDays || "MON,FRI",
      defaultTemplate,
      stopConditions,
    },
  });
  res.locals.auditData = { businessId: Number(businessId), action: "CREATE", entity: "FOLLOW_UP_SETTING", entityId: setting.id };
  return res.status(201).json(setting);
}

export async function updateFollowUpSetting(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  const setting = await prisma.followUpSetting.update({
    where: { id: Number(id) },
    data,
  });
  res.locals.auditData = { businessId: setting.businessId, action: "UPDATE", entity: "FOLLOW_UP_SETTING", entityId: setting.id };
  return res.json(setting);
}

export async function deleteFollowUpSetting(req: Request, res: Response) {
  const { id } = req.params;
  const setting = await prisma.followUpSetting.findUnique({ where: { id: Number(id) } });
  if (!setting) return res.status(404).json({ message: "Setting tidak ditemukan" });
  await prisma.followUpSetting.delete({ where: { id: Number(id) } });
  res.locals.auditData = { businessId: setting.businessId, action: "DELETE", entity: "FOLLOW_UP_SETTING", entityId: Number(id) };
  return res.json({ message: "Setting dihapus" });
}

export { FOLLOWUP_STATUSES };
