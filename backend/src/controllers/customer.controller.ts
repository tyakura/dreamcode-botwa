import { Request, Response } from "express";
import prisma from "@/lib/prisma";

const VALID_STATUSES = ["NEW", "CONTACTED", "INTERESTED", "QUALIFIED", "NEGOTIATION", "DEAL", "LOST"];

export async function listCustomers(req: Request, res: Response) {
  const { businessId } = req.params;
  const { status, isSelected, q, search } = req.query;

  const where: any = { businessId: Number(businessId) };
  if (status) where.status = String(status);
  if (isSelected !== undefined) where.isSelected = isSelected === "true";

  const searchTerm = (q || search) as string | undefined;
  if (searchTerm) {
    where.OR = [
      { name: { contains: searchTerm } },
      { whatsapp: { contains: searchTerm } },
      { email: { contains: searchTerm } },
      { company: { contains: searchTerm } },
    ];
  }

  const customers = await prisma.customer.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { conversations: true, deals: true, followUps: true, statusHistory: true } },
    },
  });
  return res.json(customers);
}

export async function getCustomer(req: Request, res: Response) {
  const { id } = req.params;
  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
    include: {
      conversations: { include: { messages: { orderBy: { createdAt: "asc" } } } },
      deals: true,
      followUps: true,
      statusHistory: { orderBy: { changedAt: "desc" } },
    },
  });

  if (!customer) {
    return res.status(404).json({ message: "Customer tidak ditemukan" });
  }
  return res.json(customer);
}

export async function createCustomer(req: Request, res: Response) {
  const { businessId } = req.params;
  const {
    name, whatsapp, email, company, productInterest,
    needs, status, source, isSelected,
  } = req.body;

  const customer = await prisma.customer.create({
    data: {
      businessId: Number(businessId),
      name,
      whatsapp: String(whatsapp).replace(/\D/g, ""),
      email,
      company,
      productInterest,
      needs,
      status: status || "NEW",
      source: source || "WHATSAPP",
      isSelected: isSelected ?? false,
    },
  });

  res.locals.auditData = {
    businessId: Number(businessId),
    action: "CREATE",
    entity: "CUSTOMER",
    entityId: customer.id,
    metadata: { status: customer.status, source: customer.source },
  };

  return res.status(201).json(customer);
}

export async function updateCustomer(req: Request, res: Response) {
  const { id } = req.params;
  const {
    name, whatsapp, email, company, productInterest,
    needs, status, source, isSelected, lastContactAt,
  } = req.body;

  const existing = await prisma.customer.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return res.status(404).json({ message: "Customer tidak ditemukan" });
  }

  const customer = await prisma.$transaction(async (tx) => {
    const updated = await tx.customer.update({
      where: { id: Number(id) },
      data: {
        name, whatsapp, email, company, productInterest,
        needs, status, source, isSelected, lastContactAt,
      },
    });

    // Catat perubahan status ke customer_status_history
    if (status && status !== existing.status) {
      await tx.customerStatusHistory.create({
        data: {
          customerId: Number(id),
          previousStatus: existing.status,
          newStatus: status,
          changedBy: (req as any).user?.email || "SYSTEM",
        },
      });
    }

    return updated;
  });

  res.locals.auditData = {
    businessId: existing.businessId,
    action: "UPDATE",
    entity: "CUSTOMER",
    entityId: customer.id,
    metadata: { fromStatus: existing.status, toStatus: customer.status },
  };

  return res.json(customer);
}

export async function updateCustomerStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Status harus salah satu dari: ${VALID_STATUSES.join(", ")}` });
  }

  const existing = await prisma.customer.findUnique({ where: { id: Number(id) } });
  if (!existing) {
    return res.status(404).json({ message: "Customer tidak ditemukan" });
  }

  const history = await prisma.customerStatusHistory.create({
    data: {
      customerId: Number(id),
      previousStatus: existing.status,
      newStatus: status,
      changedBy: (req as any).user?.email || "SYSTEM",
    },
  });

  const customer = await prisma.customer.update({
    where: { id: Number(id) },
    data: { status },
  });

  res.locals.auditData = {
    businessId: existing.businessId,
    action: "UPDATE_STATUS",
    entity: "CUSTOMER",
    entityId: customer.id,
    metadata: { fromStatus: existing.status, toStatus: status },
  };

  return res.json({ customer, history });
}

export async function toggleSelected(req: Request, res: Response) {
  const { id } = req.params;
  const customer = await prisma.customer.update({
    where: { id: Number(id) },
    data: { isSelected: { set: (req.body as any).isSelected ?? true } },
  });

  res.locals.auditData = {
    businessId: customer.businessId,
    action: (customer.isSelected ? "SELECT" : "UNSELECT"),
    entity: "CUSTOMER",
    entityId: customer.id,
  };

  return res.json(customer);
}

export async function getStatusHistory(req: Request, res: Response) {
  const { id } = req.params;
  const history = await prisma.customerStatusHistory.findMany({
    where: { customerId: Number(id) },
    orderBy: { changedAt: "desc" },
  });
  return res.json(history);
}

export async function deleteCustomer(req: Request, res: Response) {
  const { id } = req.params;
  const customer = await prisma.customer.findUnique({ where: { id: Number(id) } });
  if (!customer) {
    return res.status(404).json({ message: "Customer tidak ditemukan" });
  }
  await prisma.customer.delete({ where: { id: Number(id) } });
  res.locals.auditData = { businessId: customer.businessId, action: "DELETE", entity: "CUSTOMER", entityId: Number(id) };
  return res.json({ message: "Customer dihapus" });
}
