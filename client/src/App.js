import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ContactForm from './components/ContactForm';
import { mockProductos } from './data/mockProductos';
import { formatoPrecio } from './utils/format';

function App() {
  // Estado de productos (datos temporales / mock por ahora)
  const [productos] = useState(mockProductos);

  // Estado de navegación y vistas
  const [seccionActiva, setSeccionActiva] = useState('inicio');

  // Estado del producto seleccionado para vista de detalle
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Estado del carrito (array plano de IDs según especificación)
  const [carrito, setCarrito] = useState([]);

  // Acciones del carrito
  const handleAddToCart = (producto) => {
    const id = typeof producto === 'object' ? producto.id : producto;
    setCarrito((prev) => [...prev, id]);
  };

  const handleQuitarUnidad = (id) => {
    setCarrito((prev) => {
      const index = prev.indexOf(id);
      if (index === -1) return prev;
      const nuevo = [...prev];
      nuevo.splice(index, 1);
      return nuevo;
    });
  };

  const handleEliminarProducto = (id) => {
    setCarrito((prev) => prev.filter((item) => item !== id));
  };

  const handleVaciarCarrito = () => {
    setCarrito([]);
  };

  // Navegación
  const handleNavigate = (seccion) => {
    setSeccionActiva(seccion);
    setProductoSeleccionado(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (producto) => {
    setProductoSeleccionado(producto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cálculo de resumen del carrito
  const cantidadesCarrito = carrito.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  const itemsCarrito = Object.keys(cantidadesCarrito)
    .map((idStr) => {
      const id = Number(idStr);
      const prod = productos.find((p) => p.id === id);
      return prod ? { producto: prod, cantidad: cantidadesCarrito[id] } : null;
    })
    .filter(Boolean);

  const totalCarrito = itemsCarrito.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );

  // Productos destacados para la portada (4 productos)
  const productosDestacados = productos.slice(0, 4);

  return (
    <div className="App">
      <Navbar
        cantidadCarrito={carrito.length}
        seccionActiva={productoSeleccionado ? 'catalogo' : seccionActiva}
        onNavigate={handleNavigate}
      />

      <main>
        {/* Renderizado condicional: Detalle de producto */}
        {productoSeleccionado ? (
          <ProductDetail
            producto={productoSeleccionado}
            onAddToCart={handleAddToCart}
            onBack={() => setProductoSeleccionado(null)}
          />
        ) : (
          <>
            {/* Sección: Inicio (Hero + Destacados + Sustentabilidad) */}
            {seccionActiva === 'inicio' && (
              <>
                <section
                  className="hero"
                  style={{
                    backgroundImage: `linear-gradient(105deg, rgba(35,25,20,.82) 0%, rgba(44,41,38,.6) 38%, rgba(44,41,38,.25) 65%, rgba(44,41,38,.1) 100%), linear-gradient(0deg, rgba(25,18,14,.75) 0%, rgba(25,18,14,.3) 50%, transparent 100%), url("/img/imagen-principal.jpg")`
                  }}
                >
                  <div className="hero-content">
                    <p className="eyebrow">MUEBLES CON HISTORIA</p>
                    <h1>Diseño que honra el pasado y abraza el futuro.</h1>
                    <p>
                      Creamos piezas atemporales con materiales nobles, oficio artesanal y una
                      mirada consciente.
                    </p>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => handleNavigate('catalogo')}
                    >
                      VER CATÁLOGO
                    </button>
                  </div>
                </section>

                <section className="section">
                  <div className="section-heading">
                    <p className="eyebrow">SELECCIÓN JOTA</p>
                    <h2>Piezas destacadas</h2>
                    <p>Descubrí muebles pensados para formar parte de tu historia.</p>
                  </div>
                  <div id="featured-products" className="product-grid">
                    <ProductList
                      productos={productosDestacados}
                      onSelectProduct={handleSelectProduct}
                      onAddToCart={handleAddToCart}
                      mostrarBuscador={false}
                    />
                  </div>
                </section>

                <section className="sustainability">
                  <div>
                    <p className="eyebrow">NUESTRO COMPROMISO</p>
                    <h2>Diseñar pensando en mañana.</h2>
                    <p>
                      Priorizamos maderas certificadas, proveedores locales y acabados naturales.
                      Cada pieza busca durar, repararse y acompañarte durante años.
                    </p>
                    <button
                      type="button"
                      className="text-link"
                      onClick={() => handleNavigate('catalogo')}
                    >
                      Conocé nuestra colección →
                    </button>
                  </div>
                </section>
              </>
            )}

            {/* Sección: Catálogo completo con buscador */}
            {seccionActiva === 'catalogo' && (
              <>
                <section className="page-header">
                  <p className="eyebrow">COLECCIÓN 2026</p>
                  <h1>Catálogo</h1>
                  <p>Objetos para vivir espacios con carácter.</p>
                </section>

                <ProductList
                  productos={productos}
                  onSelectProduct={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  mostrarBuscador={true}
                />
              </>
            )}

            {/* Sección: Contacto */}
            {seccionActiva === 'contacto' && (
              <>
                <section className="page-header">
                  <p className="eyebrow">HABLEMOS</p>
                  <h1>Contacto</h1>
                  <p>¿Tenés una consulta? Estamos para ayudarte.</p>
                </section>

                <ContactForm />
              </>
            )}

            {/* Sección: Carrito */}
            {seccionActiva === 'carrito' && (
              <>
                <section className="page-header">
                  <p className="eyebrow">TU SELECCIÓN</p>
                  <h1>Carrito</h1>
                  <p>Revisá tus piezas antes de continuar.</p>
                </section>

                <section className="cart-section">
                  <div id="cart-items" className="cart-list">
                    {itemsCarrito.length === 0 ? (
                      <div className="cart-empty">
                        <p>Tu carrito está vacío.</p>
                        <button
                          type="button"
                          className="text-link"
                          onClick={() => handleNavigate('catalogo')}
                        >
                          Ver catálogo →
                        </button>
                      </div>
                    ) : (
                      itemsCarrito.map(({ producto, cantidad }) => {
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
                                onClick={() => handleQuitarUnidad(producto.id)}
                                aria-label={`Quitar una unidad de ${producto.nombre}`}
                              >
                                −
                              </button>
                              <span>{cantidad}</span>
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => handleAddToCart(producto.id)}
                                aria-label={`Agregar una unidad de ${producto.nombre}`}
                              >
                                +
                              </button>
                            </div>
                            <p className="cart-item-subtotal">
                              {formatoPrecio(producto.precio * cantidad)}
                            </p>
                            <button
                              type="button"
                              className="cart-item-remove"
                              onClick={() => handleEliminarProducto(producto.id)}
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
                      <span id="cart-summary-count">{carrito.length}</span>
                    </p>
                    <p className="cart-summary-total">
                      <span>Total</span>
                      <span id="cart-total">{formatoPrecio(totalCarrito)}</span>
                    </p>
                    <button
                      id="cart-clear"
                      type="button"
                      className="btn-outline"
                      disabled={carrito.length === 0}
                      onClick={handleVaciarCarrito}
                    >
                      VACIAR CARRITO
                    </button>
                  </aside>
                </section>
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
