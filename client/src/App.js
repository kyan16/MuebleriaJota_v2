import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ContactForm from './components/ContactForm';
import Cart from './components/Cart';

// Componente para la página de inicio
function HomePage({ productos, onAddToCart, onSelectProduct, cargando, error, onReintentar }) {
  const productosDestacados = productos.filter((producto) => producto.destacado);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">MUEBLES CON HISTORIA</p>
          <h1>Diseño que honra el pasado y abraza el futuro.</h1>
          <p>
            Creamos piezas atemporales con materiales nobles, oficio artesanal y una
            mirada consciente.
          </p>
          <Link to="/productos" className="btn">
            VER CATÁLOGO
          </Link>
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
          onSelectProduct={onSelectProduct}
          onAddToCart={onAddToCart}
          mostrarBuscador={false}
          cargando={cargando}
          error={error}
          onReintentar={onReintentar}
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
          <Link to="/productos" className="text-link">
            Conocé nuestra colección →
          </Link>
        </div>
      </section>
    </>
  );
}

// Componente para la página del catálogo de productos
function ProductosPage({ productos, onAddToCart, onSelectProduct, cargando, error, onReintentar }) {
  return (
    <>
      <section className="page-header">
        <p className="eyebrow">COLECCIÓN 2026</p>
        <h1>Catálogo</h1>
        <p>Objetos para vivir espacios con carácter.</p>
      </section>

      <ProductList
        productos={productos}
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
        mostrarBuscador={true}
        cargando={cargando}
        error={error}
        onReintentar={onReintentar}
      />
    </>
  );
}

// Componente para la página de detalle de producto según id de la ruta
function ProductoDetallePage({ productos, onAddToCart, productoSeleccionado }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const producto =
    productoSeleccionado ||
    (id ? productos.find((p) => String(p.id) === String(id)) : null);

  return (
    <ProductDetail
      producto={producto}
      onAddToCart={onAddToCart}
      onBack={() => {
        navigate('/productos');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
}

// Componente para la página de contacto
function ContactoPage() {
  return (
    <>
      <section className="page-header">
        <p className="eyebrow">HABLEMOS</p>
        <h1>Contacto</h1>
        <p>¿Tenés una consulta? Estamos para ayudarte.</p>
      </section>

      <ContactForm />
    </>
  );
}

// Componente para la página de carrito
function CarritoPage({
  itemsCarrito,
  totalUnidades,
  totalCarrito,
  onAddToCart,
  onQuitarUnidad,
  onEliminarProducto,
  onVaciarCarrito
}) {
  const navigate = useNavigate();

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">TU SELECCIÓN</p>
        <h1>Carrito</h1>
        <p>Revisá tus piezas antes de continuar.</p>
      </section>

      <Cart
        items={itemsCarrito}
        totalUnidades={totalUnidades}
        total={totalCarrito}
        onNavigate={(destino) => {
          if (destino === 'catalogo') navigate('/productos');
          else if (destino === 'inicio') navigate('/');
          else if (destino === 'contacto') navigate('/contacto');
          else navigate(`/${destino}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAgregar={onAddToCart}
        onQuitarUnidad={onQuitarUnidad}
        onEliminar={onEliminarProducto}
        onVaciar={onVaciarCarrito}
      />
    </>
  );
}

// Contenido principal de la aplicación con Router
function AppContent() {
  const navigate = useNavigate();

  // Estado de productos y ciclo de vida de la petición
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

  // Estado del producto seleccionado para vista de detalle
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Clave de almacenamiento en localStorage
  const STORAGE_KEY = 'carrito';

  // Estado del carrito: inicializado desde localStorage de manera segura
  const [carrito, setCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        const parseado = JSON.parse(guardado);
        if (Array.isArray(parseado)) {
          return parseado;
        }
      }
    } catch (err) {
      console.error('Error al leer el carrito desde localStorage:', err);
    }
    return [];
  });

  // Guardar en localStorage cada vez que el carrito cambia
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    } catch (err) {
      console.error('Error al guardar el carrito en localStorage:', err);
    }
  }, [carrito]);

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

  const handleSelectProduct = (producto) => {
    setProductoSeleccionado(producto);
    navigate(`/productos/${producto.id}`);
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

  return (
    <div className="App">
      <Navbar cantidadCarrito={carrito.length} />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                productos={productos}
                onAddToCart={handleAddToCart}
                onSelectProduct={handleSelectProduct}
                cargando={cargando}
                error={error}
                onReintentar={() => cargarProductos()}
              />
            }
          />
          <Route
            path="/productos"
            element={
              <ProductosPage
                productos={productos}
                onAddToCart={handleAddToCart}
                onSelectProduct={handleSelectProduct}
                cargando={cargando}
                error={error}
                onReintentar={() => cargarProductos()}
              />
            }
          />
          <Route
            path="/productos/:id"
            element={
              <ProductoDetallePage
                productos={productos}
                onAddToCart={handleAddToCart}
                productoSeleccionado={productoSeleccionado}
              />
            }
          />
          <Route
            path="/contacto"
            element={<ContactoPage />}
          />
          <Route
            path="/carrito"
            element={
              <CarritoPage
                itemsCarrito={itemsCarrito}
                totalUnidades={carrito.length}
                totalCarrito={totalCarrito}
                onAddToCart={handleAddToCart}
                onQuitarUnidad={handleQuitarUnidad}
                onEliminarProducto={handleEliminarProducto}
                onVaciarCarrito={handleVaciarCarrito}
              />
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
