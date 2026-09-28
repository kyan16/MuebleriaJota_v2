// Redirige al backend solo las peticiones a /api.
// (El "proxy" de package.json también desviaba al backend los pedidos a
// imágenes con espacios o tildes en el nombre, y por eso no se veían.)
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true
    })
  );
};
