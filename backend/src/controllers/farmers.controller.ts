import { Response } from "express";
import { AuthRequest } from "../types";
import * as farmersService from "../services/farmers.service";

export async function list(req: AuthRequest, res: Response) {
  try {
    const search = req.query.q as string | undefined;
    const farmers = await farmersService.listFarmers(req.user!.userId, search);
    res.json(farmers);
  } catch {
    res.status(500).json({ error: "Error al listar caficultores" });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    const { nombre, finca, ubicacion, telefono, email } = req.body;

    if (!nombre || !finca) {
      res.status(400).json({ error: "Los campos nombre y finca son obligatorios" });
      return;
    }

    const farmer = await farmersService.createFarmer({
      nombre,
      finca,
      ubicacion,
      telefono,
      email,
      userId: req.user!.userId,
    });

    res.status(201).json(farmer);
  } catch {
    res.status(500).json({ error: "Error al crear caficultor" });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(String(req.params.id), 10);
    const { nombre, finca, ubicacion, telefono, email } = req.body;

    const farmer = await farmersService.updateFarmer(id, req.user!.userId, {
      nombre,
      finca,
      ubicacion,
      telefono,
      email,
    });

    res.json(farmer);
  } catch (err: any) {
    if (err.message === "NOT_FOUND") {
      res.status(404).json({ error: "Caficultor no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error al actualizar caficultor" });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(String(req.params.id), 10);
    await farmersService.deleteFarmer(id, req.user!.userId);
    res.json({ message: "Caficultor eliminado correctamente" });
  } catch (err: any) {
    if (err.message === "NOT_FOUND") {
      res.status(404).json({ error: "Caficultor no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error al eliminar caficultor" });
  }
}
