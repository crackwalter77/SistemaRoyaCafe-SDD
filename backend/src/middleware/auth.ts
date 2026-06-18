import { Response, NextFunction } from "express";
import { verifyToken } from "../services/auth.service";
import { AuthRequest } from "../types";

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header) {
    res.status(401).json({ error: "Token no proporcionado" });
    return;
  }

  const token = header.startsWith("Bearer ") ? header.slice(7) : header;

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}
