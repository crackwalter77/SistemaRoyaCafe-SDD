import { Resultado } from "../types";

const severityConfig: Record<string, { color: string; bg: string; label: string }> = {
  Sana: { color: "text-green-800", bg: "bg-green-100", label: "Sana" },
  Leve: { color: "text-yellow-800", bg: "bg-yellow-100", label: "Leve" },
  Moderado: { color: "text-orange-800", bg: "bg-orange-100", label: "Moderado" },
  Severo: { color: "text-red-800", bg: "bg-red-100", label: "Severo" },
  Error: { color: "text-gray-800", bg: "bg-gray-100", label: "Error" },
  pendiente: { color: "text-blue-800", bg: "bg-blue-100", label: "Procesando..." },
};

export function SeverityBadge({
  resultado,
  confianza,
}: {
  resultado: Resultado;
  confianza: number | null;
}) {
  const config = severityConfig[resultado] || severityConfig.Error;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.color}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          resultado === "Sana"
            ? "bg-green-500"
            : resultado === "Leve"
              ? "bg-yellow-500"
              : resultado === "Moderado"
                ? "bg-orange-500"
                : resultado === "Severo"
                  ? "bg-red-500"
                  : "bg-gray-500"
        }`}
      />
      {config.label}
      {confianza !== null && confianza !== undefined && (
        <span className="opacity-75">({confianza.toFixed(1)}%)</span>
      )}
    </span>
  );
}
