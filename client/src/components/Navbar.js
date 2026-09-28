import React from 'react';

function Navbar({ cantidadCarrito = 0, seccionActiva = 'catalogo', onNavigate }) {
  const handleClick = (e, seccion) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(seccion);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <a
          className="logo"
          href="#inicio"
          onClick={(e) => handleClick(e, 'inicio')}
          aria-label="Hermanos Jota - Inicio"
        >
          <img src="/img/logo.svg" alt="Hermanos Jota" />
        </a>
        <nav className="nav">
          <button
            type="button"
            className={`nav-link ${seccionActiva === 'inicio' ? 'active' : ''}`}
            onClick={(e) => handleClick(e, 'inicio')}
          >
            Inicio
          </button>
          <button
            type="button"
            className={`nav-link ${seccionActiva === 'catalogo' ? 'active' : ''}`}
            onClick={(e) => handleClick(e, 'catalogo')}
          >
            Catálogo
          </button>
          <button
            type="button"
            className={`nav-link ${seccionActiva === 'contacto' ? 'active' : ''}`}
            onClick={(e) => handleClick(e, 'contacto')}
          >
            Contacto
          </button>
        </nav>
      </div>
      <div className="header-right">
        <button
          type="button"
          className="cart-link"
          onClick={(e) => handleClick(e, 'carrito')}
          aria-label="Ver carrito de compras"
        >
          <img src="/img/logo-compras.png" alt="Carrito de compras" className="cart-icon" />
          <span id="cart-count" className="cart-badge">{cantidadCarrito}</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
