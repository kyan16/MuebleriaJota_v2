import React from 'react';
import { formatoPrecio } from '../utils/format';

function ProductCard({ producto, onSelect, onAddToCart }) {
  if (!producto) return null;

  const { id, nombre, precio, categoria, imagen } = producto;
  const imageSrc = imagen.startsWith('/') ? imagen : `/${imagen}`;

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(producto);
    }
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  return (
    <article className="product-card">
      <div
        className="product-card-link"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCardClick();
          }
        }}
        aria-label={`Ver detalle de ${nombre}`}
      >
        <div className="product-image">
          <img src={imageSrc} alt={nombre} />
        </div>
        <div className="product-info">
          <p className="category">{categoria}</p>
          <h3>{nombre}</h3>
          <p className="price">{formatoPrecio(precio)}</p>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-small"
        data-id={id}
        onClick={handleAddClick}
      >
        AÑADIR
      </button>
    </article>
  );
}

export default ProductCard;
