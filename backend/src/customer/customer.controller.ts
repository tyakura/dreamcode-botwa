import {
  BadRequestException,
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
import { CustomerService } from "./customer.service";
import { setAudit } from "../common/audit.util";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { JwtPayload } from "../common/jwt.util";

@Controller("api/businesses/:businessId/customers")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  list(@Param("businessId", ParseIntPipe) businessId: number, @Query() query: any) {
    return this.customerService.list(businessId, query);
  }

  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number) {
    return this.customerService.getOne(id);
  }

  @Post()
  create(@Param("businessId", ParseIntPipe) businessId: number, @Body() body: any, @Req() req: any) {
    return this.customerService.create(businessId, body).then((customer) => {
      setAudit(req, {
        businessId,
        action: "CREATE",
        entity: "CUSTOMER",
        entityId: customer.id,
        metadata: { status: customer.status, source: customer.source },
      });
      return customer;
    });
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() body: any, @Req() req: any, @CurrentUser() user: JwtPayload | undefined) {
    return this.customerService.update(id, body, user?.email).then((customer) => {
      setAudit(req, {
        businessId: customer.businessId,
        action: "UPDATE",
        entity: "CUSTOMER",
        entityId: customer.id,
        metadata: { fromStatus: body.fromStatus, toStatus: customer.status },
      });
      return customer;
    });
  }

  @Patch(":id/status")
  updateStatus(@Param("id", ParseIntPipe) id: number, @Body() body: { status: string }, @Req() req: any, @CurrentUser() user: JwtPayload | undefined) {
    return this.customerService.updateStatus(id, body.status, user?.email).then((result) => {
      setAudit(req, {
        businessId: result.customer.businessId,
        action: "UPDATE_STATUS",
        entity: "CUSTOMER",
        entityId: result.customer.id,
        metadata: { fromStatus: result.history.previousStatus, toStatus: result.customer.status },
      });
      return result;
    });
  }

  @Patch(":id/select")
  toggleSelected(@Param("id", ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    return this.customerService.toggleSelected(id, body.isSelected ?? true).then((customer) => {
      setAudit(req, {
        businessId: customer.businessId,
        action: customer.isSelected ? "SELECT" : "UNSELECT",
        entity: "CUSTOMER",
        entityId: customer.id,
      });
      return customer;
    });
  }

  @Get(":id/status-history")
  getStatusHistory(@Param("id", ParseIntPipe) id: number) {
    return this.customerService.getStatusHistory(id);
  }

@Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
    @Param("businessId", ParseIntPipe) businessId: number,
    @Req() req: any,
  ) {
    return this.customerService.remove(id).then((customer) => {
      setAudit(req, {
        businessId,
        action: "DELETE",
        entity: "CUSTOMER",
        entityId: id,
      });
      return { message: "Customer dihapus" };
    });
  }
}