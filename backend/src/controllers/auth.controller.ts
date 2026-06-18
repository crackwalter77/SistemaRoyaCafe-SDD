import { Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { AuthRequest } from "../types";

export async function register(req: AuthRequest, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Nombre, email y contraseña son obligatorios" });
      return;
    }

    const user = await registerUser(name, email, password);
    res.status(201).json(user);
  } catch (err: any) {
    if (err.message === "EMAIL_DUPLICATED") {
      res.status(409).json({ error: "El email ya está registrado" });
      return;
    }
    res.status(500).json({ error: "Error al registrar usuario" });
  }
}

export async function login(req: AuthRequest, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email y contraseña son obligatorios" });
      return;
    }

    const result = await loginUser(email, password);
    res.json(result);
  } catch (err: any) {
    if (err.message === "INVALID_CREDENTIALS") {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}
