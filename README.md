# MuebleriaJota_v2 — Hermanos Jota

E-commerce cliente-servidor: frontend en **React** (`/client`) que consume una API REST propia hecha con **Node.js + Express** (`/backend`).

## Requisitos
- Node.js 18 o superior

## Cómo correrlo
Abrí **dos terminales**:

```bash
# Terminal 1 — API (http://localhost:5000)
cd backend
npm install
npm start
```

```bash
# Terminal 2 — Cliente (http://localhost:3000)
cd client
npm install
npm start
```

El cliente redirige las peticiones `/api/...` al backend mediante `client/src/setupProxy.js`, por lo que no hace falta configurar CORS. Si cambiás el puerto del backend (variable de entorno `PORT`), actualizá también el `target` de ese archivo.

## API
| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/productos` | Listado completo en JSON |
| GET | `/api/productos/:id` | Un producto, o `404` si no existe |

Cualquier otra ruta responde `404` en JSON y los errores inesperados se resuelven en un manejador centralizado (`500`).

## Estructura
```
backend/
  app.js               # servidor, middlewares globales, 404 y manejador de errores
  data/productos.js    # array de productos
  routes/productos.js  # express.Router con las rutas de la API
  middlewares/logger.js
client/
  public/img/          # imágenes de productos y logos
  src/
    App.js             # estado global: productos (fetch), navegación y carrito
    components/        # Navbar, Footer, ProductCard, ProductList, ProductDetail, Cart, ContactForm
    utils/format.js
```

## Tests del cliente
```bash
cd client
npm test
```
