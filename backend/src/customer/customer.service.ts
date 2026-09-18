import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

const VALID_STATUSES = ["NEW", "CONTACTED", "INTERESTED", "QUALIFIED", "NEGOTIATION", "DEAL", "LOST"];

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  list(businessId: number, query: any) {
    const { status, isSelected, q, search } = query;
    const where: any = { businessId };
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

    return this.prisma.customer.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { conversations: true, deals: true, followUps: true, statusHistory: true } },
      },
    });
  }

  async getOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        conversations: { include: { messages: { orderBy: { createdAt: "asc" } } } },
        deals: true,
        followUps: true,
        statusHistory: { orderBy: { changedAt: "desc" } },
      },
    });
    if (!customer) {
      throw new NotFoundException("Customer tidak ditemukan");
    }
    return customer;
  }

  create(businessId: number, body: any) {
    return this.prisma.customer.create({
      data: {
        businessId,
        name: body.name,
        whatsapp: String(body.whatsapp).replace(/\D/g, ""),
        email: body.email,
        company: body.company,
        productInterest: body.productInterest,
        needs: body.needs,
        status: body.status || "NEW",
        source: body.source || "WHATSAPP",
        isSelected: body.isSelected ?? false,
      },
    });
  }

  async update(id: number, body: any, userEmail?: string) {
    const existing = await this.prisma.customer.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Customer tidak ditemukan");
    }

    const customer = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.customer.update({
        where: { id },
        data: {
          name: body.name,
          whatsapp: body.whatsapp,
          email: body.email,
          company: body.company,
          productInterest: body.productInterest,
          needs: body.needs,
          status: body.status,
          source: body.source,
          isSelected: body.isSelected,
          lastContactAt: body.lastContactAt ? new Date(body.lastContactAt) : undefined,
        },
      });

      if (body.status && body.status !== existing.status) {
        await tx.customerStatusHistory.create({
          data: {
            customerId: id,
            previousStatus: existing.status,
            newStatus: body.status,
            changedBy: userEmail || "SYSTEM",
          },
        });
      }

      return updated;
    });

    return customer;
  }

  async updateStatus(id: number, status: string, userEmail?: string) {
    if (!VALID_STATUSES.includes(status)) {
      throw new BadRequestException(`Status harus salah satu dari: ${VALID_STATUSES.join(", ")}`);
    }

    const existing = await this.prisma.customer.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException("Customer tidak ditemukan");
    }

    const history = await this.prisma.customerStatusHistory.create({
      data: {
        customerId: id,
        previousStatus: existing.status,
        newStatus: status,
        changedBy: userEmail || "SYSTEM",
      },
    });

    const customer = await this.prisma.customer.update({
      where: { id },
      data: { status },
    });

    return { customer, history };
  }

  toggleSelected(id: number, isSelected?: boolean) {
    return this.prisma.customer.update({
      where: { id },
      data: { isSelected: isSelected ?? true },
    });
  }

  getStatusHistory(id: number) {
    return this.prisma.customerStatusHistory.findMany({
      where: { customerId: id },
      orderBy: { changedAt: "desc" },
    });
  }

  async remove(id: number) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new NotFoundException("Customer tidak ditemukan");
    }
    await this.prisma.customer.delete({ where: { id } });
    return customer;
  }
}