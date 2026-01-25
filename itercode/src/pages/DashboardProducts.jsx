import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import "../styles/dashboard.css";

function DashboardProducts() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/api/dashboard/stats/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        setStats(res.data);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <p>Cargando dashboard...</p>;

  return (
    <div className="dashboard-grid">
      <div className="dashboard-card">
        <h3>📦 Productos</h3>
        <p>{stats.total_products}</p>
      </div>

      <div className="dashboard-card">
        <h3>💰 Total Vendido</h3>
        <p>${stats.total_sold.toLocaleString()}</p>
      </div>

      <div className="dashboard-card">
        <h3>⏳ En Preparación</h3>
        <p>{stats.preparing_orders}</p>
      </div>
    </div>
  );
}

export { DashboardProducts };
