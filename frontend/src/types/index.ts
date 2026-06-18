export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Caficultor {
  id: number;
  nombre: string;
  finca: string;
  ubicacion: string | null;
  telefono: string | null;
  email: string | null;
  activo: boolean;
  createdAt: string;
  userId: number;
}

export type Resultado = "Sana" | "Leve" | "Moderado" | "Severo" | "Error" | "pendiente";

export interface Diagnostico {
  id: number;
  imageUrl: string;
  resultado: Resultado;
  confianza: number | null;
  fecha: string;
  notas: string | null;
  userId: number;
  caficultorId: number;
  caficultor: Caficultor;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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
