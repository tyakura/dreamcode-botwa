import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { JwtPayload } from "../common/jwt.util";

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  listBusinesses() {
    return this.prisma.business.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { customers: true, deals: true, aiAgents: true, members: true } },
      },
    });
  }

  async getBusiness(id: number) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } }, role: true } },
        aiAgents: true,
        customers: { select: { id: true, name: true, whatsapp: true, status: true, isSelected: true } },
        deals: { select: { id: true, amount: true, status: true, dealDate: true, product: true } },
      },
    });

    if (!business) {
      throw new NotFoundException("Business tidak ditemukan");
    }
    return business;
  }

  async createBusiness(user: JwtPayload, body: { name: string; description?: string }) {
    const business = await this.prisma.$transaction(async (tx) => {
      const created = await tx.business.create({
        data: {
          name: body.name,
          description: body.description,
          ownerId: user.id,
          status: "ACTIVE",
        },
      });

      await tx.businessMember.create({
        data: {
          businessId: created.id,
          userId: user.id,
          roleId: user.roleId,
          status: "ACTIVE",
        },
      });

      return created;
    });

    return business;
  }

  updateBusiness(id: number, body: { name?: string; description?: string; status?: string }) {
    return this.prisma.business.update({
      where: { id },
      data: { name: body.name, description: body.description, status: body.status },
    });
  }

  async deleteBusiness(id: number) {
    await this.prisma.business.delete({ where: { id } });
    return { message: "Business dihapus" };
  }

  // ===== Business Members =====

  listMembers(businessId: number) {
    return this.prisma.businessMember.findMany({
      where: { businessId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        role: true,
      },
    });
  }

  addMember(businessId: number, body: { userId: number; roleId: number }) {
    return this.prisma.businessMember.create({
      data: {
        businessId,
        userId: body.userId,
        roleId: body.roleId,
        status: "ACTIVE",
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        role: true,
      },
    });
  }

  updateMember(id: number, body: { roleId?: number; status?: string }) {
    return this.prisma.businessMember.update({
      where: { id },
      data: { roleId: body.roleId, status: body.status },
    });
  }

  async removeMember(id: number) {
    await this.prisma.businessMember.delete({ where: { id } });
    return { message: "Anggota dihapus" };
  }
}