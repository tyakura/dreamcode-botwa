import { Request, Response } from "express";
import prisma from "@/lib/prisma";
import { encrypt, decrypt } from "@/utils/crypto";
import { AuthedRequest } from "@/middleware/auth";

export async function listIntegrations(req: Request, res: Response) {
  const { businessId } = req.params;
  const integrations = await prisma.integration.findMany({
    where: { businessId: Number(businessId) },
    include: { _count: { select: { hubspotSyncLogs: true } } },
  });

  // Jangan bocorkan token encrypted
  return res.json(integrations.map((i) => ({ ...i, accessTokenEncrypted: undefined })));
}

export async function connectIntegration(req: Request, res: Response) {
  const { businessId } = req.params;
  const { provider, accessToken, config } = req.body;

  const integration = await prisma.integration.upsert({
    where: { provider },
    create: {
      businessId: Number(businessId),
      provider,
      accessTokenEncrypted: encrypt(accessToken),
      status: "CONNECTED",
      config: config ? JSON.stringify(config) : null,
    },
    update: {
      accessTokenEncrypted: accessToken ? encrypt(accessToken) : undefined,
      status: "CONNECTED",
      config: config ? JSON.stringify(config) : undefined,
    },
  });

  res.locals.auditData = {
    businessId: Number(businessId),
    action: "CONNECT",
    entity: "INTEGRATION",
    entityId: integration.id,
    metadata: { provider },
  };

  return res.status(201).json({ ...integration, accessTokenEncrypted: undefined });
}

export async function disconnectIntegration(req: Request, res: Response) {
  const { id } = req.params;
  const integration = await prisma.integration.update({
    where: { id: Number(id) },
    data: { status: "DISCONNECTED" },
  });
  res.locals.auditData = { businessId: integration.businessId, action: "DISCONNECT", entity: "INTEGRATION", entityId: integration.id };
  return res.json({ message: "Integrasi diputuskan" });
}

// ===== HubSpot Sync Logs =====

export async function listSyncLogs(req: Request, res: Response) {
  const { businessId } = req.params;

  const integrations = await prisma.integration.findMany({
    where: { businessId: Number(businessId) },
    select: { id: true },
  });
  const integrationIds = integrations.map((i) => i.id);

  const logs = await prisma.hubspotSyncLog.findMany({
    where: { integrationId: { in: integrationIds } },
    orderBy: { syncedAt: "desc" },
    include: { integration: { select: { provider: true } } },
  });
  return res.json(logs);
}

export async function syncEntity(req: AuthedRequest, res: Response) {
  const { integrationId } = req.params;
  const { entityType, entityId, customerId, dealId } = req.body;

  const log = await prisma.hubspotSyncLog.create({
    data: {
      integrationId: Number(integrationId),
      entityType: entityType || (customerId ? "CUSTOMER" : "DEAL"),
      entityId,
      customerId: customerId ? Number(customerId) : null,
      dealId: dealId ? Number(dealId) : null,
      syncStatus: "PENDING",
    },
  });

  const integration = await prisma.integration.findUnique({ where: { id: Number(integrationId) } });
  if (!integration) return res.status(404).json({ message: "Integrasi tidak ditemukan" });

  res.locals.auditData = {
    businessId: integration.businessId,
    action: "SYNC",
    entity: "HUBSPOT_SYNC_LOG",
    entityId: log.id,
    metadata: { entityType, entityId },
  };

  return res.status(201).json(log);
}

export async function updateSyncStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { syncStatus, errorMessage } = req.body;

  if (!["SYNCED", "PENDING", "FAILED"].includes(syncStatus)) {
    return res.status(400).json({ message: "syncStatus harus SYNCED, PENDING, atau FAILED" });
  }

  const log = await prisma.hubspotSyncLog.update({
    where: { id: Number(id) },
    data: {
      syncStatus,
      errorMessage,
      syncedAt: syncStatus === "SYNCED" ? new Date() : null,
    },
  });
  return res.json(log);
}
