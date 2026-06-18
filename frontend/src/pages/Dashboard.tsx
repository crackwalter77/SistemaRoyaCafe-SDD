import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Diagnostico } from "../types";
import api from "../api/client";
import { DiagnosisCard } from "../components/DiagnosisCard";

export function Dashboard() {
  const [latest, setLatest] = useState<Diagnostico[]>([]);
  const [stats, setStats] = useState({ total: 0, sana: 0, infectadas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/diagnosis?limit=6"),
      api.get("/diagnosis?limit=1"),
    ]).then(([listRes]) => {
      const data: Diagnostico[] = listRes.data.data || [];
      setLatest(data.slice(0, 6));
      setStats({
        total: listRes.data.total || 0,
        sana: data.filter((d) => d.resultado === "Sana").length,
        infectadas: data.filter((d) =>
          ["Leve", "Moderado", "Severo"].includes(d.resultado)
        ).length,
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <Link
          to="/diagnosis/new"
          className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
        >
          + Nuevo Diagnóstico
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Diagnósticos</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Hojas Sanas</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{stats.sana}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Con Roya Detectada</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{stats.infectadas}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Últimos Diagnósticos</h2>
        {latest.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No hay diagnósticos registrados</p>
            <Link
              to="/diagnosis/new"
              className="text-emerald-700 font-medium hover:underline mt-2 inline-block"
            >
              Realizar tu primer diagnóstico
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((d) => (
              <DiagnosisCard key={d.id} diagnosis={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
