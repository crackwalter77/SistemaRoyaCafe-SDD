import { Response } from "express";
import fs from "fs";
import { AuthRequest, DiagnosisFilters } from "../types";
import * as diagnosisService from "../services/diagnosis.service";

export async function create(req: AuthRequest, res: Response) {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Debe adjuntar una imagen" });
      return;
    }

    const { caficultorId, notas } = req.body;

    if (!caficultorId) {
      res.status(400).json({ error: "Debe seleccionar un caficultor" });
      return;
    }

    const imageUrl = `/api/uploads/${req.file.filename}`;

    const diagnosis = await diagnosisService.createDiagnosis(
      imageUrl,
      req.user!.userId,
      parseInt(caficultorId, 10),
      notas
    );

    const imageBuffer = fs.readFileSync(req.file.path);
    const processed = await diagnosisService.processDiagnosis(diagnosis.id, imageBuffer);

    res.status(201).json(processed);
  } catch (err: any) {
    res.status(500).json({ error: "Error al crear diagnóstico" });
  }
}

export async function getById(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(String(req.params.id), 10);
    const diagnosis = await diagnosisService.getDiagnosisById(id, req.user!.userId);
    res.json(diagnosis);
  } catch (err: any) {
    if (err.message === "NOT_FOUND") {
      res.status(404).json({ error: "Diagnóstico no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error al obtener diagnóstico" });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const id = parseInt(String(req.params.id), 10);
    await diagnosisService.deleteDiagnosis(id, req.user!.userId);
    res.json({ message: "Diagnóstico eliminado" });
  } catch (err: any) {
    if (err.message === "NOT_FOUND") {
      res.status(404).json({ error: "Diagnóstico no encontrado" });
      return;
    }
    res.status(500).json({ error: "Error al eliminar diagnóstico" });
  }
}

export async function list(req: AuthRequest, res: Response) {
  try {
    const filters: DiagnosisFilters = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      fechaDesde: req.query.fechaDesde as string | undefined,
      fechaHasta: req.query.fechaHasta as string | undefined,
      caficultor: req.query.caficultor as string | undefined,
      finca: req.query.finca as string | undefined,
      resultado: req.query.resultado as string | undefined,
      confianzaMin: req.query.confianzaMin
        ? parseFloat(req.query.confianzaMin as string)
        : undefined,
      confianzaMax: req.query.confianzaMax
        ? parseFloat(req.query.confianzaMax as string)
        : undefined,
    };

    const result = await diagnosisService.listDiagnoses(req.user!.userId, filters);
    res.json(result);
  } catch {
    res.status(500).json({ error: "Error al listar diagnósticos" });
  }
}
