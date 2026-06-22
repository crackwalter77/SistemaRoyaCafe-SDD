import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { NewDiagnosis } from "./pages/NewDiagnosis";
import { DiagnosisDetail } from "./pages/DiagnosisDetail";
import { History } from "./pages/History";
import { Farmers } from "./pages/Farmers";
import { Profile } from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="diagnosis/new" element={<NewDiagnosis />} />
        <Route path="diagnosis/:id" element={<DiagnosisDetail />} />
        <Route path="history" element={<History />} />
        <Route path="farmers" element={<Farmers />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
