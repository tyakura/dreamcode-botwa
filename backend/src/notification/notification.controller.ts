import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
} from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { setAudit } from "../common/audit.util";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { JwtPayload } from "../common/jwt.util";

@Controller("api/businesses/:businessId/notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  list(@Param("businessId", ParseIntPipe) businessId: number, @Query() query: any) {
    return this.notificationService.list(businessId, query);
  }

  @Get("unread-count")
  unreadCount(
    @Param("businessId", ParseIntPipe) businessId: number,
    @CurrentUser() user?: JwtPayload,
  ) {
    return this.notificationService.unreadCount(businessId, user);
  }

  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number) {
    return this.notificationService.getOne(id);
  }

  @Patch(":id/read")
  markRead(@Param("id", ParseIntPipe) id: number) {
    return this.notificationService.markRead(id);
  }

  @Patch("read-all")
  markAllRead(
    @Param("businessId", ParseIntPipe) businessId: number,
    @CurrentUser() user?: JwtPayload,
  ) {
    return this.notificationService.markAllRead(businessId, user);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    return this.notificationService.remove(id).then((notification) => {
      setAudit(req, {
        businessId: notification.businessId,
        action: "DELETE",
        entity: "NOTIFICATION",
        entityId: notification.id,
      });
      return { message: "Notifikasi dihapus" };
    });
  }
}

@Controller("api/audit-logs")
export class AuditLogController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  list(@Query() query: any) {
    return this.notificationService.listAuditLogs(query);
  }
}

@Controller("api/businesses/:businessId/audit-logs")
export class BusinessAuditLogController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  list(@Param("businessId", ParseIntPipe) businessId: number, @Query() query: any) {
    return this.notificationService.listBusinessAuditLogs(businessId, query);
  }
}