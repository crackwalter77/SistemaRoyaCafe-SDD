import { Link } from "react-router-dom";
import { Diagnostico } from "../types";
import { SeverityBadge } from "./SeverityBadge";

export function DiagnosisCard({ diagnosis }: { diagnosis: Diagnostico }) {
  return (
    <Link
      to={`/diagnosis/${diagnosis.id}`}
      className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <img
          src={diagnosis.imageUrl}
          alt="Hoja de café"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <SeverityBadge resultado={diagnosis.resultado} confianza={diagnosis.confianza} />
          <span className="text-xs text-gray-500">
            {new Date(diagnosis.fecha).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <p className="text-sm text-gray-700 font-medium truncate">
          {diagnosis.caficultor.nombre}
        </p>
        <p className="text-xs text-gray-500 truncate">{diagnosis.caficultor.finca}</p>
      </div>
    </Link>
  );
}
