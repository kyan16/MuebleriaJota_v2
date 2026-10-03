# AGENTS.md — Guía para agentes de IA y colaboradores · Hermanos Jota (v2)

Directrices obligatorias para cualquier agente de IA o desarrollador que trabaje en este repositorio. Para instrucciones de uso y ejecución, ver `README.md`.

---

## 1. Proyecto

E-commerce cliente-servidor de muebles artesanales (proyecto académico de 5 integrantes, Sprint 4):
- `/backend`: API REST con **Node.js + Express** (datos en un array `.js`, sin base de datos).
- `/client`: interfaz en **React** (create-react-app) que consume la API con `fetch`, con navegación por **React Router**.

Esta versión reemplaza a la v1 (HTML/CSS/JS vanilla). **Las reglas "vanilla puro" de una posible v1 anterior ya no aplican**: React, React Router y Express son parte de la consigna.

## 2. Stack

**Permitido**
- React 19 con **componentes funcionales** y hooks (`useState`, `useEffect`, `useMemo`, `useCallback`).
- **`react-router-dom`** para rutas y navegación (ver decisión en el punto 0).
- Express 5 (CommonJS), `express.Router`, middlewares propios.
- CSS3 puro en un único archivo (variables, Flexbox, Grid, media queries).
- Jest + React Testing Library (cliente) y el test runner nativo de Node, `node --test` (backend).
- APIs nativas del navegador cuando hacen falta (ej. `Web Audio API` para el sonido de feedback del carrito).

**Prohibido salvo pedido explícito del usuario**
- ❌ Librerías nuevas de npm más allá de `react-router-dom` (Redux, Zustand, Axios, Lodash, Moment, etc.). Se usa `fetch`, `Intl`, `localStorage` y APIs nativas.
- ❌ Frameworks o preprocesadores CSS (Tailwind, Bootstrap, Sass, styled-components…).
- ❌ TypeScript, bases de datos, ORMs, autenticación.
- ❌ `npm audit fix --force` (rompe `react-scripts`).
- ❌ Hacer `eject` del proyecto.

## 3. Estructura

```text
backend/
  app.js                   # servidor + middlewares globales + 404 + errores (puerto: PORT || 5000)
  data/productos.js        # fuente de datos
  routes/productos.js      # GET / y GET /:id
  routes/productos.test.js # tests del backend (node --test)
  middlewares/logger.js
client/
  public/img/              # imágenes de productos (se piden como /img/<archivo>)
  src/
    App.js                 # BrowserRouter + Routes; dueño del estado global y del fetch;
                            # agrupa las "páginas" (HomePage, ProductosPage, ProductoDetallePage,
                            # ContactoPage, CarritoPage) definidas en el propio archivo
    index.css               # ÚNICA hoja de estilos
    setupProxy.js            # /api -> http://localhost:5000
    assets/                  # imágenes importadas desde el CSS (ej. fondo del hero)
    components/
      Navbar.js              # usa <Link>/<NavLink> de react-router-dom
      ScrollToTop.js          # lleva el scroll arriba en cada cambio de ruta
      Footer.js, ProductCard.js, ProductList.js, ProductDetail.js, Cart.js, ContactForm.js
    utils/
      format.js              # formatoPrecio(), normalizarTexto()
      cartFeedback.js         # animación + sonido al añadir al carrito
    App.test.js
```
La carpeta `/img` de la raíz es una copia de los recursos originales; **la app usa `client/public/img`**. No debe existir `client/src/data/` (ver punto 0.2).

