import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { JwtPayload } from "../common/jwt.util";

@Injectable()
export class ExportJobService {
  constructor(private readonly prisma: PrismaService) {}

  list(businessId: number) {
    return this.prisma.exportJob.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
      include: {
        requester: { select: { id: true, name: true, email: true } },
      },
    });
  }

  create(businessId: number, body: any, user?: JwtPayload) {
    return this.prisma.exportJob.create({
      data: {
        businessId,
        requestedBy: user?.id,
        filter: body.filter ? JSON.stringify(body.filter) : null,
        status: "PENDING",
      },
    });
  }

  async getOne(id: number) {
    const job = await this.prisma.exportJob.findUnique({
      where: { id },
      include: {
        requester: { select: { id: true, name: true, email: true } },
      },
    });
    if (!job) {
      throw new NotFoundException("Export job tidak ditemukan");
    }
    return job;
  }

  async process(id: number) {
    const job = await this.getOne(id);

    await this.prisma.exportJob.update({
      where: { id },
      data: { status: "PROCESSING" },
    });

    try {
      const parsed = job.filter ? JSON.parse(job.filter) : {};
      const customers = await this.prisma.customer.findMany({
        where: {
          businessId: job.businessId,
          status: parsed.status || undefined,
          source: parsed.source || undefined,
          createdAt: {
            gte: parsed.dateFrom ? new Date(parsed.dateFrom) : undefined,
            lte: parsed.dateTo ? new Date(parsed.dateTo) : undefined,
          },
        },
        include: {
          statusHistory: { orderBy: { changedAt: "desc" } },
          deals: { orderBy: { createdAt: "desc" } },
        },
      });

      const totalRevenue = customers
        .filter((c) => c.deals.some((d) => d.status === "PAID" || d.status === "COMPLETED"))
        .reduce(
          (sum, c) =>
            sum +
            c.deals
              .filter((d) => d.status === "PAID" || d.status === "COMPLETED")
              .reduce((s, d) => s + (d.amount || 0), 0),
          0,
        );

      const result = {
        exportedAt: new Date().toISOString(),
        totalCustomers: customers.length,
        totalRevenue,
        customers: customers.map((c) => ({
          id: c.id,
          name: c.name,
          whatsapp: c.whatsapp,
          email: c.email,
          status: c.status,
          source: c.source,
          lastContactAt: c.lastContactAt,
          lastConversationAt: c.lastConversationAt,
          deals: c.deals.map((d) => ({
            id: d.id,
            product: d.product,
            quantity: d.quantity,
            amount: d.amount,
            status: d.status,
            paymentStatus: d.paymentStatus,
            dealDate: d.dealDate,
          })),
        })),
      };

      const done = await this.prisma.exportJob.update({
        where: { id },
        data: {
          status: "DONE",
          filePath: `exports/job-${id}.json`,
          completedAt: new Date(),
        },
      });

      await this.prisma.notification.create({
        data: {
          businessId: job.businessId,
          userId: job.requestedBy,
          type: "EXPORT_DONE",
          message: `Export data selesai: ${customers.length} pelanggan`,
        },
      });

      return { ...done, result };
    } catch (error) {
      await this.prisma.exportJob.update({
        where: { id },
        data: {
          status: "FAILED",
          completedAt: new Date(),
        },
      });
      throw error;
    }
  }

  async remove(id: number) {
    const job = await this.prisma.exportJob.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundException("Export job tidak ditemukan");
    }
    await this.prisma.exportJob.delete({ where: { id } });
    return job;
  }
}