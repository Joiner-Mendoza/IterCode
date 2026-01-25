import axios from "axios";
import { useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  // Cargar usuario si hay token (al recargar)
  const loadUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API}/api/users/me/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      setUser(res.data);
    } catch (error) {
      console.error("Error cargando usuario:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
     }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // LOGIN SIN RECARGAR
  const loginUser = async (credentials) => {
    const res = await axios.post(`${API}/api/login/`, credentials);
    localStorage.setItem("token", res.data.token);
    // Cargar usuario inmediatamente
    await loadUser();
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
