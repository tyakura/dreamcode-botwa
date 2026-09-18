import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { signToken } from "../common/jwt.util";
import { LoginDto, RegisterDto } from "./dto";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { role: true },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException("Email atau password salah");
    }

    if (user.status !== "ACTIVE") {
      throw new ForbiddenException("Akun tidak aktif");
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role.name,
    });

    return {
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        status: user.status,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException("Email sudah terdaftar");
    }

    const ownerRole = await this.prisma.role.findUnique({
      where: { name: "BUSINESS_OWNER" },
    });
    if (!ownerRole) {
      throw new Error(
        "Konfigurasi role tidak ditemukan. Jalankan database seed terlebih dahulu.",
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        roleId: ownerRole.id,
        status: "ACTIVE",
      },
      include: { role: true },
    });

    await this.prisma.business.create({
      data: {
        name: dto.businessName,
        ownerId: user.id,
        status: "ACTIVE",
      },
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      roleName: user.role.name,
    });

    return {
      message: "Registrasi berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name,
        status: user.status,
      },
    };
  }
}