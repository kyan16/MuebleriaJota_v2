import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ContactForm from './components/ContactForm';
import Cart from './components/Cart';

function App() {
  // Estado de productos (vienen de la API) y ciclo de vida de la petición
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarProductos = useCallback(async (signal) => {
    setCargando(true);
    setError(null);
    try {
      const respuesta = await fetch('/api/productos', { signal });
      if (!respuesta.ok) {
        throw new Error(`Error ${respuesta.status} al pedir los productos`);
      }
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError('No pudimos cargar el catálogo. Verificá que el servidor esté activo e intentá de nuevo.');
    } finally {
      if (!signal || !signal.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    const controlador = new AbortController();
    cargarProductos(controlador.signal);
    return () => controlador.abort();
  }, [cargarProductos]);

  // Estado de navegación y vistas
  const [seccionActiva, setSeccionActiva] = useState('inicio');

  // Estado del producto seleccionado para vista de detalle
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Estado del carrito (array plano de IDs según especificación)
  const [carrito, setCarrito] = useState([]);

  // Acciones del carrito
  const handleAddToCart = (id) => {
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

  // Productos destacados para la portada (campo `destacado` de la API)
  const productosDestacados = productos.filter((producto) => producto.destacado);

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
            onBack={() => handleNavigate('catalogo')}
          />
        ) : (
          <>
            {/* Sección: Inicio (Hero + Destacados + Sustentabilidad) */}
            {seccionActiva === 'inicio' && (
              <>
                <section className="hero">
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
                  <ProductList
                    productos={productosDestacados}
                    onSelectProduct={handleSelectProduct}
                    onAddToCart={handleAddToCart}
                    mostrarBuscador={false}
                    cargando={cargando}
                    error={error}
                    onReintentar={() => cargarProductos()}
                  />
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
                  cargando={cargando}
                  error={error}
                  onReintentar={() => cargarProductos()}
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

                <Cart
                  items={itemsCarrito}
                  totalUnidades={carrito.length}
                  total={totalCarrito}
                  onNavigate={handleNavigate}
                  onAgregar={handleAddToCart}
                  onQuitarUnidad={handleQuitarUnidad}
                  onEliminar={handleEliminarProducto}
                  onVaciar={handleVaciarCarrito}
                />
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
