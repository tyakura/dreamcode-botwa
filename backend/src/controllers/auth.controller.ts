import { Request, Response } from "express";
import { body } from "express-validator";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/utils/jwt";
import { validate } from "@/middleware/validate";

export const loginValidators = [
  body("email").isEmail().withMessage("Email tidak valid"),
  body("password").notEmpty().withMessage("Password wajib diisi"),
  validate,
];

export const registerValidators = [
  body("name").notEmpty().withMessage("Nama wajib diisi"),
  body("email").isEmail().withMessage("Email tidak valid"),
  body("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),
  validate,
];

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Email atau password salah" });
  }

  if (user.status !== "ACTIVE") {
    return res.status(403).json({ message: "Akun tidak aktif" });
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    roleId: user.roleId,
    roleName: user.role.name,
  });

  return res.json({
    message: "Login berhasil",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      status: user.status,
    },
  });
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "Email sudah terdaftar" });
  }

  const staffRole = await prisma.role.findUnique({
    where: { name: "STAFF_CS" },
  });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      roleId: staffRole?.id ?? 1,
    },
    include: { role: true },
  });

  const token = signToken({
    id: user.id,
    email: user.email,
    roleId: user.roleId,
    roleName: user.role.name,
  });

  return res.status(201).json({
    message: "Registrasi berhasil",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
}
