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
import { FollowUpService } from "./follow-up.service";
import { setAudit } from "../common/audit.util";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { JwtPayload } from "../common/jwt.util";

@Controller("api/businesses/:businessId/follow-ups")
export class FollowUpController {
  constructor(private readonly followUpService: FollowUpService) {}

  @Get()
  list(@Param("businessId", ParseIntPipe) businessId: number, @Query() query: any) {
    return this.followUpService.list(businessId, query);
  }

  @Post()
  create(@Param("businessId", ParseIntPipe) businessId: number, @Body() body: any, @Req() req: any, @CurrentUser() user?: JwtPayload) {
    return this.followUpService.create(businessId, body, user).then((followUp) => {
      setAudit(req, {
        businessId,
        action: "CREATE",
        entity: "FOLLOW_UP",
        entityId: followUp.id,
        metadata: { type: followUp.type, channel: followUp.channel, scheduledAt: followUp.scheduledAt },
      });
      return followUp;
    });
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    return this.followUpService.update(id, body).then((followUp) => {
      setAudit(req, {
        businessId: followUp.businessId,
        action: "UPDATE",
        entity: "FOLLOW_UP",
        entityId: followUp.id,
        metadata: { status: body.status },
      });
      return followUp;
    });
  }

  @Patch(":id/sent")
  markSent(@Param("id", ParseIntPipe) id: number) {
    return this.followUpService.markSent(id);
  }

  @Patch(":id/replied")
  markReplied(@Param("id", ParseIntPipe) id: number) {
    return this.followUpService.markReplied(id);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    return this.followUpService.remove(id).then((followUp) => {
      setAudit(req, {
        businessId: followUp.businessId,
        action: "DELETE",
        entity: "FOLLOW_UP",
        entityId: id,
      });
      return { message: "Follow up dihapus" };
    });
  }

  // ==== Settings ====

  @Get("settings")
  getSettings(@Param("businessId", ParseIntPipe) businessId: number) {
    return this.followUpService.getSettings(businessId);
  }

  @Post("settings")
  createSetting(@Param("businessId", ParseIntPipe) businessId: number, @Body() body: any, @Req() req: any) {
    return this.followUpService.createSetting(businessId, body).then((setting) => {
      setAudit(req, {
        businessId,
        action: "CREATE",
        entity: "FOLLOW_UP_SETTING",
        entityId: setting.id,
      });
      return setting;
    });
  }

  @Patch("settings/:id")
  updateSetting(@Param("id", ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    return this.followUpService.updateSetting(id, body).then((setting) => {
      setAudit(req, {
        businessId: setting.businessId,
        action: "UPDATE",
        entity: "FOLLOW_UP_SETTING",
        entityId: setting.id,
      });
      return setting;
    });
  }

  @Delete("settings/:id")
  removeSetting(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    return this.followUpService.removeSetting(id).then((setting) => {
      setAudit(req, {
        businessId: setting.businessId,
        action: "DELETE",
        entity: "FOLLOW_UP_SETTING",
        entityId: id,
      });
      return { message: "Setting dihapus" };
    });
  }
}