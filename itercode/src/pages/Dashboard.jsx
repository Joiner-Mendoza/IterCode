import React, { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import axios from "axios";
import "../styles/cartproduct.css";
import Swal from "sweetalert2";

function Dashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  // Productos traídos del backend
  const [products, setProducts] = useState([]);

  // Carrito de compras
  const [cart, setCart] = useState(() => {
    // Recuperamos el carrito guardado en localStorage
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Mostrar / ocultar carrito
  const [isActive, setIsActive] = useState(false);


    //  CARGAR PRODUCTOS
  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/`);
      setProducts(response.data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    }
  };

  /* =========================
     GUARDAR CARRITO EN LOCALSTORAGE
     (se ejecuta cada vez que cambia el carrito)
  ========================= */

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* =========================
     FUNCIONES DEL CARRITO
  ========================= */

  //Añadir producto al carrito
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      // Si el producto ya existe, aumentamos cantidad
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Si no existe, lo agregamos
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Incrementar cantidad
  const increment = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  //  Disminuir cantidad
  const decrement = (productId) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        // Si la cantidad llega a 0, se elimina del carrito
        .filter((item) => item.quantity > 0)
    );
  };

  /* =========================
     TOTAL DEL CARRITO
  ========================= */

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* =========================
     FINALIZAR PEDIDO
  ========================= */
  const finishOrder = async () => {
  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  const orderData = {
    total: total,
    items: cart.map(item => ({
      product: item.id,
      quantity: item.quantity,
      price: item.price
    }))
  };

  try {
    await axios.post(`${API_URL}/api/orders/`,orderData);
    Swal.fire({
      title:'Pedido realizado ',
      text:'El pedido ha sido realizado exiosamente',
      icon:'success'
    })
    setCart([]);
    localStorage.removeItem("cart");
    setIsActive(false);

  } catch (error) {
    console.error("Error al crear la orden", error);
        Swal.fire({
      title:'Pedido rechazado ',
      text:'El pedido ha sido rechazado',
      icon:'error'
    })
  }
};


  /* =========================
     MOSTRAR / OCULTAR CARRITO
  ========================= */

  const handleShow = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="container mt-4 text-center">

      {/* BOTÓN FLOTANTE DEL CARRITO */}
      <button className="btn btn-warning cart-toggle" onClick={handleShow}>
        🛒 {cart.length}
      </button>

      {/* LISTADO DE PRODUCTOS */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {products.map((product) => {
          const cartItem = cart.find((c) => c.id === product.id);

          return (
            <div className="col" key={product.id}>
              <ProductCard
                {...product}
                price={parseFloat(product.price).toFixed(2)}
                quantity={cartItem?.quantity || 0}
                onAddToCart={() => handleAddToCart(product)}
                onIncrement={() => increment(product.id)}
                onDecrement={() => decrement(product.id)}
              />
            </div>
          );
        })}
      </div>

      {/* PANEL DEL CARRITO */}
      <div className={`cart-product ${isActive ? "active" : ""}`}>
        <h1 className="close-cart" onClick={handleShow}>X</h1>
        <h3>Tu carrito</h3>

        {cart.length === 0 ? (
          <p>Agregar productos al carrito</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between mb-2 border-bottom pb-1"
              >
                <span>{item.name} x {item.quantity}</span>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))}

            {/* TOTAL */}
            <hr />
            <h5>Total: ${total.toFixed(2)}</h5>

            {/* FINALIZAR PEDIDO */}
            <button className="btn btn-success w-100 mt-2" onClick={finishOrder}>
              Finalizar pedido
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export { Dashboard };
