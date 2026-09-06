import { Request, Response, NextFunction } from "express";
import prisma from "@/lib/prisma";
import { AuthedRequest } from "@/middleware/auth";

export interface AuditEntry {
  businessId?: number;
  action: string;
  entity: string;
  entityId?: number;
  metadata?: unknown;
}

export async function audit(req: AuthedRequest, res: Response, next: NextFunction) {
  res.locals.auditData = null;

  const originalJson = res.json.bind(res);
  res.json = (body: any) => {
    const auditData = res.locals.auditData as AuditEntry | null;
    if (auditData && req.user && req.method !== "GET") {
      prisma.auditLog
        .create({
          data: {
            businessId: auditData.businessId,
            userId: req.user.id,
            action: auditData.action,
            entity: auditData.entity,
            entityId: auditData.entityId,
            metadata: auditData.metadata ? JSON.stringify(auditData.metadata) : null,
          },
        })
        .catch((err) => console.error("Gagal menulis audit log:", err));
    }
    return originalJson(body);
  };

  next();
}
