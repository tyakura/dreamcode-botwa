import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      tap(() => {
        const req = context.switchToHttp().getRequest();
        const res = context.switchToHttp().getResponse();

        const auditData = req.auditData;
        if (!auditData || !req.user || req.method === "GET") {
          return;
        }

        // Log audit dijalankan setelah response sukses (fire-and-forget),
        // dipanggil hanya jika controller mengeset req.auditData.
        res.on("finish", () => {
          this.prisma.auditLog
            .create({
              data: {
                businessId: auditData.businessId,
                userId: req.user.id,
                action: auditData.action,
                entity: auditData.entity,
                entityId: auditData.entityId,
                metadata: auditData.metadata
                  ? JSON.stringify(auditData.metadata)
                  : null,
              },
            })
            .catch((err) => console.error("Gagal menulis audit log:", err));
        });
      }),
    );
  }
}