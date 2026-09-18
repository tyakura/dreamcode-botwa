import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { IntegrationService } from "./integration.service";
import { setAudit } from "../common/audit.util";

@Controller("api/businesses/:businessId/integrations")
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Get()
  list(@Param("businessId", ParseIntPipe) businessId: number) {
    return this.integrationService.list(businessId);
  }

  @Post()
  connect(@Param("businessId", ParseIntPipe) businessId: number, @Body() body: any, @Req() req: any) {
    return this.integrationService.connect(businessId, body).then((integration) => {
      setAudit(req, {
        businessId,
        action: "CONNECT",
        entity: "INTEGRATION",
        entityId: integration.id,
        metadata: { provider: integration.provider },
      });
      return integration;
    });
  }

  @Patch(":id/disconnect")
  disconnect(
    @Param("id", ParseIntPipe) id: number,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Req() req: any,
  ) {
    return this.integrationService.disconnect(id).then((integration) => {
      setAudit(req, {
        businessId,
        action: "DISCONNECT",
        entity: "INTEGRATION",
        entityId: integration.id,
        metadata: { provider: integration.provider },
      });
      return integration;
    });
  }

  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Req() req: any,
  ) {
    return this.integrationService.remove(id).then((integration) => {
      setAudit(req, {
        businessId,
        action: "DELETE",
        entity: "INTEGRATION",
        entityId: integration.id,
        metadata: { provider: integration.provider },
      });
      return { message: "Integrasi dihapus" };
    });
  }

  // ===== Sync Logs =====

  @Get("sync-logs")
  listSyncLogs(
    @Param("businessId", ParseIntPipe) businessId: number,
    @Query() query: any,
  ) {
    const integrationId = query.integrationId ? Number(query.integrationId) : undefined;
    return this.integrationService.listSyncLogs(businessId, integrationId);
  }

  @Post("sync-logs")
  recordSyncLog(@Param("businessId", ParseIntPipe) businessId: number, @Body() body: any, @Req() req: any) {
    return this.integrationService.recordSyncLog(businessId, body).then((log) => {
      setAudit(req, {
        businessId,
        action: "CREATE",
        entity: "SYNC_LOG",
        entityId: log.id,
        metadata: { entityType: log.entityType, syncStatus: log.syncStatus },
      });
      return log;
    });
  }

  @Delete("sync-logs/:id")
  removeSyncLog(
    @Param("id", ParseIntPipe) id: number,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Req() req: any,
  ) {
    return this.integrationService.removeSyncLog(id).then((log) => {
      setAudit(req, {
        businessId,
        action: "DELETE",
        entity: "SYNC_LOG",
        entityId: log.id,
      });
      return { message: "Sync log dihapus" };
    });
  }
}