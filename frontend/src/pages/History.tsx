import { useState, useEffect, useCallback } from "react";
import { Diagnostico, DiagnosisFilters, PaginatedResponse } from "../types";
import api from "../api/client";
import { DiagnosisCard } from "../components/DiagnosisCard";
import { FilterBar } from "../components/FilterBar";

export function History() {
  const [filters, setFilters] = useState<DiagnosisFilters>({ page: 1, limit: 12 });
  const [data, setData] = useState<PaginatedResponse<Diagnostico> | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });

    api.get(`/diagnosis?${params.toString()}`)
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleDelete(id: number) {
    if (!window.confirm("¿Está seguro de eliminar este diagnóstico? Esta acción no se puede deshacer.")) return;
    try {
      await api.delete(`/diagnosis/${id}`);
      loadData();
    } catch {
      alert("Error al eliminar el diagnóstico");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Historial de Diagnósticos</h1>

      <FilterBar filters={filters} onChange={setFilters} />

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
        </div>
      ) : !data || data.data.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">
            {filters.page && filters.page > 1
              ? "No se encontraron diagnósticos con los filtros aplicados"
              : "No hay diagnósticos registrados"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((d) => (
              <div key={d.id} className="relative group">
                <DiagnosisCard diagnosis={d} />
                <button
                  onClick={(e) => { e.preventDefault(); handleDelete(d.id); }}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-red-500 hover:text-white text-gray-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  title="Eliminar diagnóstico"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setFilters((f) => ({ ...f, page: Math.max(1, (f.page || 1) - 1) }))}
                disabled={filters.page === 1 || (filters.page || 1) <= 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-sm text-gray-600">
                Página {data.page} de {data.totalPages}
              </span>
              <button
                onClick={() =>
                  setFilters((f) => ({ ...f, page: Math.min(data.totalPages, (f.page || 1) + 1) }))
                }
                disabled={(filters.page || 1) >= data.totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md border hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
