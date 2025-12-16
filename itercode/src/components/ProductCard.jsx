import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import "../styles/productcard.css";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router";

function ProductCard({
  id,
  name,
  image_url,
  price,
  description,
  quantity,
  onAddToCart,
  onIncrement,
  onDecrement,
}) {
  const navigate = useNavigate("");
  const { user } = React.useContext(AuthContext);
  const userGroups = user?.profile.groups || [];

  const goToEdit = () => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="card h-100 shadow-sm">

      {(userGroups.includes("Administrador") ||
        userGroups.includes("Supervisor")) && (
        <FontAwesomeIcon
          icon={faPenToSquare}
          className="icon-edit-product"
          onClick={goToEdit}
        />
      )}

      <img
        src={image_url}
        className="card-img-top img-fluid"
        alt={name}
        style={{ height: "300px", objectFit: "cover" }}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>

        <h6 className="mt-auto text-success">${price}</h6>
        {/* ----------------------------- */}
        {/*  SISTEMA DEL CARRITO          */}
        {/* ----------------------------- */}
        {quantity === 0 ? (
          <button className="btn btn-primary mt-2" onClick={onAddToCart}>
            Añadir al carrito
          </button>
        ) : (
          <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
            <button className="btn btn-danger" onClick={onDecrement}>
              −
            </button>

            <span>{quantity}</span>

            <button className="btn btn-success" onClick={onIncrement}>
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { ProductCard };
