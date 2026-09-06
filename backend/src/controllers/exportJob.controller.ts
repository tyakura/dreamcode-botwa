import { Request, Response } from "express";
import prisma from "@/lib/prisma";
import { AuthedRequest } from "@/middleware/auth";

export async function createExportJob(req: AuthedRequest, res: Response) {
  const { businessId } = req.params;
  const { filter } = req.body;

  const job = await prisma.exportJob.create({
    data: {
      businessId: Number(businessId),
      requestedBy: req.user?.id,
      filter: filter ? JSON.stringify(filter) : null,
      status: "PENDING",
    },
  });

  res.locals.auditData = {
    businessId: Number(businessId),
    action: "CREATE",
    entity: "EXPORT_JOB",
    entityId: job.id,
  };

  return res.status(201).json(job);
}

export async function listExportJobs(req: Request, res: Response) {
  const { businessId } = req.params;
  const { status } = req.query;

  const jobs = await prisma.exportJob.findMany({
    where: {
      businessId: Number(businessId),
      ...(status ? { status: String(status) } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { requester: { select: { id: true, name: true } } },
  });

  return res.json(jobs);
}

export async function getExportJob(req: Request, res: Response) {
  const { id } = req.params;
  const job = await prisma.exportJob.findUnique({
    where: { id: Number(id) },
    include: { requester: { select: { id: true, name: true } } },
  });

  if (!job) return res.status(404).json({ message: "Export job tidak ditemukan" });
  return res.json(job);
}

export async function processExportJob(req: Request, res: Response) {
  const { id } = req.params;

  const job = await prisma.exportJob.findUnique({ where: { id: Number(id) } });
  if (!job) return res.status(404).json({ message: "Export job tidak ditemukan" });

  // Pada MVP ini kita simulasikan export sederhana (bisa diganti real excel)
  let filter: any = {};
  if (job.filter) {
    try { filter = JSON.parse(job.filter); } catch (err) { filter = {}; }
  }

  const customers = await prisma.customer.findMany({
    where: {
      businessId: job.businessId,
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.isSelected !== undefined ? { isSelected: filter.isSelected } : {}),
      ...(filter.source ? { source: filter.source } : {}),
    },
    include: { deals: true, followUps: true, statusHistory: true },
  });

  const filePath = `exports/business-${job.businessId}-export-${job.id}-${Date.now()}.json`;

  const updated = await prisma.exportJob.update({
    where: { id: Number(id) },
    data: {
      status: "DONE",
      filePath,
      completedAt: new Date(),
    },
  });

  // Notifikasi export selesai
  await prisma.notification.create({
    data: {
      businessId: job.businessId,
      userId: job.requestedBy,
      type: "EXPORT_DONE",
      message: `Export selesai: ${customers.length} customer`,
    },
  });

  res.locals.auditData = {
    businessId: job.businessId,
    action: "PROCESS_EXPORT",
    entity: "EXPORT_JOB",
    entityId: job.id,
    metadata: { count: customers.length, status: "DONE" },
  };

  return res.json({ ...updated, count: customers.length, data: customers });
}

export async function failExportJob(req: Request, res: Response) {
  const { id } = req.params;
  const job = await prisma.exportJob.update({
    where: { id: Number(id) },
    data: { status: "FAILED" },
  });
  return res.json(job);
}
