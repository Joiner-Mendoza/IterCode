import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./components/AuthProvider";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RegisterProduct } from "./pages/RegisterProduct";
import { Dashboard } from "./pages/Dashboard";
import { DashboardProducts } from "./pages/DashboardProducts";
import { Menu } from "./components/Menu";
import { EditProduct } from "./components/EditProduct";

function AppContent() {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return null;

  return (
    <>
      {user && <Menu />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* PROTECTED */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard-products"
          element={
            <ProtectedRoute>
              <DashboardProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/register-product"
          element={
            <ProtectedRoute>
              <RegisterProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />

        {/* NOT FOUND */}
        <Route path="*" element={<Navigate to="/" />} />
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
