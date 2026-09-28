import React from 'react';
import { formatoPrecio } from '../utils/format';

function Cart({
  items = [],
  totalUnidades = 0,
  total = 0,
  onNavigate,
  onAgregar,
  onQuitarUnidad,
  onEliminar,
  onVaciar
}) {
  return (
    <section className="cart-section">
      <div id="cart-items" className="cart-list">
        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Tu carrito está vacío.</p>
            <button type="button" className="text-link" onClick={() => onNavigate('catalogo')}>
              Ver catálogo →
            </button>
          </div>
        ) : (
          items.map(({ producto, cantidad }) => {
            const imageSrc = producto.imagen.startsWith('/')
              ? producto.imagen
              : `/${producto.imagen}`;
            return (
              <article key={producto.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={imageSrc} alt={producto.nombre} />
                </div>
                <div className="cart-item-info">
                  <p className="category">{producto.categoria}</p>
                  <h3>{producto.nombre}</h3>
                  <p className="price">{formatoPrecio(producto.precio)}</p>
                </div>
                <div className="cart-item-qty">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => onQuitarUnidad(producto.id)}
                    aria-label={`Quitar una unidad de ${producto.nombre}`}
                  >
                    −
                  </button>
                  <span>{cantidad}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => onAgregar(producto.id)}
                    aria-label={`Agregar una unidad de ${producto.nombre}`}
                  >
                    +
                  </button>
                </div>
                <p className="cart-item-subtotal">{formatoPrecio(producto.precio * cantidad)}</p>
                <button
                  type="button"
                  className="cart-item-remove"
                  onClick={() => onEliminar(producto.id)}
                  aria-label={`Eliminar ${producto.nombre} del carrito`}
                >
                  Eliminar
                </button>
              </article>
            );
          })
        )}
      </div>

      <aside className="cart-summary">
        <h2>Resumen</h2>
        <p className="cart-summary-row">
          <span>Unidades</span>
          <span id="cart-summary-count">{totalUnidades}</span>
        </p>
        <p className="cart-summary-total">
          <span>Total</span>
          <span id="cart-total">{formatoPrecio(total)}</span>
        </p>
        <button
          id="cart-clear"
          type="button"
          className="btn-outline"
          disabled={totalUnidades === 0}
          onClick={onVaciar}
        >
          VACIAR CARRITO
        </button>
      </aside>
    </section>
  );
}

export default Cart;
