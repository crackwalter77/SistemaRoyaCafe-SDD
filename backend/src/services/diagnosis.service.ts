import { PrismaClient, Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";
import { DiagnosisFilters } from "../types";
import { classifyImage } from "./roboflow.service";
import { env } from "../config/env";

const prisma = new PrismaClient();

export async function createDiagnosis(
  imageUrl: string,
  userId: number,
  caficultorId: number,
  notas?: string
) {
  const diagnosis = await prisma.diagnostico.create({
    data: { imageUrl, userId, caficultorId, notas, resultado: "pendiente" },
    include: { caficultor: true },
  });

  return diagnosis;
}

export async function processDiagnosis(id: number, imageBuffer: Buffer) {
  try {
    const { resultado, confianza } = await classifyImage(imageBuffer);

    return prisma.diagnostico.update({
      where: { id },
      data: { resultado, confianza },
      include: { caficultor: true },
    });
  } catch (err: any) {
    return prisma.diagnostico.update({
      where: { id },
      data: {
        resultado: "Error",
        notas: err.message || "Error al procesar la imagen con Roboflow",
      },
      include: { caficultor: true },
    });
  }
}

export async function getDiagnosisById(id: number, userId: number) {
  const diagnosis = await prisma.diagnostico.findFirst({
    where: { id, userId },
    include: { caficultor: true },
  });

  if (!diagnosis) throw new Error("NOT_FOUND");
  return diagnosis;
}

export async function deleteDiagnosis(id: number, userId: number) {
  const diagnosis = await prisma.diagnostico.findFirst({
    where: { id, userId },
  });
  if (!diagnosis) throw new Error("NOT_FOUND");

  const filename = diagnosis.imageUrl.replace("/api/uploads/", "");
  const filePath = path.resolve(env.UPLOAD_DIR, filename);
  try {
    fs.unlinkSync(filePath);
  } catch {
    // ignore if file already gone
  }

  await prisma.diagnostico.delete({ where: { id } });
}

export async function listDiagnoses(userId: number, filters: DiagnosisFilters) {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;

  const where: Prisma.DiagnosticoWhereInput = { userId };

  if (filters.fechaDesde || filters.fechaHasta) {
    where.fecha = {};
    if (filters.fechaDesde) where.fecha.gte = new Date(filters.fechaDesde);
    if (filters.fechaHasta) where.fecha.lte = new Date(filters.fechaHasta);
  }

  if (filters.resultado) {
    where.resultado = filters.resultado;
  }

  if (filters.confianzaMin !== undefined || filters.confianzaMax !== undefined) {
    where.confianza = {};
    if (filters.confianzaMin !== undefined) where.confianza.gte = filters.confianzaMin;
    if (filters.confianzaMax !== undefined) where.confianza.lte = filters.confianzaMax;
  }

  if (filters.caficultor || filters.finca) {
    where.caficultor = {};
    if (filters.caficultor) {
      (where.caficultor as any).nombre = { contains: filters.caficultor, mode: "insensitive" };
    }
    if (filters.finca) {
      (where.caficultor as any).finca = { contains: filters.finca, mode: "insensitive" };
    }
  }

  const [data, total] = await Promise.all([
    prisma.diagnostico.findMany({
      where,
      include: { caficultor: true },
      orderBy: { fecha: "desc" },
      skip,
      take: limit,
    }),
    prisma.diagnostico.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
