import { DiagnosisFilters } from "../types";

interface Props {
  filters: DiagnosisFilters;
  onChange: (filters: DiagnosisFilters) => void;
}

export function FilterBar({ filters, onChange }: Props) {
  const update = (key: keyof DiagnosisFilters, value: string | number | undefined) => {
    onChange({ ...filters, [key]: value || undefined, page: 1 });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Resultado</label>
          <select
            value={filters.resultado || ""}
            onChange={(e) => update("resultado", e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option value="">Todos</option>
            <option value="Sana">Sana</option>
            <option value="Leve">Leve</option>
            <option value="Moderado">Moderado</option>
            <option value="Severo">Severo</option>
            <option value="Error">Error</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Caficultor</label>
          <input
            type="text"
            value={filters.caficultor || ""}
            onChange={(e) => update("caficultor", e.target.value)}
            placeholder="Buscar..."
            className="w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Finca</label>
          <input
            type="text"
            value={filters.finca || ""}
            onChange={(e) => update("finca", e.target.value)}
            placeholder="Buscar..."
            className="w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
          <input
            type="date"
            value={filters.fechaDesde || ""}
            onChange={(e) => update("fechaDesde", e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
          <input
            type="date"
            value={filters.fechaHasta || ""}
            onChange={(e) => update("fechaHasta", e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => onChange({ page: 1 })}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
