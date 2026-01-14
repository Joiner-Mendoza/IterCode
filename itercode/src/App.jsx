import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import AuthContext from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./components/AuthProvider";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RegisterProduct } from "./pages/RegisterProduct";
import { Dashboard } from "./pages/Dashboard";
import { Menu } from "./components/Menu";
import { EditProduct } from "./components/EditProduct";

function AppContent() {
  const { user, loading } = React.useContext(AuthContext); // Obtener el estado de autenticación y carga

  if (loading) return null;

  return (
    <>
      {/* Mostrar menú solo si hay usuario */}
      {user && <Menu />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/RegisterProduct" element={<RegisterProduct />} />
        <Route path="/edit/:id" element={<EditProduct />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<p>Not Found</p>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
