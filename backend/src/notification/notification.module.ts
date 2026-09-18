import { Module } from "@nestjs/common";
import {
  AuditLogController,
  BusinessAuditLogController,
  NotificationController,
} from "./notification.controller";
import { NotificationService } from "./notification.service";

@Module({
  controllers: [NotificationController, AuditLogController, BusinessAuditLogController],
  providers: [NotificationService],
})
export class NotificationModule {}