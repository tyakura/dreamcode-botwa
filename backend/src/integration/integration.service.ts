import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { encrypt, decrypt } from "../common/crypto.util";

@Injectable()
export class IntegrationService {
  constructor(private readonly prisma: PrismaService) {}

  list(businessId: number) {
    return this.prisma.integration.findMany({
      where: { businessId },
      select: {
        id: true,
        businessId: true,
        provider: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { provider: "asc" },
    });
  }

  async connect(businessId: number, body: any) {
    const existing = await this.prisma.integration.findUnique({
      where: { provider: body.provider },
    });

    const data = {
      businessId,
      provider: body.provider,
      accessTokenEncrypted: encrypt(body.accessToken || ""),
      status: "CONNECTED",
      config: body.config ? JSON.stringify(body.config) : null,
    };

    if (existing) {
      if (existing.businessId !== businessId) {
        throw new NotFoundException("Integrasi sudah dipakai bisnis lain");
      }
      return this.prisma.integration.update({
        where: { id: existing.id },
        data: {
          accessTokenEncrypted: data.accessTokenEncrypted,
          status: "CONNECTED",
          config: data.config,
        },
      });
    }

    return this.prisma.integration.create({ data });
  }

  async disconnect(id: number) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });
    if (!integration) {
      throw new NotFoundException("Integrasi tidak ditemukan");
    }
    return this.prisma.integration.update({
      where: { id },
      data: { status: "DISCONNECTED" },
    });
  }

  async getAccessToken(id: number): Promise<string> {
    const integration = await this.prisma.integration.findUnique({ where: { id } });
    if (!integration) {
      throw new NotFoundException("Integrasi tidak ditemukan");
    }
    return decrypt(integration.accessTokenEncrypted);
  }

  async remove(id: number) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });
    if (!integration) {
      throw new NotFoundException("Integrasi tidak ditemukan");
    }
    await this.prisma.integration.delete({ where: { id } });
    return integration;
  }

  // ===== Sync Logs =====

  listSyncLogs(businessId: number, integrationId?: number) {
    const where: any = {};
    if (integrationId) where.integrationId = Number(integrationId);
    if (businessId) where.integration = { businessId };

    return this.prisma.hubspotSyncLog.findMany({
      where,
      orderBy: { syncedAt: "desc" },
      include: {
        integration: { select: { id: true, provider: true } },
        customer: { select: { id: true, name: true, whatsapp: true } },
        deal: { select: { id: true, product: true, amount: true, status: true } },
      },
    });
  }

  async recordSyncLog(businessId: number, body: any) {
    const integration = await this.prisma.integration.findFirst({
      where: { businessId, provider: body.provider || "hubspot", status: "CONNECTED" },
    });
    if (!integration) {
      throw new NotFoundException("Integrasi belum terhubung");
    }

    return this.prisma.hubspotSyncLog.create({
      data: {
        integrationId: integration.id,
        entityType: body.entityType,
        entityId: Number(body.entityId),
        syncStatus: body.syncStatus || "SYNCED",
        errorMessage: body.errorMessage,
        syncedAt: body.syncedAt ? new Date(body.syncedAt) : new Date(),
        customerId: body.customerId ? Number(body.customerId) : null,
        dealId: body.dealId ? Number(body.dealId) : null,
      },
    });
  }

  async removeSyncLog(id: number) {
    const log = await this.prisma.hubspotSyncLog.findUnique({ where: { id } });
    if (!log) {
      throw new NotFoundException("Sync log tidak ditemukan");
    }
    await this.prisma.hubspotSyncLog.delete({ where: { id } });
    return log;
  }
}