import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { ForbiddenDataService } from "./forbidden-data.service";
import { setAudit } from "../common/audit.util";

@Controller("api/businesses/:businessId/forbidden-data")
export class ForbiddenDataController {
  constructor(private readonly forbiddenDataService: ForbiddenDataService) {}

  // ==== Rules ====

  @Get("rules")
  listRules(@Param("businessId", ParseIntPipe) businessId: number) {
    return this.forbiddenDataService.listRules(businessId);
  }

  @Post("rules")
  createRule(@Param("businessId", ParseIntPipe) businessId: number, @Body() body: any, @Req() req: any) {
    return this.forbiddenDataService.createRule(businessId, body).then((rule) => {
      setAudit(req, {
        businessId,
        action: "CREATE",
        entity: "FORBIDDEN_RULE",
        entityId: rule.id,
        metadata: { name: rule.name, ruleType: rule.ruleType, action: rule.action },
      });
      return rule;
    });
  }

  @Patch("rules/:id")
  updateRule(@Param("id", ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    return this.forbiddenDataService.updateRule(id, body).then((rule) => {
      setAudit(req, {
        businessId: rule.businessId,
        action: "UPDATE",
        entity: "FORBIDDEN_RULE",
        entityId: rule.id,
        metadata: { active: body.active, action: body.action },
      });
      return rule;
    });
  }

  @Delete("rules/:id")
  removeRule(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    return this.forbiddenDataService.removeRule(id).then((rule) => {
      setAudit(req, {
        businessId: rule.businessId,
        action: "DELETE",
        entity: "FORBIDDEN_RULE",
        entityId: rule.id,
      });
      return { message: "Rule dihapus" };
    });
  }

  // ==== Events ====

  @Get("events")
  listEvents(@Param("businessId", ParseIntPipe) businessId: number) {
    return this.forbiddenDataService.listEvents(businessId);
  }

  @Post("detect")
  detect(@Param("businessId", ParseIntPipe) businessId: number, @Body() body: any, @Req() req: any) {
    return this.forbiddenDataService.detect(businessId, body).then((result) => {
      setAudit(req, {
        businessId,
        action: "CREATE",
        entity: "FORBIDDEN_DATA_EVENT",
        metadata: { detectedCount: result.detectedCount, message: result.message },
      });
      return result;
    });
  }

  @Delete("events/:id")
  removeEvent(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    return this.forbiddenDataService.removeEvent(id).then((event) => {
      setAudit(req, {
        businessId: event.businessId,
        action: "DELETE",
        entity: "FORBIDDEN_DATA_EVENT",
        entityId: event.id,
      });
      return { message: "Event dihapus" };
    });
  }
}