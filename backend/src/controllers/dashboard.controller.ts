import { Request, Response } from "express";
import prisma from "@/lib/prisma";

export async function getDashboardStats(req: Request, res: Response) {
  const { businessId } = req.params;
  const businessIdNum = Number(businessId);

  const [
    totalCustomers,
    newCustomers,
    interestedCustomers,
    qualifiedCustomers,
    negotiationCustomers,
    dealCustomers,
    selectedCustomers,
    totalDeals,
    dealRevenue,
    openConversations,
    totalMessages,
    pendingFollowUps,
    forbiddenEvents,
    exportJobs,
  ] = await Promise.all([
    prisma.customer.count({ where: { businessId: businessIdNum } }),
    prisma.customer.count({ where: { businessId: businessIdNum, status: "NEW" } }),
    prisma.customer.count({ where: { businessId: businessIdNum, status: "INTERESTED" } }),
    prisma.customer.count({ where: { businessId: businessIdNum, status: "QUALIFIED" } }),
    prisma.customer.count({ where: { businessId: businessIdNum, status: "NEGOTIATION" } }),
    prisma.customer.count({ where: { businessId: businessIdNum, status: "DEAL" } }),
    prisma.customer.count({ where: { businessId: businessIdNum, isSelected: true } }),
    prisma.deal.count({ where: { businessId: businessIdNum } }),
    prisma.deal.aggregate({ where: { businessId: businessIdNum, status: { in: ["PAID", "COMPLETED"] } }, _sum: { amount: true } }),
    prisma.conversation.count({ where: { businessId: businessIdNum, status: "OPEN" } }),
    prisma.message.count(),
    prisma.followUp.count({ where: { businessId: businessIdNum, status: { in: ["SCHEDULED", "SENT"] } } }),
    prisma.forbiddenDataEvent.count({ where: { businessId: businessIdNum } }),
    prisma.exportJob.count({ where: { businessId: businessIdNum, status: { in: ["PENDING", "PROCESSING"] } } }),
  ]);

  return res.json({
    customers: {
      total: totalCustomers,
      byStatus: {
        NEW: newCustomers,
        INTERESTED: interestedCustomers,
        QUALIFIED: qualifiedCustomers,
        NEGOTIATION: negotiationCustomers,
        DEAL: dealCustomers,
      },
      selected: selectedCustomers,
    },
    deals: {
      total: totalDeals,
      revenue: dealRevenue._sum.amount ?? 0,
    },
    conversations: {
      open: openConversations,
      totalMessages,
    },
    followUps: { pending: pendingFollowUps },
    security: { forbiddenEvents },
    exports: { pending: exportJobs },
  });
}

export async function getCustomerStatusDistribution(req: Request, res: Response) {
  const { businessId } = req.params;
  const businessIdNum = Number(businessId);

  const customers = await prisma.customer.findMany({
    where: { businessId: businessIdNum },
    select: { status: true },
  });

  const distribution: Record<string, number> = {};
  for (const c of customers) {
    distribution[c.status] = (distribution[c.status] ?? 0) + 1;
  }

  return res.json(distribution);
}
