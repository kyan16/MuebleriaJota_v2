import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar({ cantidadCarrito = 0 }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Cierra el menú al navegar
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <header className="header">
      <div className="header-inner">
        <Link
          className="logo"
          to="/"
          aria-label="Hermanos Jota - Inicio"
          onClick={cerrarMenu}
        >
          <img src="/img/logo.svg" alt="Hermanos Jota" />
        </Link>

        <div className="header-actions">
          <Link
            to="/carrito"
            role="button"
            className="cart-link"
            aria-label="Ver carrito de compras"
            onClick={cerrarMenu}
          >
            <img src="/img/logo-compras.png" alt="Carrito de compras" className="cart-icon" />
            <span id="cart-count" className="cart-badge">{cantidadCarrito}</span>
          </Link>

          {/* Botón hamburguesa — solo visible en mobile */}
          <button
            className={`hamburger${menuAbierto ? ' is-open' : ''}`}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
            onClick={() => setMenuAbierto((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Nav — collapsa en mobile, inline en desktop */}
      <nav className={`nav${menuAbierto ? ' nav-open' : ''}`}>
        <NavLink
          to="/"
          end
          role="button"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          onClick={cerrarMenu}
        >
          Inicio
        </NavLink>
        <NavLink
          to="/productos"
          role="button"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          onClick={cerrarMenu}
        >
          Catálogo
        </NavLink>
        <NavLink
          to="/contacto"
          role="button"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          onClick={cerrarMenu}
        >
          Contacto
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
