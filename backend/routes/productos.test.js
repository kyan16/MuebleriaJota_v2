const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const { once } = require('node:events');
const express = require('express');
const productos = require('../data/productos');
const productosRouter = require('./productos');
const {
  obtenerProductos,
  obtenerProductoPorId
} = require('../controllers/productosController');

const app = express();
app.use('/api/productos', productosRouter);

let servidor;
let urlProductos;

before(async () => {
  servidor = app.listen(0, '127.0.0.1');
  await once(servidor, 'listening');
  urlProductos = `http://127.0.0.1:${servidor.address().port}/api/productos`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    servidor.close((error) => (error ? reject(error) : resolve()));
  });
});

test('GET /api/productos devuelve todos los productos', async () => {
  const respuesta = await fetch(urlProductos);

  assert.equal(respuesta.status, 200);
  assert.deepEqual(await respuesta.json(), productos);
});

test('GET /api/productos/:id devuelve el producto solicitado', async () => {
  const productoEsperado = productos[0];
  const respuesta = await fetch(`${urlProductos}/${productoEsperado.id}`);

  assert.equal(respuesta.status, 200);
  assert.deepEqual(await respuesta.json(), productoEsperado);
});

test('GET /api/productos/:id responde 404 si el producto no existe', async () => {
  const respuesta = await fetch(`${urlProductos}/999999`);

  assert.equal(respuesta.status, 404);
  assert.deepEqual(await respuesta.json(), { mensaje: 'Producto no encontrado' });
});

test('GET /api/productos/:id responde 400 si el id no tiene formato de entero', async () => {
  const idsInvalidos = ['abc', '12abc', '1.5', '-3', '1e3', ' '];

  for (const id of idsInvalidos) {
    const respuesta = await fetch(`${urlProductos}/${encodeURIComponent(id)}`);

    assert.equal(respuesta.status, 400, `esperaba 400 para el id "${id}"`);
    assert.deepEqual(await respuesta.json(), {
      mensaje: 'ID de producto inválido: debe ser un número entero'
    });
  }
});

test('GET /api/productos/0 responde 404: el formato es válido, el producto no existe', async () => {
  const respuesta = await fetch(`${urlProductos}/0`);

  assert.equal(respuesta.status, 404);
  assert.deepEqual(await respuesta.json(), { mensaje: 'Producto no encontrado' });
});

// El controller se puede usar directamente, sin pasar por el router
const crearRes = () => {
  const respuesta = { codigo: 200, cuerpo: undefined };
  respuesta.status = (codigo) => {
    respuesta.codigo = codigo;
    return respuesta;
  };
  respuesta.json = (cuerpo) => {
    respuesta.cuerpo = cuerpo;
    return respuesta;
  };
  return respuesta;
};

test('Controller: obtenerProductos devuelve el listado completo', () => {
  const res = crearRes();

  obtenerProductos({}, res);

  assert.equal(res.codigo, 200);
  assert.deepEqual(res.cuerpo, productos);
});

test('Controller: obtenerProductoPorId devuelve 200, 404 y 400 según el id', () => {
  const resOk = crearRes();
  obtenerProductoPorId({ params: { id: String(productos[0].id) } }, resOk);
  assert.equal(resOk.codigo, 200);
  assert.deepEqual(resOk.cuerpo, productos[0]);

  const resNoEncontrado = crearRes();
  obtenerProductoPorId({ params: { id: '999999' } }, resNoEncontrado);
  assert.equal(resNoEncontrado.codigo, 404);
  assert.deepEqual(resNoEncontrado.cuerpo, { mensaje: 'Producto no encontrado' });

  const resInvalido = crearRes();
  obtenerProductoPorId({ params: { id: 'abc' } }, resInvalido);
  assert.equal(resInvalido.codigo, 400);
  assert.deepEqual(resInvalido.cuerpo, {
    mensaje: 'ID de producto inválido: debe ser un número entero'
  });
});

test('Controller: obtenerProductoPorId delega en next() ante un error inesperado', () => {
  const errores = [];
  const falla = {
    get params() {
      throw new Error('boom');
    }
  };

  obtenerProductoPorId(falla, crearRes(), (error) => errores.push(error));

  assert.equal(errores.length, 1);
  assert.equal(errores[0].message, 'boom');
});