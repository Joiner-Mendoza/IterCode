import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import '../styles/editproduct.css'

function EditProduct() {
    const navigate = useNavigate();
    const { id } = useParams();
    const API_URL = import.meta.env.VITE_API_URL;

    const [newImage, setNewImage] = useState(null);          // archivo nuevo
    const [currentImage, setCurrentImage] = useState("");    //
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newStock, setNewStock] = useState("");

    useEffect(() => {
        axios.get(`${API_URL}/api/products/${id}/`)
        .then(res => {
            setNewName(res.data.name);
            setNewDescription(res.data.description);
            setNewPrice(res.data.price);
            setNewStock(res.data.stock);
            setCurrentImage(res.data.image);  // la imagen actual del backend
        });
    }, [id]);

   const EditConfirm = async () => {
            try {
                const formData = new FormData();
                formData.append("name", newName);
                formData.append("description", newDescription);
                formData.append("price", Number(newPrice).toFixed(2));
                formData.append("stock", newStock);

                if (newImage) {
                    // SOLO si el usuario subió una nueva imagen
                    formData.append("image", newImage);
                }

                const response = await axios.put(
                    `${API_URL}/api/products/${id}/`,
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" }
                    }
                );  
                Swal.fire({
                    title:'Producto actualizado',
                    icon:'success',
                    text:`El producto ha sido actualizado exitosamente `,
                    confirmButtonText:'Ok'
                })
                console.log("Respuesta:", response);

                navigate("/");
            } catch (err) {
                Swal.fire({
                    title:'Error inesperado',
                    icon:'error',
                    text:'Ha ocurrido un error al cambiar los datos del producto'
                })
                console.error("error al cargar los datos", err);
            }
        };

    const cancel = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    return (
        <div className="card shadow-lg p-4 rounded-4">

            <h4 className="text-center mb-4">Editar Producto</h4>

            <div className="mb-3">
                <label className="form-label fw-semibold">Nombre del producto</label>
                <input
                    type="text"
                    className="form-control"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
            </div>

            <div className="mb-3 text-center">
                <label className="form-label fw-semibold d-block">Imagen Actual</label>
                <img
                    src={currentImage}
                    alt="Producto"
                    className="img-thumbnail mb-2"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />

                <input
                    type="file"
                    className="form-control mt-2"
                    onChange={(e) => setNewImage(e.target.files[0])}
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Descripción</label>
                <textarea
                    className="form-control txt"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows="3"
                ></textarea>
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Precio</label>
                    <input
                        type="number"
                        className="form-control"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Stock</label>
                    <input
                        type="number"
                        className="form-control"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                    />
                </div>
            </div>

            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-primary px-4" onClick={EditConfirm}>
                    Guardar Cambios
                </button>

                <button className="btn btn-outline-secondary px-4" onClick={cancel}>
                    Cancelar
                </button>
            </div>

        </div>

    );
}

export { EditProduct };
