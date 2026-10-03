<div align="center">

# 🪵 Hermanos Jota

### E-commerce de muebles artesanales con identidad argentina

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-tested-C21325?logo=jest&logoColor=white)

Proyecto académico — Sprint 3 y 4

</div>

---

## 📖 Descripción

**Hermanos Jota** es una aplicación web cliente-servidor para una mueblería de diseño con identidad argentina. El **frontend**, hecho en **React**, consume una **API REST propia** construida con **Node.js y Express**, que sirve el catálogo de 11 piezas de mobiliario.

Reconstruye, en arquitectura cliente-servidor, el sitio estático original hecho en HTML, CSS y JavaScript vanilla.

## 👥 Integrantes

| Nombre | GitHub |
|---|---|
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |

## ✨ Funcionalidades

- 🏠 **Portada** con hero y piezas destacadas
- 🛋️ **Catálogo** de 11 productos con buscador por nombre, categoría y descripción
- 🔍 **Detalle de producto** con imagen, precio, descripción y especificaciones
- 🛒 **Carrito** con contador, cantidades, subtotales, total y persistencia en `localStorage`
- ✉️ **Contacto** con formulario controlado y validación
- 🔄 Estados de carga y error al consumir la API, con opción de reintentar

## 🛠️ Tecnologías

| Capa | Tecnologías |
|---|---|
| Frontend | React 19, React Router, create-react-app, CSS3 puro |
| Backend | Node.js, Express 5 |
| Tests | Jest + React Testing Library (cliente) · `node --test` (backend) |
| Tipografías | Playfair Display e Inter (Google Fonts) |

## 🚀 Instalación y ejecución

### Requisitos previos
- **Node.js 18 o superior** (incluye `npm`)
- Los puertos **3000** (cliente) y **5000** (API) libres

### Pasos
Hacen falta **dos terminales abiertas al mismo tiempo**.

**Terminal 1 — API** (`http://localhost:5000`)
```bash
cd backend
npm install
npm start
```

**Terminal 2 — Cliente** (`http://localhost:3000`)
```bash
cd client
npm install
npm start
```

Se abre el navegador solo; si no, entrá a `http://localhost:3000`.

### Scripts disponibles

| Carpeta | Comando | Qué hace |
|---|---|---|
| `backend` | `npm start` | Levanta la API |
| `backend` | `npm test` | Corre los tests del backend |
| `client` | `npm start` | Servidor de desarrollo de React |
| `client` | `npm test` | Corre los tests del cliente |
| `client` | `npm run build` | Genera la versión de producción |

## 📡 API

Base: `http://localhost:5000/api`

| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/productos` | Listado completo en JSON |
| `GET` | `/productos/:id` | Un producto, o `404` si no existe |

Cualquier otra ruta responde `404`, y los errores inesperados se resuelven en un manejador centralizado (`500`).

## 📁 Estructura del proyecto

```text
MuebleriaJota_v2/
├── README.md
├── AGENTS.md                 # Reglas para agentes de IA y colaboradores
├── backend/
│   ├── app.js                 # Servidor, middlewares globales, 404 y errores
│   ├── data/productos.js      # Array de productos
│   ├── routes/productos.js    # Rutas de la API
│   └── middlewares/logger.js
└── client/
    ├── public/img/             # Imágenes de productos y logos
    └── src/
        ├── App.js              # Rutas, estado global y fetch a la API
        ├── index.css           # Hoja de estilos
        ├── components/         # Navbar, Footer, ProductCard, ProductList,
        │                       # ProductDetail, Cart, ContactForm, ScrollToTop
        └── utils/               # formatoPrecio(), normalizarTexto(), feedback del carrito
```

## 🤝 Contribuir

Antes de trabajar en el proyecto, leé **[`AGENTS.md`](./AGENTS.md)**: tiene las reglas de arquitectura, el contrato de la API y las convenciones de código.

---

<div align="center">

Proyecto académico realizado en el marco de ITBA.

</div>
