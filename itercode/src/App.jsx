import React from "react";
import { HashRouter, Routes, Route } from 'react-router-dom'
import AuthContext from "./context/AuthContext";

import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from "./components/AuthProvider";

import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { Home } from './pages/Home'
import { RegisterProduct } from './pages/RegisterProduct'
import { Dashboard } from './pages/Dashboard'
import { Menu } from './components/Menu'
import { EditProduct } from "./components/EditProduct";
function AppContent() {
  const {  loading } = React.useContext(AuthContext);

  if (loading) return null;

  return (
    <>
      {/* Solo se muestra si hay usuario */}
      {/* {user && <Menu />} */}
      <Menu/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/RegisterPage' element={<RegisterPage />} />
        <Route path='/RegisterProduct' element={<RegisterProduct />} />
        <Route path="/edit/:id" element={<EditProduct />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<p>Not Found</p>} />
      </Routes>
    </>
  )
}
// ############################################################
function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  )
}

export default App;
