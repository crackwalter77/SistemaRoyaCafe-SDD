import { useState } from "react";
import { Caficultor } from "../types";

interface Props {
  farmer?: Caficultor | null;
  onSubmit: (data: { nombre: string; finca: string; ubicacion: string; telefono: string; email: string }) => void;
  onCancel: () => void;
}

export function FarmerForm({ farmer, onSubmit, onCancel }: Props) {
  const [nombre, setNombre] = useState(farmer?.nombre || "");
  const [finca, setFinca] = useState(farmer?.finca || "");
  const [ubicacion, setUbicacion] = useState(farmer?.ubicacion || "");
  const [telefono, setTelefono] = useState(farmer?.telefono || "");
  const [email, setEmail] = useState(farmer?.email || "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!nombre.trim()) errors.nombre = "El nombre es obligatorio";
    if (!finca.trim()) errors.finca = "La finca es obligatoria";
    const digits = telefono.replace(/\D/g, "");
    if (telefono && digits.length !== 10) {
      errors.telefono = "El número debe tener exactamente 10 dígitos";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (digits.length <= 10) {
      setTelefono(digits);
    }
    if (fieldErrors.telefono) {
      setFieldErrors({ ...fieldErrors, telefono: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ nombre, finca, ubicacion, telefono, email });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
          {fieldErrors.nombre && <p className="text-xs text-red-600 mt-1">{fieldErrors.nombre}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Finca *</label>
          <input
            type="text"
            value={finca}
            onChange={(e) => setFinca(e.target.value)}
            required
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
          {fieldErrors.finca && <p className="text-xs text-red-600 mt-1">{fieldErrors.finca}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            placeholder="Ej: Chiapas, México"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono (10 dígitos)</label>
          <input
            type="tel"
            value={telefono}
            onChange={handleTelefonoChange}
            placeholder="5512345678"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
          {fieldErrors.telefono && <p className="text-xs text-red-600 mt-1">{fieldErrors.telefono}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
          />
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 rounded-md hover:bg-emerald-600 transition-colors"
        >
          {farmer ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
