import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { normalizarTexto } from '../utils/format';

function ProductList({
  productos = [],
  onSelectProduct,
  onAddToCart,
  mostrarBuscador = true,
  cargando = false,
  error = null,
  onReintentar
}) {
  const [busqueda, setBusqueda] = useState('');

  // Filtrado en vivo según nombre, categoría y descripción (normalizado sin tildes)
  const productosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return productos;
    const termino = normalizarTexto(busqueda);
    return productos.filter((producto) => {
      const textoCompleto = normalizarTexto(
        `${producto.nombre} ${producto.categoria} ${producto.descripcion || ''}`
      );
      return textoCompleto.includes(termino);
    });
  }, [productos, busqueda]);

  // Contenido de la grilla según el ciclo de la petición: cargando, error o éxito
  let contenido;
  if (cargando) {
    contenido = (
      <p className="grid-status" role="status">
        Cargando catálogo...
      </p>
    );
  } else if (error) {
    contenido = (
      <div className="grid-status" role="alert">
        <p>{error}</p>
        {onReintentar && (
          <button type="button" className="btn" onClick={onReintentar}>
            REINTENTAR
          </button>
        )}
      </div>
    );
  } else if (productosFiltrados.length === 0) {
    contenido = <p className="grid-status">No encontramos productos.</p>;
  } else {
    contenido = productosFiltrados.map((producto) => (
      <ProductCard
        key={producto.id}
        producto={producto}
        onSelect={onSelectProduct}
        onAddToCart={onAddToCart}
      />
    ));
  }

  const grilla = (
    <div id={mostrarBuscador ? 'product-grid' : 'featured-products'} className="product-grid">
      {contenido}
    </div>
  );

  // En la portada solo se muestra la grilla; en el catálogo, buscador + grilla
  if (!mostrarBuscador) return grilla;

  return (
    <section className="section catalog-section">
      <label className="search-label" htmlFor="search">
        Buscar producto
      </label>
      <input
        id="search"
        className="search-input"
        type="search"
        placeholder="Ej: sillón, mesa, silla..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      {grilla}
    </section>
  );
}

export default ProductList;
