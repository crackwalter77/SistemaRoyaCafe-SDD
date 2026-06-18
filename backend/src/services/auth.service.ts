import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { env } from "../config/env";
import { AuthPayload } from "../types";

const prisma = new PrismaClient();

export async function registerUser(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("EMAIL_DUPLICATED");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: "agronomist" },
  });

  return { id: user.id, name: user.name, email: user.email };
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const payload: AuthPayload = { userId: user.id, email: user.email, role: user.role };
  const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "24h" });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
}
