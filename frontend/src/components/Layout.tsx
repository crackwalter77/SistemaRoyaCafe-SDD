import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/diagnosis/new", label: "Nuevo Diagnóstico" },
    { to: "/history", label: "Historial" },
    { to: "/farmers", label: "Caficultores" },
    { to: "/profile", label: "Mi Perfil" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-emerald-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold tracking-tight">
                RoyaDetect
              </Link>
              <div className="flex gap-4">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === link.to
                        ? "bg-emerald-700 text-white"
                        : "text-emerald-100 hover:bg-emerald-700"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-emerald-100">{user?.name}</span>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-md text-sm font-medium bg-emerald-700 hover:bg-emerald-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
