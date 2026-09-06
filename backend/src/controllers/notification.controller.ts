import { Request, Response } from "express";
import prisma from "@/lib/prisma";
import { AuthedRequest } from "@/middleware/auth";

export async function listNotifications(req: AuthedRequest, res: Response) {
  const { businessId } = req.params;

  const where: any = { businessId: Number(businessId) };
  if (req.user) where.OR = [{ userId: req.user.id }, { userId: null }];

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return res.json(notifications);
}

export async function markRead(req: Request, res: Response) {
  const { id } = req.params;
  const notification = await prisma.notification.update({
    where: { id: Number(id) },
    data: { isRead: true },
  });
  return res.json(notification);
}

export async function markAllRead(req: Request, res: Response) {
  const { businessId } = req.params;
  await prisma.notification.updateMany({
    where: { businessId: Number(businessId), isRead: false },
    data: { isRead: true },
  });
  return res.json({ message: "Semua notifikasi ditandai sudah dibaca" });
}

export async function deleteNotification(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.notification.delete({ where: { id: Number(id) } });
  return res.json({ message: "Notifikasi dihapus" });
}

// ===== Audit Logs =====

export async function listAuditLogs(req: Request, res: Response) {
  const { businessId } = req.params;
  const { action, entity } = req.query;

  const where: any = { businessId: Number(businessId) };
  if (action) where.action = String(action);
  if (entity) where.entity = String(entity);

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  return res.json(logs);
}
