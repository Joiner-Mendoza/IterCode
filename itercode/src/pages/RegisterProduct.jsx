import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import  "../styles/registerproduct.css"


function RegisterProduct() {
  const navigate = useNavigate()
  const [form, setForm] = React.useState({
    name: "",
    image: null,
    description: "",
    price: "",
    stock: "",
    date_in: "",
  });

  const [date,setDate] = useState(''); //Fecha por defecto para el input
  useEffect(()=> {
    const today = new Date();
    const formatted = today.toISOString().split('T')[0];
    setDate(formatted)
  },[])

  const [fieldErrors, setFieldErrors] = React.useState({});
  const [error, setError] = React.useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const errors = {};
    if (!form.name) errors.name = "Nombre requerido";
    if (!form.price) errors.price = "Precio requerido";
    if (!form.description) errors.description = "Descripción requerida";
    if (!form.image) errors.image = "Imagen requerida";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Preparar archivo para Django
    let data = new FormData();
    data.append("name", form.name);
    data.append("image", form.image);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("stock", form.stock);
    data.append("date_in", form.date_in);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post("http://127.0.0.1:8000/api/products/",data,{
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log('datos',response)
      Swal.fire({
        title:'Producto agregado',
        text:'El Producto ha sido agregadoo correctamente',
        icon:'success',
        confirmButtonText:'OK'
      }).then((result)=> {
        if(result.isConfirmed){
          navigate('/dashboard')
        }else{
          return
        }
      })
      

    } catch (err) {
      console.error("Error al enviar:", err);
      setError("Error al registrar el producto.");
    }
  };


  return (
    <div className="container mt-4">
      <h2>Nuevo Producto</h2>

      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        
        {/* NOMBRE */}
        <div className="mb-3">
          <label>Nombre</label>
          <input
            name="name"
            className={`form-control ${fieldErrors.name ? "is-invalid" : ""}`}
            value={form.name}
            onChange={handleChange}
          />
          {fieldErrors.name && <small className="text-danger">{fieldErrors.name}</small>}
        </div>

        {/* IMAGEN */}
        <div className="mb-3">
          <label>Imagen</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            className={`form-control ${fieldErrors.image ? "is-invalid" : ""}`}
            onChange={handleChange}
          />
          {fieldErrors.image && <small className="text-danger">{fieldErrors.image}</small>}
        </div>

        {/* DESCRIPCIÓN */}
        <div className="mb-3">
          <label>Descripción</label>
          <textarea
          style={{resize:'none'}}
            name="description"
            className="form-control"
            value={form.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* PRECIO */}
        <div className="mb-3">
          <label>Precio</label>
          <input
            name="price"
            type="number"
            step="0.01"
            className={`form-control ${fieldErrors.price ? "is-invalid" : ""}`}
            value={form.price}
            onChange={handleChange}
          />
          {fieldErrors.price && <small className="text-danger">{fieldErrors.price}</small>}
        </div>

        {/* STOCK */}
        <div className="mb-3">
          <label>Stock</label>
          <input
            name="stock"
            type="number"
            className="form-control"
            value={form.stock}
            onChange={handleChange}
          />
        </div>

        {/* FECHA */}
        <div className="mb-3">
          <label>Fecha de entrada</label>
          <input 
              type="date" 
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
          />

        </div>

        <button className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
}

export { RegisterProduct };
