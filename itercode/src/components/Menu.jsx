import React from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Menu() {
    const { user, loading } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const userGroup = user?.profile.groups || [];
    
    const newUser = (e)=> {
        e.preventDefault()
         navigate('/RegisterPage')
    }
    const logout = (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Cerrando sesión',
            text: '¿Deseas cerrar sesión?',
            icon: "question",
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                navigate('/login');
                window.location.reload();
            }
        });
    };

    if (loading) return <p>Cargando...</p>;

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">

                <Link className="navbar-brand" to="/dashboard">
                    Iter/Code
                </Link>
                
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarText"
                    aria-controls="navbarText" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">
                                Marketing
                            </Link>
                        </li>
                    </ul>

                    {(userGroup.includes("Administrador") || userGroup.includes('Supervisor')) && (
                        <Link to="/RegisterProduct" className="btn btn-light me-2">
                            Añadir producto
                        </Link>
                    )}

                    <span className="span mx-3">
                        <p className="m-0">{user?.username}</p>
                    </span>

                    <Link onClick={logout} className="btn btn-outline-warning">
                        Cerrar
                    </Link>
                    
                    {(userGroup.includes('Administrador') || userGroup.includes('Supervisor')) && (
                    <button onClick={newUser} className="btn btn-outline-warning">
                        Crear nuevo usuario
                    </button>
                    )}

                </div>

            </div>
        </nav>
    );
}

export { Menu };
