import axios from "axios";
import { useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // const API_URL = import.meta.env.VITE_API_URL; // para desarrollo
    const API = import.meta.env.VITE_API_URL; // para producción
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;                   
        }

        axios.get(`${API}/api/users/me/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`,
            }
        })
        .then((res) => {
            console.log("Usuario cargado en proviide:", res.data);
            console.log("API URL:", API);
            setUser(res.data);
        })
        .catch((err) => {
            console.error("Error al obtener usuario:", err);
            localStorage.removeItem("token");
            setUser(null);
        })
        .finally(() => {
            setLoading(false);
        });

    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider };
