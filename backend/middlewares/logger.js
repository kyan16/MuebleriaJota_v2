// Middleware de logging para registrar peticiones en consola
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl || req.url}`);
  next();
};

module.exports = logger;
