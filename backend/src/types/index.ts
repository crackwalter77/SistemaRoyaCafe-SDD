import { Request } from "express";

export interface AuthPayload {
  userId: number;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export type Resultado = "Sana" | "Leve" | "Moderado" | "Severo" | "Error" | "pendiente";

export interface DiagnosisFilters {
  page?: number;
  limit?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  caficultor?: string;
  finca?: string;
  resultado?: string;
  confianzaMin?: number;
  confianzaMax?: number;
}
