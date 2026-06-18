import { Response } from "express";
import { AuthRequest } from "../types";
import * as usersService from "../services/users.service";

export async function list(req: AuthRequest, res: Response) {
  try {
    const users = await usersService.listUsers();
    res.json(users);
  } catch {
    res.status(500).json({ error: "Error al listar usuarios" });
  }
}

export async function getById(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(String(req.params.id), 10);
    const user = await usersService.getUserById(id);
    res.json(user);
  } catch (err: any) {
    if (err.message === "NOT_FOUND") {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error al obtener usuario" });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Nombre, email y contraseña son obligatorios" });
      return;
    }
    const user = await usersService.createUser(name, email, password);
    res.status(201).json(user);
  } catch (err: any) {
    if (err.message === "EMAIL_DUPLICATED") {
      res.status(409).json({ error: "El email ya está registrado" });
      return;
    }
    res.status(500).json({ error: "Error al crear usuario" });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { name, email, password } = req.body;
    const user = await usersService.updateUser(id, { name, email, password });
    res.json(user);
  } catch (err: any) {
    if (err.message === "NOT_FOUND") {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    if (err.message === "EMAIL_DUPLICATED") {
      res.status(409).json({ error: "El email ya está registrado" });
      return;
    }
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (id === req.user!.userId) {
      res.status(400).json({ error: "No puedes eliminar tu propio usuario" });
      return;
    }
    await usersService.deleteUser(id);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err: any) {
    if (err.message === "NOT_FOUND") {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
}
