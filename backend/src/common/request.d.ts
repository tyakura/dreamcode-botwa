import "reflect-metadata";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      email: string;
      roleId: number;
      roleName: string;
    };
    auditData?: {
      businessId?: number;
      action: string;
      entity: string;
      entityId?: number;
      metadata?: unknown;
    };
  }
}

export {};