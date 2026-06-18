import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listFarmers(userId: number, search?: string) {
  const where: any = { userId, activo: true };

  if (search) {
    where.OR = [
      { nombre: { contains: search, mode: "insensitive" } },
      { finca: { contains: search, mode: "insensitive" } },
    ];
  }

  return prisma.caficultor.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function createFarmer(data: {
  nombre: string;
  finca: string;
  ubicacion?: string;
  telefono?: string;
  email?: string;
  userId: number;
}) {
  return prisma.caficultor.create({ data });
}

export async function updateFarmer(
  id: number,
  userId: number,
  data: { nombre?: string; finca?: string; ubicacion?: string; telefono?: string; email?: string }
) {
  const existing = await prisma.caficultor.findFirst({ where: { id, userId, activo: true } });
  if (!existing) throw new Error("NOT_FOUND");

  return prisma.caficultor.update({ where: { id }, data });
}

export async function deleteFarmer(id: number, userId: number) {
  const existing = await prisma.caficultor.findFirst({ where: { id, userId, activo: true } });
  if (!existing) throw new Error("NOT_FOUND");

  return prisma.caficultor.update({ where: { id }, data: { activo: false } });
}
