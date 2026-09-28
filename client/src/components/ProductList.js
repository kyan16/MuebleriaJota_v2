import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { normalizarTexto } from '../utils/format';

function ProductList({
  productos = [],
  onSelectProduct,
  onAddToCart,
  mostrarBuscador = true
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

  return (
    <section className="section catalog-section">
      {mostrarBuscador && (
        <>
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
        </>
      )}

      <div id="product-grid" className="product-grid">
        {productosFiltrados.length === 0 ? (
          <p>No encontramos productos.</p>
        ) : (
          productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onSelect={onSelectProduct}
              onAddToCart={onAddToCart}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ProductList;
