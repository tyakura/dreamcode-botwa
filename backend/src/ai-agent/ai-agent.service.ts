import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AiAgentService {
  constructor(private readonly prisma: PrismaService) {}

  listAgents(businessId: number) {
    return this.prisma.aiAgent.findMany({
      where: { businessId },
      include: {
        _count: { select: { conversations: true, knowledgeBases: true } },
      },
    });
  }

  createAgent(businessId: number, body: any) {
    return this.prisma.aiAgent.create({
      data: {
        businessId,
        name: body.name,
        systemPrompt: body.systemPrompt,
        personality: body.personality,
        operatingHours: body.operatingHours || "24/7",
        status: body.status || "ACTIVE",
      },
    });
  }

  async updateAgent(id: number, body: any) {
    const agent = await this.prisma.aiAgent.findUnique({ where: { id } });
    if (!agent) {
      throw new NotFoundException("AI Agent tidak ditemukan");
    }
    return this.prisma.aiAgent.update({
      where: { id },
      data: {
        name: body.name,
        systemPrompt: body.systemPrompt,
        personality: body.personality,
        operatingHours: body.operatingHours,
        status: body.status,
      },
    });
  }

  async removeAgent(id: number) {
    const agent = await this.prisma.aiAgent.findUnique({ where: { id } });
    if (!agent) {
      throw new NotFoundException("AI Agent tidak ditemukan");
    }
    await this.prisma.aiAgent.delete({ where: { id } });
    return agent;
  }

  // ===== Knowledge Base =====

  listKnowledge(businessId: number) {
    return this.prisma.knowledgeBase.findMany({
      where: { businessId },
      include: { aiAgent: { select: { id: true, name: true } } },
    });
  }

  createKnowledge(businessId: number, body: any) {
    return this.prisma.knowledgeBase.create({
      data: {
        businessId,
        aiAgentId: body.aiAgentId,
        title: body.title,
        content: body.content,
        sourceType: body.sourceType || "MANUAL",
      },
    });
  }

  async updateKnowledge(id: number, body: any) {
    const item = await this.prisma.knowledgeBase.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException("Knowledge tidak ditemukan");
    }
    return this.prisma.knowledgeBase.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content,
        sourceType: body.sourceType,
        aiAgentId: body.aiAgentId,
      },
    });
  }

  async removeKnowledge(id: number) {
    const item = await this.prisma.knowledgeBase.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException("Knowledge tidak ditemukan");
    }
    await this.prisma.knowledgeBase.delete({ where: { id } });
    return item;
  }
}