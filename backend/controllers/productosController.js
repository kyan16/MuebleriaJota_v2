const productos = require('../data/productos');

// Solo se aceptan ids enteros positivos en forma de dígitos ("12" y no "12abc",
// "1.5", "-3" ni "1e3"). Cualquier otro formato es un pedido mal formado, no un
// producto inexistente.
const FORMATO_ID = /^\d+$/;

// GET /api/productos - Obtener todos los productos
const obtenerProductos = (req, res) => {
  res.json(productos);
};

// GET /api/productos/:id - Obtener un producto por ID
const obtenerProductoPorId = (req, res, next) => {
  try {
    const parametro = req.params.id;

    if (!FORMATO_ID.test(parametro)) {
      return res.status(400).json({ mensaje: 'ID de producto inválido: debe ser un número entero' });
    }

    const id = Number(parametro);

    if (!Number.isSafeInteger(id)) {
      return res.status(400).json({ mensaje: 'ID de producto inválido: debe ser un número entero' });
    }

    const producto = productos.find((p) => p.id === id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    next(error);
  }
};

module.exports = { obtenerProductos, obtenerProductoPorId };