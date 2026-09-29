import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar({ cantidadCarrito = 0 }) {
  return (
    <header className="header">
      <div className="header-left">
        <Link
          className="logo"
          to="/"
          aria-label="Hermanos Jota - Inicio"
        >
          <img src="/img/logo.svg" alt="Hermanos Jota" />
        </Link>
        <nav className="nav">
          <NavLink
            to="/"
            end
            role="button"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/productos"
            role="button"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/contacto"
            role="button"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Contacto
          </NavLink>
        </nav>
      </div>
      <div className="header-right">
        <Link
          to="/carrito"
          role="button"
          className="cart-link"
          aria-label="Ver carrito de compras"
        >
          <img src="/img/logo-compras.png" alt="Carrito de compras" className="cart-icon" />
          <span id="cart-count" className="cart-badge">{cantidadCarrito}</span>
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
