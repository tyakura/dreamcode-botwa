import { Request, Response } from "express";
import prisma from "@/lib/prisma";

export async function listAgents(req: Request, res: Response) {
  const { businessId } = req.params;
  const agents = await prisma.aiAgent.findMany({
    where: { businessId: Number(businessId) },
    include: {
      _count: { select: { conversations: true, knowledgeBases: true } },
    },
  });
  return res.json(agents);
}

export async function createAgent(req: Request, res: Response) {
  const { businessId } = req.params;
  const { name, systemPrompt, personality, operatingHours, status } = req.body;

  const agent = await prisma.aiAgent.create({
    data: {
      businessId: Number(businessId),
      name,
      systemPrompt,
      personality,
      operatingHours: operatingHours || "24/7",
      status: status || "ACTIVE",
    },
  });
  res.locals.auditData = { businessId: Number(businessId), action: "CREATE", entity: "AI_AGENT", entityId: agent.id };
  return res.status(201).json(agent);
}

export async function updateAgent(req: Request, res: Response) {
  const { id } = req.params;
  const { name, systemPrompt, personality, operatingHours, status } = req.body;

  const agent = await prisma.aiAgent.update({
    where: { id: Number(id) },
    data: { name, systemPrompt, personality, operatingHours, status },
  });
  res.locals.auditData = { businessId: agent.businessId, action: "UPDATE", entity: "AI_AGENT", entityId: agent.id };
  return res.json(agent);
}

export async function deleteAgent(req: Request, res: Response) {
  const { id } = req.params;
  const agent = await prisma.aiAgent.findUnique({ where: { id: Number(id) } });
  if (!agent) return res.status(404).json({ message: "AI Agent tidak ditemukan" });
  await prisma.aiAgent.delete({ where: { id: Number(id) } });
  res.locals.auditData = { businessId: agent.businessId, action: "DELETE", entity: "AI_AGENT", entityId: Number(id) };
  return res.json({ message: "AI Agent dihapus" });
}

// ===== Knowledge Base =====

export async function listKnowledge(req: Request, res: Response) {
  const { businessId } = req.params;
  const items = await prisma.knowledgeBase.findMany({
    where: { businessId: Number(businessId) },
    include: { aiAgent: { select: { id: true, name: true } } },
  });
  return res.json(items);
}

export async function createKnowledge(req: Request, res: Response) {
  const { businessId } = req.params;
  const { title, content, sourceType, aiAgentId } = req.body;

  const item = await prisma.knowledgeBase.create({
    data: {
      businessId: Number(businessId),
      aiAgentId,
      title,
      content,
      sourceType: sourceType || "MANUAL",
    },
  });
  res.locals.auditData = { businessId: Number(businessId), action: "CREATE", entity: "KNOWLEDGE_BASE", entityId: item.id };
  return res.status(201).json(item);
}

export async function updateKnowledge(req: Request, res: Response) {
  const { id } = req.params;
  const { title, content, sourceType, aiAgentId } = req.body;

  const item = await prisma.knowledgeBase.update({
    where: { id: Number(id) },
    data: { title, content, sourceType, aiAgentId },
  });
  res.locals.auditData = { businessId: item.businessId, action: "UPDATE", entity: "KNOWLEDGE_BASE", entityId: item.id };
  return res.json(item);
}

export async function deleteKnowledge(req: Request, res: Response) {
  const { id } = req.params;
  const item = await prisma.knowledgeBase.findUnique({ where: { id: Number(id) } });
  if (!item) return res.status(404).json({ message: "Knowledge tidak ditemukan" });
  await prisma.knowledgeBase.delete({ where: { id: Number(id) } });
  res.locals.auditData = { businessId: item.businessId, action: "DELETE", entity: "KNOWLEDGE_BASE", entityId: Number(id) };
  return res.json({ message: "Knowledge dihapus" });
}
