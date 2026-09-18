import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";

@Controller("api/businesses/:businessId/dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  overview(@Param("businessId", ParseIntPipe) businessId: number) {
    return this.dashboardService.overview(businessId);
  }

  @Get("status-distribution")
  statusDistribution(@Param("businessId", ParseIntPipe) businessId: number) {
    return this.dashboardService.statusDistribution(businessId);
  }

  @Get("deals-by-status")
  dealsByStatus(@Param("businessId", ParseIntPipe) businessId: number) {
    return this.dashboardService.dealsByStatus(businessId);
  }
}