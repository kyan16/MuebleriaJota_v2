const express = require('express');
const router = express.Router();
const {
  obtenerProductos,
  obtenerProductoPorId
} = require('../controllers/productosController');

// Las rutas solo definen endpoints y delegan en el controller.
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

module.exports = router;