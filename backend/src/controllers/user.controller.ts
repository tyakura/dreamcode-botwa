import { Request, Response } from "express";
import prisma from "@/lib/prisma";

export async function listRoles(req: Request, res: Response) {
  const roles = await prisma.role.findMany();
  return res.json(roles);
}

export async function createRole(req: Request, res: Response) {
  const { name } = req.body;
  const role = await prisma.role.create({ data: { name } });
  return res.status(201).json(role);
}

export async function listUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      roleId: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    },
  });
  return res.json(users);
}

export async function getUser(req: Request, res: Response) {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
      roleId: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }
  return res.json(user);
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const { name, email, roleId, status } = req.body;

  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { name, email, roleId, status },
    select: {
      id: true,
      name: true,
      email: true,
      roleId: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      role: true,
    },
  });
  return res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  return res.json({ message: "User dihapus" });
}
