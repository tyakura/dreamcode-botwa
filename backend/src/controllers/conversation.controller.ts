import { Request, Response } from "express";
import prisma from "@/lib/prisma";

export async function listConversations(req: Request, res: Response) {
  const { businessId } = req.params;
  const { status, customerId } = req.query;

  const where: any = { businessId: Number(businessId) };
  if (status) where.status = String(status);
  if (customerId) where.customerId = Number(customerId);

  const conversations = await prisma.conversation.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, whatsapp: true } },
      aiAgent: { select: { id: true, name: true } },
      _count: { select: { messages: true } },
    },
  });
  return res.json(conversations);
}

export async function getConversation(req: Request, res: Response) {
  const { id } = req.params;
  const conversation = await prisma.conversation.findUnique({
    where: { id: Number(id) },
    include: {
      customer: true,
      aiAgent: true,
      messages: { orderBy: { createdAt: "asc" } },
      deal: true,
      forbiddenDataEvents: true,
    },
  });

  if (!conversation) {
    return res.status(404).json({ message: "Conversation tidak ditemukan" });
  }
  return res.json(conversation);
}

export async function createConversation(req: Request, res: Response) {
  const { businessId } = req.params;
  const { customerId, aiAgentId, channel, status, assignedTo } = req.body;

  const conversation = await prisma.conversation.create({
    data: {
      businessId: Number(businessId),
      customerId,
      aiAgentId,
      channel: channel || "WHATSAPP",
      status: status || "OPEN",
      assignedTo,
    },
  });

  // Update last_conversation_at pada customer
  await prisma.customer.update({
    where: { id: customerId },
    data: { lastConversationAt: new Date() },
  });

  res.locals.auditData = {
    businessId: Number(businessId),
    action: "CREATE",
    entity: "CONVERSATION",
    entityId: conversation.id,
  };

  return res.status(201).json(conversation);
}

export async function updateConversation(req: Request, res: Response) {
  const { id } = req.params;
  const { status, assignedTo, aiAgentId } = req.body;

  const conversation = await prisma.conversation.update({
    where: { id: Number(id) },
    data: { status, assignedTo, aiAgentId },
  });

  res.locals.auditData = {
    businessId: conversation.businessId,
    action: "UPDATE",
    entity: "CONVERSATION",
    entityId: conversation.id,
    metadata: { status, assignedTo },
  };

  return res.json(conversation);
}

export async function closeConversation(req: Request, res: Response) {
  const { id } = req.params;
  const conversation = await prisma.conversation.update({
    where: { id: Number(id) },
    data: { status: "CLOSED" },
  });
  res.locals.auditData = { businessId: conversation.businessId, action: "CLOSE", entity: "CONVERSATION", entityId: conversation.id };
  return res.json(conversation);
}

// ===== Messages =====

export async function listMessages(req: Request, res: Response) {
  const { conversationId } = req.params;
  const messages = await prisma.message.findMany({
    where: { conversationId: Number(conversationId) },
    orderBy: { createdAt: "asc" },
  });
  return res.json(messages);
}

export async function sendMessage(req: Request, res: Response) {
  const { conversationId } = req.params;
  const { senderType, message, aiGenerated } = req.body;

  const newMessage = await prisma.message.create({
    data: {
      conversationId: Number(conversationId),
      senderType,
      message,
      aiGenerated: aiGenerated ?? false,
    },
  });

  // Update conversation updated_at
  await prisma.conversation.update({
    where: { id: Number(conversationId) },
    data: { updatedAt: new Date() },
  });

  return res.status(201).json(newMessage);
}
