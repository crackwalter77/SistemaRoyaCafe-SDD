import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function listUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) throw new Error("NOT_FOUND");
  return user;
}

export async function createUser(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("EMAIL_DUPLICATED");

  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { name, email, passwordHash, role: "agronomist" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export async function updateUser(
  id: number,
  data: { name?: string; email?: string; password?: string }
) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new Error("NOT_FOUND");

  if (data.email && data.email !== existing.email) {
    const emailExists = await prisma.user.findUnique({ where: { email: data.email } });
    if (emailExists) throw new Error("EMAIL_DUPLICATED");
  }

  const updateData: any = {};
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.password) updateData.passwordHash = await bcrypt.hash(data.password, 10);

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export async function deleteUser(id: number) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw new Error("NOT_FOUND");

  await prisma.diagnostico.deleteMany({ where: { userId: id } });
  await prisma.caficultor.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });
}
