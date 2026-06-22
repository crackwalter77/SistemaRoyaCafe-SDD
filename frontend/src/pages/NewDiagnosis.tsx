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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/farmers").then((res) => setFarmers(Array.isArray(res.data) ? res.data : []));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFieldErrors({});

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setFieldErrors({ image: "Formato no soportado. Use JPEG o PNG" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFieldErrors({ image: "La imagen excede el tamaño máximo de 10 MB" });
      return;
    }

    setError("");
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setResult(null);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!image) {
      setFieldErrors({ image: "Debe seleccionar una imagen de la hoja de café" });
      return;
    }
    if (!caficultorId) {
      setFieldErrors({ caficultor: "Debe seleccionar un caficultor" });
      return;
    }

    if (farmers.length === 0) {
      setError("No puede realizar el diagnóstico. Primero debe registrar Caficultor y Finca correspondiente.");
      return;
    }

    setLoading(true);

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
    Sana: "La hoja no presenta signos de infección por roya. Continúe con el manejo preventivo habitual y realice monitoreos periódicos.",
    Leve: "Se detecta presencia temprana de roya con baja severidad. Se recomienda monitoreo frecuente cada 3-5 días y aplicación de fungicidas preventivos a base de cobre.",
    Moderado: "Nivel moderado de infección por roya. Se requiere aplicación de fungicidas sistémicos (triazoles o estrobilurinas), eliminación de hojas infectadas y evaluación del resto del cultivo.",
    Severo: "Nivel severo de infección por roya. Se recomienda: 1) Aplicación urgente de fungicidas sistémicos y de contacto, 2) Poda fitosanitaria de ramas afectadas, 3) Evaluación completa del cultivo, 4) Implementar plan de recuperación nutricional.",
  };

  const hasFarmersWithFincas = farmers.length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Nuevo Diagnóstico</h1>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {!hasFarmersWithFincas ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-lg font-medium text-gray-700">No puede realizar el diagnóstico</p>
            <p className="text-sm mt-2">
              Primero debe registrar Caficultor y Finca correspondiente.
            </p>
          </div>
          <button
            onClick={() => navigate("/farmers")}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            Ir a Caficultores
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Caficultor *</label>
            <select
              value={caficultorId}
              onChange={(e) => { setCaficultorId(e.target.value); setFieldErrors({}); }}
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
            {fieldErrors.caficultor && <p className="text-xs text-red-600 mt-1">{fieldErrors.caficultor}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de la hoja *</label>
            <div
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                preview ? "border-emerald-500 bg-emerald-50" : "border-gray-300 hover:border-emerald-500"
              }`}
            >
              {preview ? (
                <div className="space-y-3">
                  <img src={preview} alt="Previsualización" className="max-h-72 mx-auto rounded shadow-sm" />
                  <p className="text-xs text-gray-500">Haga clic en los botones de abajo para cambiar o quitar la imagen</p>
                </div>
              ) : (
                <div className="text-gray-500 py-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                  <p className="text-lg font-medium">Haga clic para seleccionar</p>
                  <p className="text-sm mt-1">JPEG o PNG, máximo 10 MB</p>
                </div>
              )}
            </div>

            {fieldErrors.image && <p className="text-xs text-red-600 mt-1">{fieldErrors.image}</p>}

            {preview && (
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100 transition-colors"
                >
                  Cambiar imagen
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                  Quitar imagen
                </button>
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleImageChange}
              onClick={(e) => { (e.target as HTMLInputElement).value = ""; }}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Procesando...
              </span>
            ) : (
              "Realizar Diagnóstico"
            )}
          </button>
        </form>
      )}

      {result && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Resultado del Diagnóstico</h2>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            {preview && (
              <img src={preview} alt="Hoja analizada" className="w-full sm:w-40 h-40 object-cover rounded-lg border" />
            )}
            <div className="space-y-2">
              <SeverityBadge resultado={result.resultado} confianza={result.confianza} />
              {result.confianza !== null && result.confianza !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        result.resultado === "Sana" ? "bg-green-500" :
                        result.resultado === "Leve" ? "bg-yellow-500" :
                        result.resultado === "Moderado" ? "bg-orange-500" :
                        result.resultado === "Severo" ? "bg-red-500" : "bg-gray-500"
                      }`}
                      style={{ width: `${Math.min(result.confianza, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{result.confianza.toFixed(1)}%</span>
                </div>
              )}
              <p className="text-sm text-gray-500">
                {new Date(result.fecha).toLocaleString("es-ES")}
              </p>
              <p className="text-sm text-gray-600">
                {result.caficultor.nombre} - {result.caficultor.finca}
              </p>
            </div>
          </div>

          {result.resultado !== "Error" && result.resultado !== "pendiente" && (
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-emerald-500">
              <p className="text-sm font-medium text-gray-700 mb-1">Recomendación Fitosanitaria</p>
              <p className="text-sm text-gray-600">{resultDescriptions[result.resultado]}</p>
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
                handleRemoveImage();
                setCaficultorId("");
                setResult(null);
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
