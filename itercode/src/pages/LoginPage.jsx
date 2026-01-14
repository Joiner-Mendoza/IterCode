import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../App.css";
import "../styles/login.css";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function LoginPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const { user, loginUser } = useContext(AuthContext);

  // Si ya está logueado → dashboard
  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!userName) errors.userName = "El nombre de usuario es incorrecto";
    if (!password) errors.password = "La contraseña es incorrecta";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await loginUser({
        username: userName,
        password: password,
      });

      Swal.fire({
        title: "Login exitoso",
        text: "Iniciando sesión",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        title: "Fallo al iniciar sesión",
        text: "El usuario o la contraseña son incorrectos",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      {!user && (
        <div id="Container-login-form">
          <div className="login-container">
            <h2>Iniciar Sesión</h2>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>Nombre de Usuario:</label>
                <input
                  type="text"
                  value={userName}
                  placeholder="Ingrese su nombre de usuario"
                  onChange={(e) => setUserName(e.target.value)}
                />
                {fieldErrors.userName && (
                  <p className="error-message">{fieldErrors.userName}</p>
                )}
              </div>

              <div className="form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                />
                {fieldErrors.password && (
                  <p className="error-message">{fieldErrors.password}</p>
                )}
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
