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
import { BusinessService } from "./business.service";
import {
  Roles,
  SUPER_ADMIN,
  ADMIN,
  BUSINESS_OWNER,
} from "../common/decorators/roles.decorator";

@Controller("api/businesses")
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  @Roles(SUPER_ADMIN, ADMIN)
  list() {
    return this.businessService.listBusinesses();
  }

  @Get(":id")
  getOne(@Param("id", ParseIntPipe) id: number) {
    return this.businessService.getBusiness(id);
  }

  @Post()
  create(@Req() req: any, @Body() body: { name: string; description?: string }) {
    return this.businessService.createBusiness(req.user, body);
  }

  @Patch(":id")
  @Roles(SUPER_ADMIN, BUSINESS_OWNER)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { name?: string; description?: string; status?: string },
  ) {
    return this.businessService.updateBusiness(id, body);
  }

  @Delete(":id")
  @Roles(SUPER_ADMIN)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.businessService.deleteBusiness(id);
  }

  // ==== Business Members ====

  @Get(":businessId/members")
  listMembers(@Param("businessId", ParseIntPipe) businessId: number) {
    return this.businessService.listMembers(businessId);
  }

  @Post(":businessId/members")
  @Roles(SUPER_ADMIN, BUSINESS_OWNER)
  addMember(
    @Param("businessId", ParseIntPipe) businessId: number,
    @Body() body: { userId: number; roleId: number },
  ) {
    return this.businessService.addMember(businessId, body);
  }

  @Patch("members/:id")
  @Roles(SUPER_ADMIN, BUSINESS_OWNER)
  updateMember(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { roleId?: number; status?: string },
  ) {
    return this.businessService.updateMember(id, body);
  }

  @Delete("members/:id")
  @Roles(SUPER_ADMIN, BUSINESS_OWNER)
  removeMember(@Param("id", ParseIntPipe) id: number) {
    return this.businessService.removeMember(id);
  }
}