const express = require('express');
const logger = require('./middlewares/logger');
const productosRouter = require('./routes/productos');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales
app.use(express.json());
app.use(logger);

// Rutas principales
app.use('/api/productos', productosRouter);

// Manejador global para rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejador centralizado de errores (500)
app.use((err, req, res, next) => {
  console.error('Error interno del servidor:', err);
  res.status(500).json({ mensaje: 'Ocurrió un error en el servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
