import { useState, useEffect } from "react";
import { User } from "../types";
import api from "../api/client";

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const fetchUsers = () => {
    setLoading(true);
    setError("");
    api.get("/users")
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => setError(err.response?.data?.error || "Error al cargar usuarios"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", email: "", password: "" });
    setShowForm(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: "" });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        const payload: any = { name: form.name, email: form.email };
        if (form.password) payload.password = form.password;
        await api.put(`/users/${editing.id}`, payload);
      } else {
        await api.post("/users", form);
      }
      setShowForm(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al guardar usuario");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Está seguro de eliminar este usuario?")) return;
    setError("");
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al eliminar usuario");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Ingenieros Agrónomos</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
        >
          + Nuevo Ingeniero
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {editing ? "Editar Ingeniero" : "Nuevo Ingeniero"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editing ? "Nueva contraseña (dejar vacío para mantener)" : "Contraseña *"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editing}
                  minLength={6}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditing(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 rounded-md hover:bg-emerald-600 transition-colors"
              >
                {editing ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No hay ingenieros registrados</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registro</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => openEdit(u)}
                      className="text-emerald-700 hover:text-emerald-800 font-medium mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
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
