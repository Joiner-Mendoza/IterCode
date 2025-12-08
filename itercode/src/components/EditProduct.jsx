import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";

function EditProduct() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [newImage, setNewImage] = useState(null);          // archivo nuevo
    const [currentImage, setCurrentImage] = useState("");    //
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newStock, setNewStock] = useState("");

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/products/${id}/`)
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
                    `http://127.0.0.1:8000/api/products/${id}/`,
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
        <div className="card-body d-flex flex-column">

            <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
            />

            <img src={currentImage} alt="Producto" width="100" />

            <input
                type="file"
                onChange={(e) => setNewImage(e.target.files[0])}
            />

            <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
            />

            <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
            />

            <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
            />

            <button className="btn btn-primary mt-2" onClick={EditConfirm}>
                Confirmar Cambios
            </button>

            <button className="btn btn-secondary mt-2" onClick={cancel}>
                Cancelar
            </button>
        </div>
    );
}

export { EditProduct };
