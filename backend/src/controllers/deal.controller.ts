import { Request, Response } from "express";
import prisma from "@/lib/prisma";
import { AuthedRequest } from "@/middleware/auth";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "PAID", "COMPLETED", "CANCELLED"];
const VALID_PAYMENT = ["UNPAID", "PARTIAL", "PAID"];

export async function listDeals(req: Request, res: Response) {
  const { businessId } = req.params;
  const { status, paymentStatus, dealDateFrom, dealDateTo } = req.query;

  const where: any = { businessId: Number(businessId) };
  if (status) where.status = String(status);
  if (paymentStatus) where.paymentStatus = String(paymentStatus);
  if (dealDateFrom || dealDateTo) {
    where.dealDate = {};
    if (dealDateFrom) where.dealDate.gte = new Date(String(dealDateFrom));
    if (dealDateTo) where.dealDate.lte = new Date(String(dealDateTo));
  }

  const deals = await prisma.deal.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, whatsapp: true, email: true } },
      handler: { select: { id: true, name: true } },
    },
  });
  return res.json(deals);
}

export async function getDeal(req: Request, res: Response) {
  const { id } = req.params;
  const deal = await prisma.deal.findUnique({
    where: { id: Number(id) },
    include: { customer: true, conversation: { include: { messages: true } }, handler: { select: { id: true, name: true } } },
  });

  if (!deal) {
    return res.status(404).json({ message: "Deal tidak ditemukan" });
  }
  return res.json(deal);
}

export async function createDeal(req: AuthedRequest, res: Response) {
  const { businessId } = req.params;
  const {
    customerId, conversationId, product, quantity,
    amount, paymentStatus, status, dealDate, notes, source,
  } = req.body;

  const businessIdNum = Number(businessId);

  const deal = await prisma.$transaction(async (tx) => {
    const created = await tx.deal.create({
      data: {
        businessId: businessIdNum,
        customerId,
        conversationId,
        handledBy: req.user?.id,
        product,
        quantity: quantity ?? 1,
        amount: amount !== undefined ? Number(amount) : null,
        paymentStatus: paymentStatus || "UNPAID",
        status: status || "PENDING",
        dealDate: dealDate ? new Date(dealDate) : null,
        notes,
        source: source || "AUTOMATIC",
      },
    });

    // Update status customer menjadi DEAL jika deal dikonfirmasi dari sumber otomatis
    await tx.customer.update({
      where: { id: customerId },
      data: { lastContactAt: new Date() },
    });

    // Catat notifikasi deal baru
    await tx.notification.create({
      data: {
        businessId: businessIdNum,
        userId: req.user?.id,
        type: "NEW_DEAL",
        message: `Deal baru dibuat untuk customer #${customerId}`,
      },
    });

    return created;
  });

  res.locals.auditData = {
    businessId: businessIdNum,
    action: "CREATE",
    entity: "DEAL",
    entityId: deal.id,
    metadata: { amount, product, status: deal.status },
  };

  return res.status(201).json(deal);
}

export async function updateDeal(req: Request, res: Response) {
  const { id } = req.params;
  const {
    product, quantity, amount, paymentStatus,
    status, dealDate, notes, handledBy,
  } = req.body;

  const existing = await prisma.deal.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return res.status(404).json({ message: "Deal tidak ditemukan" });
  }

  if (paymentStatus && !VALID_PAYMENT.includes(paymentStatus)) {
    return res.status(400).json({ message: `paymentStatus harus: ${VALID_PAYMENT.join(", ")}` });
  }

  const deal = await prisma.$transaction(async (tx) => {
    const updated = await tx.deal.update({
      where: { id: Number(id) },
      data: {
        product, quantity,
        amount: amount !== undefined ? Number(amount) : undefined,
        paymentStatus, status, dealDate: dealDate ? new Date(dealDate) : undefined,
        notes, handledBy,
      },
    });

    // Setelah deal PAID/COMPLETED, update status customer
    if ((status === "PAID" || status === "COMPLETED") && existing.status !== status) {
      await tx.customer.update({
        where: { id: updated.customerId },
        data: { status: "DEAL" },
      });
      await tx.customerStatusHistory.create({
        data: {
          customerId: updated.customerId,
          previousStatus: (await tx.customer.findUnique({ where: { id: updated.customerId } }))?.status ?? null,
          newStatus: "DEAL",
          changedBy: (req as any).user?.email || "SYSTEM",
        },
      });
    }

    return updated;
  });

  res.locals.auditData = {
    businessId: existing.businessId,
    action: "UPDATE",
    entity: "DEAL",
    entityId: deal.id,
    metadata: { fromStatus: existing.status, toStatus: deal.status, paymentStatus: deal.paymentStatus },
  };

  return res.json(deal);
}

export async function getDealStats(req: Request, res: Response) {
  const { businessId } = req.params;
  const businessIdNum = Number(businessId);

  const [total, confirmed, paid, completed, totalAmount] = await Promise.all([
    prisma.deal.count({ where: { businessId: businessIdNum } }),
    prisma.deal.count({ where: { businessId: businessIdNum, status: "CONFIRMED" } }),
    prisma.deal.count({ where: { businessId: businessIdNum, status: "PAID" } }),
    prisma.deal.count({ where: { businessId: businessIdNum, status: "COMPLETED" } }),
    prisma.deal.aggregate({ where: { businessId: businessIdNum, status: { in: ["PAID", "COMPLETED"] } }, _sum: { amount: true } }),
  ]);

  return res.json({
    total,
    confirmed,
    paid,
    completed,
    totalRevenue: totalAmount._sum.amount ?? 0,
  });
}

export async function deleteDeal(req: Request, res: Response) {
  const { id } = req.params;
  const deal = await prisma.deal.findUnique({ where: { id: Number(id) } });
  if (!deal) return res.status(404).json({ message: "Deal tidak ditemukan" });
  await prisma.deal.delete({ where: { id: Number(id) } });
  res.locals.auditData = { businessId: deal.businessId, action: "DELETE", entity: "DEAL", entityId: Number(id) };
  return res.json({ message: "Deal dihapus" });
}

export { VALID_STATUSES };
