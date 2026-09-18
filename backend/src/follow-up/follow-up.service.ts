import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { JwtPayload } from "../common/jwt.util";

@Injectable()
export class FollowUpService {
  constructor(private readonly prisma: PrismaService) {}

  list(businessId: number, query: any) {
    const { status, type, channel } = query;
    const where: any = { businessId };
    if (status) where.status = String(status);
    if (type) where.type = String(type);
    if (channel) where.channel = String(channel);

    return this.prisma.followUp.findMany({
      where,
      orderBy: { scheduledAt: "asc" },
      include: {
        customer: { select: { id: true, name: true, whatsapp: true, email: true, status: true } },
        creator: { select: { id: true, name: true } },
      },
    });
  }

  create(businessId: number, body: any, user?: JwtPayload) {
    return this.prisma.followUp.create({
      data: {
        businessId,
        customerId: body.customerId,
        createdBy: user?.id,
        type: body.type || "MANUAL",
        channel: body.channel || "WHATSAPP",
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        message: body.message,
        status: body.status || "SCHEDULED",
      },
    });
  }

  async update(id: number, body: any) {
    const followUp = await this.prisma.followUp.update({
      where: { id },
      data: {
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
        message: body.message,
        status: body.status,
        sentAt: body.sentAt ? new Date(body.sentAt) : undefined,
        repliedAt: body.repliedAt ? new Date(body.repliedAt) : undefined,
      },
    });
    return followUp;
  }

  markSent(id: number) {
    return this.prisma.followUp.update({
      where: { id },
      data: { status: "SENT", sentAt: new Date() },
    });
  }

  markReplied(id: number) {
    return this.prisma.followUp.update({
      where: { id },
      data: { status: "REPLIED", repliedAt: new Date() },
    });
  }

  async remove(id: number) {
    const followUp = await this.prisma.followUp.findUnique({ where: { id } });
    if (!followUp) {
      throw new NotFoundException("Follow up tidak ditemukan");
    }
    await this.prisma.followUp.delete({ where: { id } });
    return followUp;
  }

  // ===== Follow Up Settings =====

  getSettings(businessId: number) {
    return this.prisma.followUpSetting.findMany({
      where: { businessId },
      include: { aiAgent: { select: { id: true, name: true } } },
    });
  }

  createSetting(businessId: number, body: any) {
    return this.prisma.followUpSetting.create({
      data: {
        businessId,
        aiAgentId: body.aiAgentId,
        maxFollowUp: body.maxFollowUp ?? 3,
        intervalHours: body.intervalHours ?? 24,
        sendTimeStart: body.sendTimeStart || "09:00",
        sendTimeEnd: body.sendTimeEnd || "18:00",
        sendDays: body.sendDays || "MON,FRI",
        defaultTemplate: body.defaultTemplate,
        stopConditions: body.stopConditions,
      },
    });
  }

  async updateSetting(id: number, data: any) {
    const setting = await this.prisma.followUpSetting.update({
      where: { id },
      data,
    });
    return setting;
  }

  async removeSetting(id: number) {
    const setting = await this.prisma.followUpSetting.findUnique({ where: { id } });
    if (!setting) {
      throw new NotFoundException("Setting tidak ditemukan");
    }
    await this.prisma.followUpSetting.delete({ where: { id } });
    return setting;
  }
}