import React, { useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import '../App.css';
import '../styles/login.css';
import { useNavigate } from "react-router";
import { Link } from "react-router-dom"; 
import axios from "axios"; 
import Swal from "sweetalert2";


function LoginPage() {
  const navigate = useNavigate();
  // const API_URL = import.meta.env.VITE_API_URL; // para desarrollo
  const API = import.meta.env.VITE_API_URL; // para producción
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const { user } = React.useContext(AuthContext)
  // Redirigir al dashboard si el usuario ya está autenticado
   useEffect(() => {
        if (user) navigate("/dashboard");
    }, [user]);

  // End Point para buscar al usuario en la base d edatos
  const handleSubmit = async () => {
    // e.preventDefault();
    
    const errors = {};
    if (!userName) errors.userName = 'El nombre de usuario es incorrecto';
    if (!password) errors.password = 'La Contraseña es incorrecta';
 
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    console.log("  sesión:", { userName, password });

    try {
      const response = await axios.post(`${API}/api/login/`, {
        username: userName,
        password: password,
      });
      
      console.log("Respuesta:", response);
      Swal.fire({
        title: "Login exitoso",
        text: "Iniciando secion",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      // token de usuario
      if (response.data.token) {
        console.log("Token de usuaio:", response.data.token);
        localStorage.setItem("token", response.data.token);//lo guardamos en localstorage

      }
      navigate('/dashboard');

    } catch (error) {
      Swal.fire({
        title:'Fallo al iniciar sesión',
        text:'El Nombre de Usuario o la contrasena son incorrectos',
        icon:'error',
        confirmButtonText:'OK',
      })

      console.error("Error al iniciar sesion:", error);
    }
  };

  return (
    <>
    {!user && (
      <div id="Container-login-form">
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Nombre de Usuario:</label>
            <input
              type="text"
              value={userName}
              placeholder="Ingrese su nombre de usuario"
              onChange={(e) => setUserName(e.target.value)}
            />
            {fieldErrors.userName && (<p className="error-message">{fieldErrors.userName}</p>)}
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
            />
            {fieldErrors.password && (<p className="error-message">{fieldErrors.password}</p>)}
          </div>

          <button type="submit" className="login-button">
            Ingresar
          </button>

          <p className="register-link">
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </form>
      </div>
    </div>
    )}
    </>
  );
}

export { LoginPage };
