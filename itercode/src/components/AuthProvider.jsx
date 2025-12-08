import axios from "axios";
import { useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        axios.get("http://127.0.0.1:8000/api/users/me/", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`,
            }
        })
        .then((res) => {
            console.log("Usuario cargado en proviide:", res.data);
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
