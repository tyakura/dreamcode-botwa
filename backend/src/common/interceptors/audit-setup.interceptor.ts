import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";

const ACTION_BY_METHOD: Record<string, string> = {
  POST: "CREATE",
  PATCH: "UPDATE",
  PUT: "UPDATE",
  DELETE: "DELETE",
};

@Injectable()
export class AuditSetupInterceptor implements NestInterceptor {
  constructor(private readonly entity: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();

    req.auditData = {
      businessId: req.params?.businessId
        ? Number(req.params.businessId)
        : undefined,
      action: ACTION_BY_METHOD[req.method] || "UPDATE",
      entity: this.entity,
      entityId: req.params?.id ? Number(req.params.id) : undefined,
      metadata: req.method !== "GET" ? undefined : undefined,
    };

    return next.handle();
  }
}