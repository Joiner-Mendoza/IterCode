import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./styles/register.css";
import Swal from "sweetalert2";

function RegisterPage() {
  const navigate = useNavigate(); //Hook para navegar

  // estados para los campos del formulario
  const [nameLastName, setNameLastName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [password, setPassword] = useState("");
  // manejo de errores de los camopos
  const [fieldErrors, setFieldErrors] = useState({});

  // Funcion para registrar un nuevo usuario
  const sendRegister = async (e) => {
    e.preventDefault(); 
    setFieldErrors({}); // Limpia errores 
  const errors = {};
      if (!nameLastName) errors.nameLastName = 'El Campo no puede estar vacio';
      if (!lastName) errors.lastName = 'El Campo no puede estar vacio';
      if (!username) errors.username = 'El Campo no puede estar vacio';
      if (!email) errors.email = 'El Campo no puede estar vacio';
      if (!cellphone) errors.cellphone = 'El Campo no puede estar vacio';
      if (!password) errors.password = 'El Campo no puede estar vacio';
      
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
    //payload ppara el request
    const payload = {
      username,
      email,
      password,
      nameLastName: `${nameLastName} ${lastName}`,
      cellphone,
    };

    console.log(" Enviando datos:", payload);

    try {
      // endpoint 
      const response = await axios.post("http://127.0.0.1:8000/api/register/", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Respuesta:", response.data);
        Swal.fire({
        title: "Usuario registrado correctamente",
        text: "Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      navigate("/login");
    } catch (error) {
      console.error(" Error al registrar:", error.response ? error.response.data : error.message);
      
      if (error.response && error.response.data) {
        //  errores del backen
        setFieldErrors(error.response.data);
      } else {
        alert("No se pudo registrar el usuario. Revisa la consola para más detalles.");
      }
    }
  };

  return (
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
              <span className="error-message">{fieldErrors.nameLastName}</span>
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
              <span className="error-message">{fieldErrors.username}</span>
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

          <div className="form-group">
            <label htmlFor="celphone">Número telefónico</label>
            <input
              type="text"
              id="celphone"
              value={cellphone}
              onChange={(e) => setCellphone(e.target.value)}
            />
            {fieldErrors.cellphone && (
              <span className="error-message">{fieldErrors.cellphone}</span>
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
              <span className="error-message">{fieldErrors.password}</span>
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
  );
}

export { RegisterPage };
