import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { Roles } from "../common/decorators/roles.decorator";

@Controller("api")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("roles")
  listRoles() {
    return this.usersService.listRoles();
  }

  @Post("roles")
  @Roles("SUPER_ADMIN", "ADMIN")
  createRole(@Body() body: { name: string }) {
    return this.usersService.createRole(body.name);
  }

  @Get("users")
  @Roles("SUPER_ADMIN", "ADMIN")
  listUsers() {
    return this.usersService.listUsers();
  }

  @Get("users/:id")
  @Roles("SUPER_ADMIN", "ADMIN")
  getUser(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.getUser(id);
  }

  @Patch("users/:id")
  @Roles("SUPER_ADMIN", "ADMIN")
  updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { name?: string; email?: string; roleId?: number; status?: string },
  ) {
    return this.usersService.updateUser(id, body);
  }

  @Delete("users/:id")
  @Roles("SUPER_ADMIN")
  deleteUser(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}