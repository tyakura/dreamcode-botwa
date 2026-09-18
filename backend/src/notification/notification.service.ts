import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { JwtPayload } from "../common/jwt.util";

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  list(businessId: number, query: any) {
    const { isRead, type } = query;
    const where: any = { businessId };
    if (isRead !== undefined && isRead !== "") where.isRead = isRead === "true";
    if (type) where.type = String(type);

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: query.limit ? Number(query.limit) : 50,
    });
  }

  unreadCount(businessId: number, user?: JwtPayload) {
    return this.prisma.notification
      .count({
        where: {
          businessId,
          isRead: false,
          OR: [{ userId: user?.id }, { userId: null }],
        },
      })
      .then((count) => ({ count }));
  }

  getOne(id: number) {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  markRead(id: number) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  markAllRead(businessId: number, user?: JwtPayload) {
    return this.prisma.notification
      .updateMany({
        where: {
          businessId,
          isRead: false,
          OR: [{ userId: user?.id }, { userId: null }],
        },
        data: { isRead: true },
      })
      .then((r) => ({ updated: r.count }));
  }

  async remove(id: number) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      throw new NotFoundException("Notifikasi tidak ditemukan");
    }
    await this.prisma.notification.delete({ where: { id } });
    return notification;
  }

  // ===== Audit Logs =====

  listAuditLogs(query: any) {
    const { businessId, action, entity, limit, offset } = query;
    const where: any = {};
    if (businessId) where.businessId = Number(businessId);
    if (action) where.action = String(action);
    if (entity) where.entity = String(entity);

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit ? Number(limit) : 50,
      skip: offset ? Number(offset) : 0,
      include: {
        user: { select: { id: true, name: true, email: true } },
        business: { select: { id: true, name: true } },
      },
    });
  }

  listBusinessAuditLogs(businessId: number, query: any) {
    const { action, entity, limit } = query;
    const where: any = { businessId };
    if (action) where.action = String(action);
    if (entity) where.entity = String(entity);

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit ? Number(limit) : 50,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }
}