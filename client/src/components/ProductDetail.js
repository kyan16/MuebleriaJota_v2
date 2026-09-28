import React, { useState } from 'react';
import { formatoPrecio } from '../utils/format';

function ProductDetail({ producto, onAddToCart, onBack }) {
  const [mensaje, setMensaje] = useState('');

  if (!producto) {
    return (
      <div className="product-detail-container">
        <h1>Producto no encontrado</h1>
        {onBack && (
          <button type="button" className="text-link" onClick={onBack}>
            Volver al catálogo →
          </button>
        )}
      </div>
    );
  }

  const { nombre, precio, categoria, imagen, descripcion, especificaciones } = producto;
  const imageSrc = imagen.startsWith('/') ? imagen : `/${imagen}`;

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(producto.id);
    }
    setMensaje('Producto añadido al carrito.');
  };

  return (
    <div className="product-detail-container">
      <section id="product-detail" className="product-detail">
        <div className="detail-image">
          <img src={imageSrc} alt={nombre} />
        </div>
        <div className="detail-content">
          <p className="eyebrow">{categoria}</p>
          <h1>{nombre}</h1>
          <p className="detail-price">{formatoPrecio(precio)}</p>
          <p className="detail-description">{descripcion}</p>

          {especificaciones && especificaciones.length > 0 && (
            <dl className="specs-table">
              {especificaciones.map((spec) => (
                <div key={spec.label} className="specs-row">
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="detail-actions">
            <button
              id="add-detail"
              type="button"
              className="btn"
              onClick={handleAdd}
            >
              AÑADIR AL CARRITO
            </button>
            {onBack && (
              <button
                type="button"
                className="text-link btn-back"
                onClick={onBack}
              >
                Volver al catálogo →
              </button>
            )}
          </div>

          {mensaje && (
            <p id="detail-message" className="form-message" aria-live="polite">
              {mensaje}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
