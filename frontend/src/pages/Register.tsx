import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await register(name, email, password);
      setSuccess("Registro exitoso. Redirigiendo al inicio de sesión...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      const msg = err.response?.data?.error || "Error al registrarse";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800">Crear Cuenta</h1>
          <p className="text-gray-500 mt-2">Registro de Ingeniero Agrónomo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="Ing. Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="agronomo@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-emerald-700 font-medium hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
