import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  list(businessId: number, query: any) {
    const { status, customerId } = query;
    const where: any = { businessId };
    if (status) where.status = String(status);
    if (customerId) where.customerId = Number(customerId);

    return this.prisma.conversation.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        customer: { select: { id: true, name: true, whatsapp: true } },
        aiAgent: { select: { id: true, name: true } },
        _count: { select: { messages: true } },
      },
    });
  }

  async getOne(id: number) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        customer: true,
        aiAgent: true,
        messages: { orderBy: { createdAt: "asc" } },
        deal: true,
        forbiddenDataEvents: true,
      },
    });

    if (!conversation) {
      throw new NotFoundException("Conversation tidak ditemukan");
    }
    return conversation;
  }

  async create(businessId: number, body: any) {
    const conversation = await this.prisma.conversation.create({
      data: {
        businessId,
        customerId: body.customerId,
        aiAgentId: body.aiAgentId,
        channel: body.channel || "WHATSAPP",
        status: body.status || "OPEN",
        assignedTo: body.assignedTo,
      },
    });

    if (body.customerId) {
      await this.prisma.customer.update({
        where: { id: body.customerId },
        data: { lastConversationAt: new Date() },
      });
    }

    return conversation;
  }

  async update(id: number, body: any) {
    const conversation = await this.prisma.conversation.update({
      where: { id },
      data: {
        status: body.status,
        assignedTo: body.assignedTo,
        aiAgentId: body.aiAgentId,
      },
    });
    return conversation;
  }

  async close(id: number) {
    return this.prisma.conversation.update({
      where: { id },
      data: { status: "CLOSED" },
    });
  }

  // ===== Messages =====

  listMessages(conversationId: number) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });
  }

  async sendMessage(conversationId: number, body: any) {
    const newMessage = await this.prisma.message.create({
      data: {
        conversationId,
        senderType: body.senderType,
        message: body.message,
        aiGenerated: body.aiGenerated ?? false,
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return newMessage;
  }
}