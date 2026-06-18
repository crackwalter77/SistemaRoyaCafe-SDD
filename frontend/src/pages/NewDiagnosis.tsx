import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Caficultor, Diagnostico } from "../types";
import api from "../api/client";
import { SeverityBadge } from "../components/SeverityBadge";

export function NewDiagnosis() {
  const [farmers, setFarmers] = useState<Caficultor[]>([]);
  const [caficultorId, setCaficultorId] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Diagnostico | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/farmers").then((res) => setFarmers(res.data));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Formato no soportado. Use JPEG o PNG");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("La imagen excede el tamaño máximo de 10 MB");
      return;
    }

    setError("");
    setImage(file);
    setResult(null);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !caficultorId) {
      setError("Debe seleccionar un caficultor y una imagen");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("caficultorId", caficultorId);

      const { data } = await api.post("/diagnosis", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al procesar el diagnóstico");
    } finally {
      setLoading(false);
    }
  };

  const resultDescriptions: Record<string, string> = {
    Sana: "La hoja no presenta signos de infección por roya. Continúe con el manejo preventivo habitual.",
    Leve: "Se detecta presencia temprana de roya. Se recomienda monitoreo frecuente y aplicación de fungicidas preventivos.",
    Moderado: "Nivel moderado de infección. Se requiere aplicación de fungicidas sistémicos y eliminación de hojas infectadas.",
    Severo: "Nivel severo de infección. Se recomienda aplicación urgente de fungicidas, poda fitosanitaria y evaluación del cultivo completo.",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Nuevo Diagnóstico</h1>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Caficultor *</label>
          <select
            value={caficultorId}
            onChange={(e) => setCaficultorId(e.target.value)}
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="">Seleccione un caficultor</option>
            {farmers.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre} - {f.finca}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de la hoja *</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors"
          >
            {preview ? (
              <img src={preview} alt="Previsualización" className="max-h-64 mx-auto rounded" />
            ) : (
              <div className="text-gray-500">
                <p className="text-lg font-medium">Haga clic para seleccionar</p>
                <p className="text-sm mt-1">JPEG o PNG, máximo 10 MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !image || !caficultorId}
          className="w-full py-3 px-4 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Procesando..." : "Realizar Diagnóstico"}
        </button>
      </form>

      {result && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Resultado del Diagnóstico</h2>

          <div className="flex items-center gap-4">
            {preview && (
              <img src={preview} alt="Hoja analizada" className="w-32 h-32 object-cover rounded-lg" />
            )}
            <div>
              <SeverityBadge resultado={result.resultado} confianza={result.confianza} />
              <p className="text-sm text-gray-500 mt-2">
                {new Date(result.fecha).toLocaleString("es-ES")}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {result.caficultor.nombre} - {result.caficultor.finca}
              </p>
            </div>
          </div>

          {result.resultado !== "Error" && result.resultado !== "pendiente" && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">{resultDescriptions[result.resultado]}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/diagnosis/${result.id}`)}
              className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
            >
              Ver Detalle
            </button>
            <button
              onClick={() => {
                setImage(null);
                setPreview(null);
                setResult(null);
                setCaficultorId("");
                setError("");
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Nuevo Diagnóstico
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
