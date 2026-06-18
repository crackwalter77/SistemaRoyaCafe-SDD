import { useState, useEffect } from "react";
import { Caficultor } from "../types";
import api from "../api/client";
import { FarmerForm } from "../components/FarmerForm";

export function Farmers() {
  const [farmers, setFarmers] = useState<Caficultor[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Caficultor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFarmers = () => {
    setLoading(true);
    setError("");
    const params = search ? `?q=${encodeURIComponent(search)}` : "";
    api.get(`/farmers${params}`)
      .then((res) => setFarmers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        setFarmers([]);
        setError(err.response?.data?.error || "Error al cargar caficultores");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFarmers();
  }, [search]);

  const handleSubmit = async (data: { nombre: string; finca: string; ubicacion: string; telefono: string; email: string }) => {
    try {
      setError("");
      if (editing) {
        await api.put(`/farmers/${editing.id}`, data);
      } else {
        await api.post("/farmers", data);
      }
      setShowForm(false);
      setEditing(null);
      fetchFarmers();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al guardar caficultor");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Está seguro de eliminar este caficultor?")) return;
    try {
      setError("");
      await api.delete(`/farmers/${id}`);
      fetchFarmers();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al eliminar caficultor");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Caficultores</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
        >
          + Nuevo Caficultor
        </button>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o finca..."
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editing ? "Editar Caficultor" : "Nuevo Caficultor"}
          </h2>
          <FarmerForm
            farmer={editing}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
        </div>
      ) : farmers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            {search ? "No se encontraron caficultores" : "No hay caficultores registrados"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Finca</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {farmers.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{f.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{f.finca}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{f.ubicacion || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {f.telefono || f.email ? (
                      <div className="space-y-0.5">
                        {f.telefono && <p>{f.telefono}</p>}
                        {f.email && <p className="text-xs">{f.email}</p>}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => {
                        setEditing(f);
                        setShowForm(true);
                      }}
                      className="text-emerald-700 hover:text-emerald-800 font-medium mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
