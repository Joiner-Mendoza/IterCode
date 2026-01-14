import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";
import Swal from "sweetalert2";

import AuthContext from "../context/AuthContext";

function RegisterPage() {
  // const API_URL = import.meta.env.VITE_API_URL; // para desarrollo
  const API = import.meta.env.VITE_API_URL; // para producción
  const navigate = useNavigate();

  // Estados del formulario
  const [nameLastName, setNameLastName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [password, setPassword] = useState("");

  // Estado para los grupos disponibles (roles)
  const [groups, setGroups] = useState([]);

  // Estado para el grupo seleccionado del usuario nuevo
  const [userGroup, setUserGroup] = useState("");

  // Errores del backend
  const [fieldErrors, setFieldErrors] = useState({});

  // Usuario actual desde el AuthProvider
  const { user } = React.useContext(AuthContext);

  /**
   * useEffect encargado de evitar que un usuario logueado que no sea Administrador o Supervisor
   * acceda al registro y redirigirlo al dashboard
   */
  useEffect(() => {
    if (!user) return; // Si no está logueado, permitir usar la página normal

    // Si el usuario NO es admin ni supervisor → redirigir
    if (
      !user.profile?.groups?.includes("Administrador") &&
      !user.profile?.groups?.includes("Supervisor")
    ) {
      navigate("/dashboard");
    }

  }, [user]);


  /**
   * useEffect que obtiene todos los roles desde el backend,
   * pero SOLO si el usuario logueado pertenece al grupo
   * Administrador o Supervisor.
   */
  useEffect(() => {
    if (user?.profile?.groups?.includes("Administrador") ||
        user?.profile?.groups?.includes("Supervisor")) 
    {
      axios 
        .get(`${API}/api/groups/`)
        .then((res) => {                         
          console.log("Grupos cargados:", res.data);
          setGroups(res.data);
        })
        .catch((err) => console.error("Error al traer grupos:", err));
    }
  }, [user]);

  /**
   * Función principal para registrar un nuevo usuario
   * Recoge el formulario, valida campos y envía al backend
   */
  const sendRegister = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    // Validación manual básica
    const errors = {};
    if (!nameLastName) errors.nameLastName = "El Campo no puede estar vacío";
    if (!lastName) errors.lastName = "El Campo no puede estar vacío";
    if (!username) errors.username = "El Campo no puede estar vacío";
    if (!email) errors.email = "El Campo no puede estar vacío";
    if (!cellphone) errors.cellphone = "El Campo no puede estar vacío";
    if (!password) errors.password = "El Campo no puede estar vacío";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Payload para enviar al backend
    const payload = {
      username,
      email,
      password,
      nameLastName: `${nameLastName} ${lastName}`,
      cellphone,
    };

    // Si el usuario logueado es Admin o Supervisor, puede asignar grupo
    if (
      user?.profile?.groups?.includes("Administrador") ||
      user?.profile?.groups?.includes("Supervisor")
    ) {
      payload.group = userGroup;
    }

    console.log("Enviando datos:", payload);

    try {
      const response = await axios.post(
        `${API}/api/register/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Respuesta del registro:", response.data);

      Swal.fire({
        title: "Usuario registrado correctamente",
        text: "Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:",error.response ? error.response.data : error.message);

      if (error.response && error.response.data) {
        // Errores provenientes del backend
        setFieldErrors(error.response.data);
      } 
    }
  };

  return (
    <>
        <div id="Container-register-form">
          <div className="register-container">
            <h2>Registro de usuario</h2>

            <form onSubmit={sendRegister}>
              <div className="form-group">
                <label htmlFor="name">Nombres</label>
                <input
                  type="text"
                  id="name"
                  value={nameLastName}
                  onChange={(e) => setNameLastName(e.target.value)}
                />
                {fieldErrors.nameLastName && (
                  <span className="error-message">
                    {fieldErrors.nameLastName}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastname">Apellidos</label>
                <input
                  type="text"
                  id="lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Nombre Usuario</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
                {fieldErrors.username && (
                  <span className="error-message">
                    {fieldErrors.username}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {fieldErrors.email && (
                  <span className="error-message">{fieldErrors.email}</span>
                )}
              </div>

              {/* SELECT DE ROLES SOLO PARA ADMIN Y SUPERVISOR */}
              {(user?.profile?.groups?.includes("Administrador") ||
                user?.profile?.groups?.includes("Supervisor")) && (
                <div className="form-group">
                  <label htmlFor="usergroup">Grupo del Usuario</label>

                  <select
                    className="form-select"
                    id="usergroup"
                    value={userGroup}
                    onChange={(e) => setUserGroup(e.target.value)}
                  >
                    <option value="">
                      Selecciona un grupo para el Usuario
                    </option>

                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="celphone">Número telefónico</label>
                <input
                  type="text"
                  id="celphone"
                  value={cellphone}
                  onChange={(e) => setCellphone(e.target.value)}
                />
                {fieldErrors.cellphone && (
                  <span className="error-message">
                    {fieldErrors.cellphone}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {fieldErrors.password && (
                  <span className="error-message">
                    {fieldErrors.password}
                  </span>
                )}
              </div>

              <button type="submit" className="btn-primary">
                Registrar
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/login")}
              >
                Cancelar
              </button>

              <Link to="/login" className="link-login">
                ¿Ya tienes cuenta? Inicia sesión
              </Link>
            </form>
          </div>
        </div>
    </>
  );
}

export { RegisterPage };
