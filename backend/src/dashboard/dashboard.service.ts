import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async overview(businessId: number) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true, name: true },
    });
    if (!business) {
      throw new NotFoundException("Bisnis tidak ditemukan");
    }

    const [
      customerCount,
      newCustomers,
      conversationCount,
      openConversations,
      dealCount,
      dealSum,
      paidDealCount,
      totalRevenue,
      agentCount,
      pendingFollowUps,
      unreadNotifications,
      recentCustomers,
      recentDeals,
      recentNotifications,
    ] = await Promise.all([
      this.prisma.customer.count({ where: { businessId } }),
      this.prisma.customer.count({ where: { businessId, status: "NEW" } }),
      this.prisma.conversation.count({ where: { businessId } }),
      this.prisma.conversation.count({ where: { businessId, status: "OPEN" } }),
      this.prisma.deal.count({ where: { businessId } }),
      this.prisma.deal.aggregate({ where: { businessId }, _sum: { amount: true } }),
      this.prisma.deal.count({
        where: { businessId, status: { in: ["PAID", "COMPLETED"] } },
      }),
      this.prisma.deal.aggregate({
        where: { businessId, status: { in: ["PAID", "COMPLETED"] } },
        _sum: { amount: true },
      }),
      this.prisma.aiAgent.count({ where: { businessId } }),
      this.prisma.followUp.count({
        where: { businessId, status: { in: ["SCHEDULED", "PENDING"] } },
      }),
      this.prisma.notification.count({ where: { businessId, isRead: false } }),
      this.prisma.customer.findMany({
        where: { businessId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          whatsapp: true,
          status: true,
          createdAt: true,
        },
      }),
      this.prisma.deal.findMany({
        where: { businessId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          customer: { select: { id: true, name: true, whatsapp: true } },
        },
      }),
      this.prisma.notification.findMany({
        where: { businessId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return {
      business,
      summary: {
        customers: customerCount,
        newCustomers,
        conversations: conversationCount,
        openConversations,
        deals: dealCount,
        dealSum: dealSum._sum.amount || 0,
        paidDeals: paidDealCount,
        totalRevenue: totalRevenue._sum.amount || 0,
        aiAgents: agentCount,
        pendingFollowUps,
        unreadNotifications,
      },
      recent: {
        customers: recentCustomers,
        deals: recentDeals,
        notifications: recentNotifications,
      },
    };
  }

  async statusDistribution(businessId: number) {
    const customers = await this.prisma.customer.groupBy({
      by: ["status"],
      where: { businessId },
      _count: { _all: true },
    });
    return {
      statuses: customers.map((c) => ({
        status: c.status,
        count: c._count._all,
      })),
    };
  }

  async dealsByStatus(businessId: number) {
    const deals = await this.prisma.deal.groupBy({
      by: ["status"],
      where: { businessId },
      _count: { _all: true },
      _sum: { amount: true },
    });
    return {
      deals: deals.map((d) => ({
        status: d.status,
        count: d._count._all,
        totalAmount: d._sum.amount || 0,
      })),
    };
  }
}