  import React from 'react';
  import '../assets/styles/modalcart.css';
  import { useState } from 'react';
  import ModalOrderConfirmed from './ModalOrderConfirmed';
  // Componente del carrito de pedidos  
  function ModalCart({ orders, onUpdateQuantity }) {
    const [modalShow, setModalShow] = useState(false);
    const handleConfirmClick = () =>{ 
      setModalShow(true)
    }
    const handleCloseModal  = () => {
      setModalShow(false);
    }
    // Calcula el total en dinero
    const getTotal = () => {
      return orders.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    // Calcula el número total de ítems en el car rito
    const getTotalItems = () => {
      return orders.reduce((total, item) => total + item.quantity, 0);
    };

    // Si no hay productos en el carrito, no mostrar nada
    if (!orders || orders.length === 0) {
      return null; // No renderiza nada
    }

    // Si hay productos, muestra el carrito
    return (
      <div className="cart-container">
        <h3 className="cart-title">Your Cart ({getTotalItems()})</h3>

        {/* Lista de productos agregados */}
        {orders.map((item, index) => (
          <div key={index} className="cart-item">
            <div className="item-info">
              <span className="item-qty">{item.quantity}x</span>
              <span className="item-name">{item.name}</span>
            </div>
            <div className="item-price">
              <span>${(item.price * item.quantity).toFixed(2)}</span>
              {/* Botón para eliminar */}
              <button className="remove-btn" onClick={() => onUpdateQuantity(index, 0)}>×</button>
            </div>
          </div>
        ))}

        <div className="cart-total">
          <span>Order Total</span>
          <span>${getTotal()}</span>
        </div>

        <div className="carbon-note">
          <span role="img" aria-label="tree">🌱</span> This is a carbon-neutral delivery
        </div>

        <button className="confirm-btn" onClick={handleConfirmClick}>Confirm Order</button>
          {modalShow && <ModalOrderConfirmed orders={orders} total={getTotal()} onClose={handleCloseModal}/>}
      </div>
      
    );
  }

  export default ModalCart;
