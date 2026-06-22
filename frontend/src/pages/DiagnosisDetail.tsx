import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Diagnostico } from "../types";
import api from "../api/client";
import { SeverityBadge } from "../components/SeverityBadge";

const resultDescriptions: Record<string, string> = {
  Sana: "La hoja no presenta signos de infección por roya (Hemileia vastatrix). Continúe con el manejo preventivo habitual y realice monitoreos periódicos.",
  Leve: "Se detecta presencia temprana de roya con baja severidad. Se recomienda monitoreo frecuente cada 3-5 días y aplicación de fungicidas preventivos a base de cobre.",
  Moderado: "Nivel moderado de infección por roya. Se requiere aplicación de fungicidas sistémicos (triazoles o estrobilurinas), eliminación de hojas infectadas y evaluación del resto del cultivo.",
  Severo: "Nivel severo de infección por roya. Se recomienda: 1) Aplicación urgente de fungicidas sistémicos y de contacto, 2) Poda fitosanitaria de ramas afectadas, 3) Evaluación completa del cultivo, 4) Implementar plan de recuperación nutricional.",
};

export function DiagnosisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState<Diagnostico | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get(`/diagnosis/${id}`)
      .then((res) => setDiagnosis(res.data))
      .catch(() => setDiagnosis(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm("¿Está seguro de eliminar este diagnóstico? Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    try {
      await api.delete(`/diagnosis/${id}`);
      navigate("/history");
    } catch {
      alert("Error al eliminar el diagnóstico");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Diagnóstico no encontrado</p>
        <Link to="/" className="text-emerald-700 font-medium hover:underline mt-2 inline-block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const confianzaColor = diagnosis.resultado === "Sana" ? "bg-green-500" :
    diagnosis.resultado === "Leve" ? "bg-yellow-500" :
    diagnosis.resultado === "Moderado" ? "bg-orange-500" :
    diagnosis.resultado === "Severo" ? "bg-red-500" : "bg-gray-500";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/history" className="text-emerald-700 font-medium hover:underline text-sm">
          &larr; Volver al historial
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50"
        >
          {deleting ? "Eliminando..." : "Eliminar diagnóstico"}
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800">Detalle del Diagnóstico</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <img
          src={diagnosis.imageUrl}
          alt="Hoja de café analizada"
          className="w-full max-h-96 object-contain bg-gray-100"
        />

        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Resultado</p>
              <SeverityBadge resultado={diagnosis.resultado} confianza={diagnosis.confianza} />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Fecha</p>
              <p className="text-sm font-medium text-gray-800">
                {new Date(diagnosis.fecha).toLocaleString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {diagnosis.confianza !== null && diagnosis.confianza !== undefined && diagnosis.resultado !== "Error" && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Confianza del modelo</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${confianzaColor}`}
                    style={{ width: `${Math.min(diagnosis.confianza, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 min-w-[4rem] text-right">
                  {diagnosis.confianza.toFixed(1)}%
                </span>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Información del Caficultor</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Nombre</p>
                <p className="text-sm font-medium text-gray-800">{diagnosis.caficultor.nombre}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Finca</p>
                <p className="text-sm font-medium text-gray-800">{diagnosis.caficultor.finca}</p>
              </div>
              {diagnosis.caficultor.ubicacion && (
                <div>
                  <p className="text-xs text-gray-500">Ubicación</p>
                  <p className="text-sm font-medium text-gray-800">{diagnosis.caficultor.ubicacion}</p>
                </div>
              )}
            </div>
          </div>

          {diagnosis.resultado !== "Error" && diagnosis.resultado !== "pendiente" && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Recomendación Fitosanitaria</h3>
              <div className={`rounded-lg p-4 border-l-4 ${
                diagnosis.resultado === "Sana" ? "bg-green-50 border-green-500" :
                diagnosis.resultado === "Leve" ? "bg-yellow-50 border-yellow-500" :
                diagnosis.resultado === "Moderado" ? "bg-orange-50 border-orange-500" :
                "bg-red-50 border-red-500"
              }`}>
                <p className="text-sm text-gray-700">{resultDescriptions[diagnosis.resultado]}</p>
              </div>
            </div>
          )}

          {diagnosis.notas && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Notas</h3>
              <p className="text-sm text-gray-700">{diagnosis.notas}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
