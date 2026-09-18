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
import { DealService } from "./deal.service";
import { setAudit } from "../common/audit.util";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { JwtPayload } from "../common/jwt.util";

@Controller("api/businesses/:businessId/deals")
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @Get()
  list(@Param("businessId", ParseIntPipe) businessId: number, @Query() query: any) {
    return this.dealService.list(businessId, query);
  }

  @Get("stats")
  stats(@Param("businessId", ParseIntPipe) businessId: number) {
    return this.dealService.stats(businessId);
  }

  @Post()
  create(
    @Param("businessId", ParseIntPipe) businessId: number,
    @Body() body: any,
    @Req() req: any,
    @CurrentUser() user?: JwtPayload,
  ) {
    return this.dealService.create(businessId, body, user).then((deal) => {
      setAudit(req, {
        businessId,
        action: "CREATE",
        entity: "DEAL",
        entityId: deal.id,
        metadata: { amount: body.amount, product: body.product, status: deal.status },
      });
      return deal;
    });
  }

  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number) {
    return this.dealService.getOne(id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: any,
    @Req() req: any,
    @CurrentUser() user?: JwtPayload,
  ) {
    return this.dealService.update(id, body, user?.email).then((deal) => {
      setAudit(req, {
        businessId: deal.businessId,
        action: "UPDATE",
        entity: "DEAL",
        entityId: deal.id,
        metadata: { fromStatus: body.fromStatus, toStatus: deal.status, paymentStatus: deal.paymentStatus },
      });
      return deal;
    });
  }

  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Req() req: any,
  ) {
    return this.dealService.remove(id).then((deal) => {
      setAudit(req, {
        businessId,
        action: "DELETE",
        entity: "DEAL",
        entityId: id,
      });
      return { message: "Deal dihapus" };
    });
  }
}