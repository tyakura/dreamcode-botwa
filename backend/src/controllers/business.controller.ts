import { Request, Response } from "express";
import prisma from "@/lib/prisma";
import { AuthedRequest } from "@/middleware/auth";

export async function listBusinesses(req: Request, res: Response) {
  const businesses = await prisma.business.findMany({
    include: {
      owner: { select: { id: true, name: true, email: true } },
      _count: { select: { customers: true, deals: true, aiAgents: true, members: true } },
    },
  });
  return res.json(businesses);
}

export async function getBusiness(req: Request, res: Response) {
  const { id } = req.params;
  const business = await prisma.business.findUnique({
    where: { id: Number(id) },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: { include: { user: { select: { id: true, name: true, email: true } }, role: true } },
      aiAgents: true,
      customers: { select: { id: true, name: true, whatsapp: true, status: true, isSelected: true } },
      deals: { select: { id: true, amount: true, status: true, dealDate: true, product: true } },
    },
  });

  if (!business) {
    return res.status(404).json({ message: "Business tidak ditemukan" });
  }
  return res.json(business);
}

export async function createBusiness(req: AuthedRequest, res: Response) {
  const { name, description } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Tidak terautentikasi" });
  }

  const business = await prisma.$transaction(async (tx) => {
    const created = await tx.business.create({
      data: {
        name,
        description,
        ownerId: req.user!.id,
        status: "ACTIVE",
      },
    });

    // Auto tambahkan owner sebagai business member
    await tx.businessMember.create({
      data: {
        businessId: created.id,
        userId: req.user!.id,
        roleId: req.user!.roleId,
        status: "ACTIVE",
      },
    });

    return created;
  });

  res.locals.auditData = {
    businessId: business.id,
    action: "CREATE",
    entity: "BUSINESS",
    entityId: business.id,
    metadata: { name },
  };

  return res.status(201).json(business);
}

export async function updateBusiness(req: Request, res: Response) {
  const { id } = req.params;
  const { name, description, status } = req.body;

  const business = await prisma.business.update({
    where: { id: Number(id) },
    data: { name, description, status },
  });

  res.locals.auditData = {
    businessId: business.id,
    action: "UPDATE",
    entity: "BUSINESS",
    entityId: business.id,
  };

  return res.json(business);
}

export async function deleteBusiness(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.business.delete({ where: { id: Number(id) } });
  res.locals.auditData = { action: "DELETE", entity: "BUSINESS", entityId: Number(id) };
  return res.json({ message: "Business dihapus" });
}

// ===== Business Members =====

export async function listMembers(req: Request, res: Response) {
  const { businessId } = req.params;
  const members = await prisma.businessMember.findMany({
    where: { businessId: Number(businessId) },
    include: {
      user: { select: { id: true, name: true, email: true } },
      role: true,
    },
  });
  return res.json(members);
}

export async function addMember(req: Request, res: Response) {
  const { businessId } = req.params;
  const { userId, roleId } = req.body;

  const member = await prisma.businessMember.create({
    data: {
      businessId: Number(businessId),
      userId,
      roleId,
      status: "ACTIVE",
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      role: true,
    },
  });

  res.locals.auditData = {
    businessId: Number(businessId),
    action: "ADD_MEMBER",
    entity: "BUSINESS_MEMBER",
    entityId: member.id,
  };

  return res.status(201).json(member);
}

export async function updateMember(req: Request, res: Response) {
  const { id } = req.params;
  const { roleId, status } = req.body;
  const member = await prisma.businessMember.update({
    where: { id: Number(id) },
    data: { roleId, status },
  });
  return res.json(member);
}

export async function removeMember(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.businessMember.delete({ where: { id: Number(id) } });
  return res.json({ message: "Anggota dihapus" });
}
