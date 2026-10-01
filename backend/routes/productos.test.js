const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const { once } = require('node:events');
const express = require('express');
const productos = require('../data/productos');
const productosRouter = require('./productos');

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