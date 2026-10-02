# AGENTS.md — Hermanos Jota (MuebleriaJota_v2)

Instrucciones para agentes de IA que trabajan en este repositorio. Leer **antes** de tocar código.

## Qué es este proyecto

E-commerce cliente-servidor de una mueblería ficticia. Frontend **React 19 + react-router-dom 7** (`client/`, creado con `react-scripts`/CRA) y API REST propia con **Node.js + Express 5** (`backend/`). Sin base de datos: los productos viven en un array JS.


## Comandos

```bash
# API — http://localhost:5000
cd backend && npm install && npm start

# Cliente — http://localhost:3000
cd client && npm install && npm start

# Tests del cliente (suite completa, sin watch)
cd client && CI=true npm test -- --watchAll=false
```

`npm test` en `backend/` no existe (falla a propósito). El backend no tiene tests.

## Estructura

```
backend/
  app.js               # express, middlewares, 404 global y manejador de errores 500
  data/productos.js    # 11 productos (array)
  routes/productos.js  # express.Router
  middlewares/logger.js
client/
  public/img/          # 11 fotos de producto + logo.svg + logo-compras.png
  src/
    App.js             # estado global (productos, producto seleccionado, carrito) + rutas
    index.css          # sistema de diseño completo (889 líneas): variables, layout, componentes
    App.css            # estilos mínimos de CRA
    components/        # Navbar, Footer, ProductCard, ProductList, ProductDetail, Cart, ContactForm
    utils/format.js    # formatoPrecio, normalizarTexto
    data/mockProductos.js  # ⚠ código muerto, nadie lo importa
    setupProxy.js      # proxy de /api → localhost:5000
  src/App.test.js      # 11 tests de integración que cubren casi toda la app
```

## Contratos que NO se pueden romper

Son	assertados por `App.test.js` o requeridos por la UI:

| Contrato | Valor |
|---|---|
| Clave de `localStorage` | `carrito` (array plano de ids, `{ id, cantidad }` se calcula derivado) |
| Endpoint del cliente | `fetch('/api/productos')` — relativo, nunca URL absoluta |
| API | `GET /api/productos`, `GET /api/productos/:id` (`404` JSON si no existe) |
| Badge del carrito | elemento con `id="cart-count"` (`.cart-badge`) |
| Contenedores | `#featured-products` (portada), `#product-grid` (catálogo), `#search` (buscador) |
| Carrito | `#cart-items`, `#cart-total`, `#cart-clear`, `#cart-message` |
| Formulario | `#contact-form`, `#form-message` |
| Helpers | `formatoPrecio(precio)` (Intl `es-AR`, sin decimales) y `normalizarTexto(texto)` en `client/src/utils/format.js` |
| Forma del producto | `id, nombre, precio, categoria, imagen, descripcion, especificaciones[{label,value}], destacado` |

`imagen` viene como `img/...` (con espacios y tildes en el nombre). Los componentes anteponen `/`. **Nunca pasar imágenes por el proxy**: `setupProxy.js` solo intercepta `/api` justamente para que eso no se rompa.

## Convenciones

- **Idioma: español.** Nombres de variables, props, estados, handlers y comentarios en español (`productos`, `cargando`, `onAddToCart`, `totalCarrito`). Respuestas de API en español (`mensaje`).
- **Comentarios en español**, una sola línea `//` que explica el *qué*, nunca el *qué* obvio.
- Componentes = `function` + `export default` al final. Sin `React.FC`, sin PropTypes, sin TypeScript.
- `className` en JSX con los nombres de clase del sistema de diseño (`btn`, `btn-small`, `product-card`, `eyebrow`, `page-header`…). No inventar selectores nuevos si ya existe uno equivalente.
- **Todo el CSS vive en `client/src/index.css`**: variables de `:root`, mobile-first, un solo breakpoint `min-width: 768px`, `clamp()` para títulos. No agregar hojas de estilo, CSS-in-JS ni estilos inline (salvo necesidad dinámica real).
- Paleta cerrada: `--siena #A0522D`, `--salvia #87A96B`, `--alabastro #F5E6D3`, `--oro #D4A437`, `--rosa #C47A6D`, `--texto #2c2926`, `--blanco #fffaf4`. No hardcodear colores ni agregar variables nuevas sin motivo.
- Tipografías: `Playfair Display` para títulos, `Inter` para el resto. Botones en mayúsculas con `letter-spacing`.
- Accesibilidad es parte del diseño: los `NavLink` llevan `role="button"`, los elementos clicables necesitan `tabIndex` + teclado, y hay `aria-label` en íconos (`Ver detalle de X`, `Ver carrito de compras`). Mantenerlo: los tests buscan por rol y por etiqueta.
- Rutas en `/`, `/productos`, `/productos/:id`, `/carrito`, `/contacto`. El detalle se resuelve por `id` de la URL contra los productos ya cargados en `App.js`.
- Backend: CommonJS (`require`/`module.exports`), Express 5, `res.json`, early return en errores.

## Reglas de trabajo

1. Correr `CI=true npm test -- --watchAll=false` en `client/` **después de cada cambio**. La suite cubre navegación, filtros, carrito, localStorage y formulario: es la red de seguridad real del proyecto.
2. No agregar dependencias sin necesidad. El proyecto es deliberadamente chico.
3. No tocar ni versionar `node_modules/`, `client/build/`, `.env`, `package-lock.json` (salvo `npm install` de una dependencia nueva).
4. No hacer commits ni push sin pedido explícito del usuario.
5. Si un cambio altera el diseño o los textos, mantener el tono de `ESPECIFICACION.md` (marca artesanal, sin jerga de startup) y actualizar el capítulo correspondiente de la spec si el cambio es estructural.
6. Si algo del repo contradice este archivo (por ejemplo `client/src/data/mockProductos.js`, que es residuo de la etapa previa a la API), no lo "arregles" de paso: mencionalo.

## Gotchas conocidos

- `client/.env` fija `PORT=3001` y `BROWSER=none` (CRA usa su propio puerto, no el del backend).
- `Navbar` y `ProductCard` usan `role="button"` en elementos de navegación por decisión de diseño heredada de la versión vanilla; los tests dependen de eso.
- `mockProductos.js` duplica `backend/data/productos.js` y no se importa en ningún lado.
- Cambiar el puerto del backend implica actualizar `target` en `client/src/setupProxy.js` y el `.env` del cliente.