## 4. Contrato de la API (no romper)

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/productos` | `200` arreglo de productos |
| GET | `/api/productos/:id` | `200` producto · `404 { mensaje: "Producto no encontrado" }` |
| otras | — | `404 { mensaje: "Ruta no encontrada" }` |
| error | — | `500 { mensaje: "Ocurrió un error en el servidor" }` |

**Forma de un producto** (mantenerla idéntica en `backend/data/productos.js`):
```js
{
  id: Number,                 // único
  nombre: String,
  precio: Number,             // entero en ARS
  categoria: String,
  imagen: String,             // ruta relativa a client/public, ej. "img/Sofá Patagonia.png"
  descripcion: String,
  especificaciones: [{ label: String, value: String }],
  destacado: Boolean          // true => aparece en la portada (mantener 3–4)
}
```
Al agregar un producto: id nuevo y único, imagen existente en `client/public/img` (con tilde si corresponde), y actualizar `backend/routes/productos.test.js` y el fixture de `client/src/App.test.js` solo si el test lo necesita.

## 5. Reglas para el backend

1. Rutas siempre en `routes/` con `express.Router`; `app.js` solo monta y configura.
2. Mantener el **orden** en `app.js`: `express.json()` → `logger` → rutas → 404 → manejador de errores (este último siempre al final).
3. Los errores se resuelven en el manejador centralizado; no responder `500` a mano en cada ruta.
4. Respuestas siempre en JSON. Mensajes de error con la clave `mensaje`.
5. No hardcodear el puerto: usar `process.env.PORT || 5000`.
6. Si se cambia una ruta o la forma de los datos, actualizar `routes/productos.test.js` (`cd backend && npm test`).

## 6. Reglas para el frontend

1. **El `fetch` vive solo en `App.js`.** Los componentes reciben datos y callbacks por **props**; no hacen peticiones.
2. Mantener el ciclo de la petición completo: `cargando` → `error` (con *Reintentar*) → éxito. No mostrar la lista antes de tener datos.
3. **Navegación con React Router** (ver punto 0): rutas definidas en `App.js` con `<Routes>`/`<Route>`. `Navbar` usa `<Link>`/`<NavLink>`, nunca botones con estado manual. `ScrollToTop` debe seguir montado dentro del `<BrowserRouter>` para que cada cambio de ruta resetee el scroll.
4. **Carrito = arreglo plano de ids** (`[1, 3, 3]`). Cantidades, subtotales y total se **derivan**; no guardar cantidades aparte. El contador del `Navbar` llega por props (`cantidadCarrito`). El carrito persiste en `localStorage` bajo la clave `"carrito"`, leído de forma segura (try/catch, validando que sea un array) al iniciar y guardado en un `useEffect` cada vez que cambia.
5. Listas con `.map()` y `key` **estable** (`producto.id`, `spec.label`); nunca el índice.
6. Componentes funcionales, uno por archivo en `components/`, nombre en PascalCase. Handlers con prefijo `handle…`.
7. Formularios **controlados** con `useState`. Cada `<input>`/`<textarea>` con `<label htmlFor>` asociado y validación nativa (`required`, `type="email"`).
8. Rutas de imagen: `/${imagen}` (con barra inicial) sobre `public/`. No mover ni renombrar archivos de `public/img` sin actualizar `backend/data/productos.js`.
9. Formato de precios siempre con `formatoPrecio()` (`Intl.NumberFormat("es-AR", ARS, sin decimales`). Búsquedas con `normalizarTexto()` (sin tildes, sin mayúsculas).
10. No usar estilos `style={{…}}` salvo valores realmente dinámicos; los estilos van en `index.css`.
11. No crear `client/src/data/mockProductos.js` ni ningún mock que reemplace al `fetch` (ver punto 0.2).
12. El feedback visual/sonoro al añadir al carrito pasa por `activarFeedbackCarrito()` (`utils/cartFeedback.js`); no duplicar esa lógica en los componentes.

## 7. Reglas de CSS (`client/src/index.css`)

1. Usar siempre las variables de `:root`; **no hardcodear colores**:

| Variable | Hex | Uso |
|---|---|---|
| `--siena` | `#A0522D` | Botones principales, acentos, precios |
| `--salvia` | `#87A96B` | Sustentabilidad, mensajes de éxito |
| `--alabastro` | `#F5E6D3` | Fondo del `body`, header, footer |
| `--oro` | `#D4A437` | Detalles secundarios |
| `--rosa` | `#C47A6D` | Acentos cálidos, botón eliminar |
| `--texto` | `#2c2926` | Texto principal |
| `--blanco` | `#fffaf4` | Tarjetas y cajas |

2. **Mobile first**: estilos base para pantallas angostas; ajustes de escritorio dentro de `@media (min-width: 768px)`. Antes de crear un segundo bloque `@media`, agregar las reglas al existente.
3. Clases en `kebab-case` (`.product-card`, `.cart-item`). Antes de crear una clase, buscar si ya existe.
4. Flexbox/Grid para maquetar; `clamp()` y unidades relativas para tipografía fluida.
5. Tipografías: títulos `"Playfair Display", Georgia, serif`; cuerpo, botones y datos `"Inter", sans-serif`.
6. **Los `url()` del CSS deben ser relativos a `src`** (ej. `./assets/imagen-principal.jpg`). Una ruta absoluta (`/img/...`) hace fallar la compilación de create-react-app.
7. No eliminar los estilos de `:focus`/`:focus-visible` sin reemplazo accesible. Mantener contraste WCAG AA.
8. Cuidar el balance de llaves `{ }` al editar; un `}` sobrante o faltante rompe los estilos siguientes en silencio.

## 8. Trampas conocidas 

- **Proxy y nombres con espacios.** El campo `"proxy"` de `client/package.json` desvía al backend los pedidos a archivos con espacios o tildes en `public/`, y las imágenes dan 404. Por eso se usa `src/setupProxy.js` (solo `/api`). **No volver a agregar `"proxy"`** al `package.json`. Los cambios en `setupProxy.js` requieren reiniciar `npm start`.
- **Jest y React Router:** `client/package.json` tiene un `moduleNameMapper` para `react-router`/`react-router-dom` y `setupTests.js` define `TextEncoder`/`TextDecoder`. Son necesarios porque esa librería se distribuye en ESM; no sacarlos mientras el proyecto use router.
- **Puertos:** cliente `3000`, API `5000`. Si se cambia uno, actualizar el otro extremo (`PORT` / `target` de `setupProxy.js`).
- **Los tests no compilan CSS**, así que no detectan errores de estilos ni de rutas de `url()`. Verificar levantando la app.
- El carrito **persiste** en `localStorage` (ver punto 6.4); no asumir que se reinicia al recargar.
- `App.css` tiene una regla global para evitar scroll horizontal (`html, body, #root { overflow-x: hidden }`); no borrarla sin probar en mobile.

## 9. Tests

- **Cliente**: `client/src/App.test.js`, correr con `cd client && npm test`. `fetch` siempre mockeado; `localStorage` se limpia en `beforeEach`.
- **Backend**: `backend/routes/productos.test.js`, correr con `cd backend && npm test`. Levanta un servidor Express real en un puerto aleatorio y pega contra él con `fetch`.
- Usar `findBy…` / `waitFor` en el cliente para lo que aparece tras la petición; `getBy…` para lo síncrono.
- Si se agrega o cambia un componente, una ruta o una funcionalidad, agregar o ajustar el test correspondiente en el lado que corresponda.

## 10. Flujo de trabajo obligatorio

1. **Analizar** el pedido y definir su alcance exacto.
2. **Inspeccionar** los archivos involucrados antes de editar (`App.js`, el componente, `index.css`, la ruta), y este archivo si hay dudas.
3. **Entender** cómo funciona hoy la funcionalidad (rastrear el flujo de datos, props y rutas).
4. **Planificar** el cambio mínimo que cumpla el pedido.
5. **Editar de forma quirúrgica**: modificar solo lo necesario, sin reescribir archivos enteros, sin refactors no pedidos, sin funcionalidades "por si acaso" (esto incluye no agregar ni sacar el router sin pedido explícito, no agregar mocks, no renombrar imágenes).
6. **Revisar** que se respeten las convenciones de este documento.
7. **Verificar** con la checklist de abajo.
8. **Informar** los cambios (sección 12).

**Reutilizar antes de crear**: buscar primero un componente, función o clase que ya exista. **Impacto cruzado**: cambios en `Navbar`, `Footer` o `index.css` afectan todas las vistas.

## 11. Checklist antes de dar una tarea por terminada

- [ ] Se cumple lo pedido, sin extras.
- [ ] No se sacó el router ni se reintrodujo `mockProductos.js`.
- [ ] Los nombres de archivo en `client/public/img` conservan las tildes reales.
- [ ] `cd backend && npm start` arranca sin errores y `/api/productos` responde; `cd backend && npm test` pasa.
- [ ] La portada muestra los destacados; el catálogo, los 11 productos con imagen.
- [ ] Se ven los estados de **carga** y de **error** (probar con el backend apagado) y *Reintentar* funciona.
- [ ] El buscador filtra por nombre, categoría y descripción.
- [ ] El detalle muestra precio y especificaciones; *Añadir* actualiza el contador y da feedback visual/sonoro.
- [ ] El carrito suma, resta, elimina, vacía, calcula el total y persiste al recargar.
- [ ] La navegación por URL funciona (`/`, `/productos`, `/productos/:id`, `/contacto`, `/carrito`) y el scroll se resetea en cada cambio.
- [ ] El formulario de contacto valida y muestra el mensaje de éxito.
- [ ] Responsive correcto en móvil (< 768px) y escritorio (≥ 768px).
- [ ] `npm test` en `client` pasa.
- [ ] Sin errores ni advertencias en la consola del navegador ni en la terminal.

## 12. Cómo informar los cambios

Al terminar, entregar un reporte conciso con:
1. **Archivos modificados**: rutas relativas.
2. **Resumen de cambios**: qué se agregó, modificó o eliminó, y por qué.
3. **Impacto**: qué funcionalidades existentes se verificaron y cuáles **no** se pudieron verificar (por ejemplo, si no se pudo correr la app o los tests).

## 13. Lo que no se debe hacer

- No sacar React Router ni volver al renderizado condicional puro para la navegación.
- No cambiar nombres de archivos ni carpetas existentes (`App.js`, `index.css`, `components/`, `routes/`, etc.).
- No alterar el contrato de la API ni la forma de los productos sin pedido explícito.
- No modificar `README.md` ni este archivo salvo en tareas de documentación, y nunca reemplazándolos por una versión con menos contenido o de otro origen sin avisar.
- No commitear `node_modules/`, `build/` ni archivos `.env`.
