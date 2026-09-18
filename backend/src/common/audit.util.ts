import type { Request } from "express";

export interface AuditData {
  businessId?: number;
  action: string;
  entity: string;
  entityId?: number;
  metadata?: unknown;
}

export function setAudit(req: Request, data: AuditData) {
  req.auditData = data;
}