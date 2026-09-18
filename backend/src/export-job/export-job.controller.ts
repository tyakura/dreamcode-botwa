import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from "@nestjs/common";
import { ExportJobService } from "./export-job.service";
import { setAudit } from "../common/audit.util";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { JwtPayload } from "../common/jwt.util";

@Controller("api/businesses/:businessId/export-jobs")
export class ExportJobController {
  constructor(private readonly exportJobService: ExportJobService) {}

  @Get()
  list(@Param("businessId", ParseIntPipe) businessId: number) {
    return this.exportJobService.list(businessId);
  }

  @Post()
  create(
    @Param("businessId", ParseIntPipe) businessId: number,
    @Body() body: any,
    @Req() req: any,
    @CurrentUser() user?: JwtPayload,
  ) {
    return this.exportJobService.create(businessId, body, user).then((job) => {
      setAudit(req, {
        businessId,
        action: "CREATE",
        entity: "EXPORT_JOB",
        entityId: job.id,
        metadata: { filter: body.filter },
      });
      return job;
    });
  }

  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number) {
    return this.exportJobService.getOne(id);
  }

  @Post(":id/process")
  process(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    return this.exportJobService.process(id).then((job) => {
      setAudit(req, {
        businessId: job.businessId,
        action: "PROCESS",
        entity: "EXPORT_JOB",
        entityId: job.id,
      });
      return { message: "Export job diproses", status: job.status };
    });
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    return this.exportJobService.remove(id).then((job) => {
      setAudit(req, {
        businessId: job.businessId,
        action: "DELETE",
        entity: "EXPORT_JOB",
        entityId: job.id,
      });
      return { message: "Export job dihapus" };
    });
  }
}