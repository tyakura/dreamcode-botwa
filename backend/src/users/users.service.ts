import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { JwtPayload } from "../common/jwt.util";

const userSelect = {
  id: true,
  name: true,
  email: true,
  roleId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  role: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  listRoles() {
    return this.prisma.role.findMany();
  }

  createRole(name: string) {
    return this.prisma.role.create({ data: { name } });
  }

  listUsers() {
    return this.prisma.user.findMany({ select: userSelect });
  }

  async getUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
    if (!user) {
      throw new NotFoundException("User tidak ditemukan");
    }
    return user;
  }

  updateUser(id: number, body: { name?: string; email?: string; roleId?: number; status?: string }) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        roleId: body.roleId,
        status: body.status,
      },
      select: userSelect,
    });
  }

  async deleteUser(id: number) {
    await this.prisma.user.delete({ where: { id } });
    return { message: "User dihapus" };
  }
}