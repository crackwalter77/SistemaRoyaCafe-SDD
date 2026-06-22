import { Response } from "express";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types";
import { env } from "../config/env";

const prisma = new PrismaClient();

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, name: true, email: true, telefono: true, role: true, createdAt: true },
    });
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.json(user);
  } catch {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const { name, email, telefono, password } = req.body;
    const userId = req.user!.userId;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (telefono !== undefined) {
      const digits = telefono.replace(/\D/g, "");
      if (telefono && digits.length !== 10) {
        res.status(400).json({ error: "El teléfono debe tener exactamente 10 dígitos" });
        return;
      }
      data.telefono = digits;
    }
    if (password) {
      if (password.length < 6) {
        res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
        return;
      }
      data.passwordHash = await bcrypt.hash(password, 10);
    }

    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id: userId } },
      });
      if (existing) {
        res.status(409).json({ error: "El email ya está en uso" });
        return;
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, telefono: true, role: true, createdAt: true },
    });

    res.json(user);
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(409).json({ error: "El email ya está en uso" });
      return;
    }
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
}

export async function deleteProfile(req: AuthRequest, res: Response) {
  try {
    const { password } = req.body;
    const userId = req.user!.userId;

    if (!password) {
      res.status(400).json({ error: "Debe ingresar su contraseña para eliminar la cuenta" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Contraseña incorrecta" });
      return;
    }

    const diagnoses = await prisma.diagnostico.findMany({ where: { userId } });
    for (const d of diagnoses) {
      const filename = d.imageUrl.replace("/api/uploads/", "");
      const filePath = path.resolve(env.UPLOAD_DIR, filename);
      try { fs.unlinkSync(filePath); } catch { }
    }
    await prisma.diagnostico.deleteMany({ where: { userId } });
    await prisma.caficultor.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: "Cuenta eliminada correctamente" });
  } catch {
    res.status(500).json({ error: "Error al eliminar la cuenta" });
  }
}
