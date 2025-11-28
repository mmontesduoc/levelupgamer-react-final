import React, { useEffect, useState } from 'react';
import { getItems, addItem, removeItem, updateQty, clearCart } from '../services/cartService';
import '../styles/Cart.css';
import { Link } from 'react-router-dom';

const CarroCompras = () => {
  const [items, setItems] = useState(getItems());

  useEffect(() => {
    const onCartChange = () => setItems(getItems());
    window.addEventListener('cartChanged', onCartChange);
    return () => window.removeEventListener('cartChanged', onCartChange);
  }, []);

  const handleInc = (id) => {
    const it = items.find(i => String(i.id) === String(id));
    if (it) updateQty(id, (it.qty || 0) + 1);
  };

  const handleDec = (id, qty) => {
    const next = (qty || 1) - 1;
    updateQty(id, next);
  };

  const handleRemove = (id) => {
    removeItem(id);
  };

  const handleClear = () => {
    if (window.confirm('¿Borrar todos los productos del carrito?')) {
      clearCart();
    }
  };

  const total = items.reduce((s, it) => s + (it.price || 0) * (it.qty || 0), 0);

  return (
    <div className="container mt-4 cart-page">
      <h2 className="cart-title">Carrito de Compras</h2>

      {items.length === 0 ? (
        <div className="empty-cart">
          <p>Tu carrito está vacío.</p>
          <Link to="/" className="btn btn-primary">Seguir comprando</Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items">
            {items.map(item => (
              <div className="cart-row" key={item.id}>
                <div className="cart-img">
                  {(() => {
                    const src = item.img || `/images/${item.id}.jpg`;
                    return (
                      <img
                        src={src}
                        alt={item.name}
                        onLoad={(e) => { e.currentTarget.classList.add('loaded'); }}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/150'; }}
                      />
                    );
                  })()}
                </div>
                <div className="cart-info">
                  <h5>{item.name}</h5>
                  <div className="cart-controls">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDec(item.id, item.qty)}>-</button>
                    <span className="qty">{item.qty}</span>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => handleInc(item.id)}>+</button>
                    <button className="btn btn-sm btn-link text-danger ms-3" onClick={() => handleRemove(item.id)}>Eliminar</button>
                  </div>
                </div>
                <div className="cart-price">
                  <strong>${(item.price || 0).toLocaleString('es-CL')}</strong>
                </div>
              </div>
            ))}

            <div className="cart-actions">
              <button className="btn btn-danger" onClick={handleClear}>Vaciar carrito</button>
            </div>
          </div>

          <aside className="cart-summary">
            <h4>Resumen</h4>
            <p>Total items: {items.reduce((s, it) => s + (it.qty || 0), 0)}</p>
            <p>Subtotal: <strong>${total.toLocaleString('es-CL')}</strong></p>
            <button className="btn btn-primary w-100">Proceder al Pago</button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CarroCompras;
