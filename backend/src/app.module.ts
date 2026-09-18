import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { PrismaModule } from "./prisma/prisma.module";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { AuditInterceptor } from "./common/interceptors/audit.interceptor";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { BusinessModule } from "./business/business.module";
import { CustomerModule } from "./customer/customer.module";
import { ConversationModule } from "./conversation/conversation.module";
import { DealModule } from "./deal/deal.module";
import { AiAgentModule } from "./ai-agent/ai-agent.module";
import { FollowUpModule } from "./follow-up/follow-up.module";
import { ForbiddenDataModule } from "./forbidden-data/forbidden-data.module";
import { IntegrationModule } from "./integration/integration.module";
import { ExportJobModule } from "./export-job/export-job.module";
import { NotificationModule } from "./notification/notification.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { HealthController, RootController } from "./health.controller";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    BusinessModule,
    CustomerModule,
    ConversationModule,
    DealModule,
    AiAgentModule,
    FollowUpModule,
    ForbiddenDataModule,
    IntegrationModule,
    ExportJobModule,
    NotificationModule,
    DashboardModule,
  ],
  controllers: [HealthController, RootController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}