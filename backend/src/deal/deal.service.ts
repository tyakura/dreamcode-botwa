import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { JwtPayload } from "../common/jwt.util";

const VALID_PAYMENT = ["UNPAID", "PARTIAL", "PAID"];

@Injectable()
export class DealService {
  constructor(private readonly prisma: PrismaService) {}

  list(businessId: number, query: any) {
    const { status, paymentStatus, dealDateFrom, dealDateTo } = query;
    const where: any = { businessId };
    if (status) where.status = String(status);
    if (paymentStatus) where.paymentStatus = String(paymentStatus);
    if (dealDateFrom || dealDateTo) {
      where.dealDate = {};
      if (dealDateFrom) where.dealDate.gte = new Date(String(dealDateFrom));
      if (dealDateTo) where.dealDate.lte = new Date(String(dealDateTo));
    }

    return this.prisma.deal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { id: true, name: true, whatsapp: true, email: true } },
        handler: { select: { id: true, name: true } },
      },
    });
  }

  async getOne(id: number) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        customer: true,
        conversation: { include: { messages: true } },
        handler: { select: { id: true, name: true } },
      },
    });
    if (!deal) {
      throw new NotFoundException("Deal tidak ditemukan");
    }
    return deal;
  }

  async create(businessId: number, body: any, user?: JwtPayload) {
    const businessIdNum = Number(businessId);

    const deal = await this.prisma.$transaction(async (tx) => {
      const created = await tx.deal.create({
        data: {
          businessId: businessIdNum,
          customerId: body.customerId,
          conversationId: body.conversationId,
          handledBy: user?.id,
          product: body.product,
          quantity: body.quantity ?? 1,
          amount: body.amount !== undefined ? Number(body.amount) : null,
          paymentStatus: body.paymentStatus || "UNPAID",
          status: body.status || "PENDING",
          dealDate: body.dealDate ? new Date(body.dealDate) : null,
          notes: body.notes,
          source: body.source || "AUTOMATIC",
        },
      });

      if (body.customerId) {
        await tx.customer.update({
          where: { id: body.customerId },
          data: { lastContactAt: new Date() },
        });
      }

      await tx.notification.create({
        data: {
          businessId: businessIdNum,
          userId: user?.id,
          type: "NEW_DEAL",
          message: `Deal baru dibuat untuk customer #${body.customerId}`,
        },
      });

      return created;
    });

    return deal;
  }

  async update(id: number, body: any, userEmail?: string) {
    const existing = await this.prisma.deal.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Deal tidak ditemukan");
    }

    if (body.paymentStatus && !VALID_PAYMENT.includes(body.paymentStatus)) {
      throw new BadRequestException(`paymentStatus harus: ${VALID_PAYMENT.join(", ")}`);
    }

    const deal = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.deal.update({
        where: { id },
        data: {
          product: body.product,
          quantity: body.quantity,
          amount: body.amount !== undefined ? Number(body.amount) : undefined,
          paymentStatus: body.paymentStatus,
          status: body.status,
          dealDate: body.dealDate ? new Date(body.dealDate) : undefined,
          notes: body.notes,
          handledBy: body.handledBy,
        },
      });

      if ((body.status === "PAID" || body.status === "COMPLETED") && existing.status !== body.status) {
        const prevCustomer = await tx.customer.findUnique({ where: { id: updated.customerId } });
        await tx.customer.update({
          where: { id: updated.customerId },
          data: { status: "DEAL" },
        });
        await tx.customerStatusHistory.create({
          data: {
            customerId: updated.customerId,
            previousStatus: prevCustomer?.status ?? null,
            newStatus: "DEAL",
            changedBy: userEmail || "SYSTEM",
          },
        });
      }

      return updated;
    });

    return deal;
  }

  async stats(businessId: number) {
    const businessIdNum = Number(businessId);
    const [total, confirmed, paid, completed, totalAmount] = await Promise.all([
      this.prisma.deal.count({ where: { businessId: businessIdNum } }),
      this.prisma.deal.count({ where: { businessId: businessIdNum, status: "CONFIRMED" } }),
      this.prisma.deal.count({ where: { businessId: businessIdNum, status: "PAID" } }),
      this.prisma.deal.count({ where: { businessId: businessIdNum, status: "COMPLETED" } }),
      this.prisma.deal.aggregate({
        where: { businessId: businessIdNum, status: { in: ["PAID", "COMPLETED"] } },
        _sum: { amount: true },
      }),
    ]);

    return {
      total,
      confirmed,
      paid,
      completed,
      totalRevenue: totalAmount._sum.amount ?? 0,
    };
  }

  async remove(id: number) {
    const deal = await this.prisma.deal.findUnique({ where: { id } });
    if (!deal) {
      throw new NotFoundException("Deal tidak ditemukan");
    }
    await this.prisma.deal.delete({ where: { id } });
    return deal;
  }
}