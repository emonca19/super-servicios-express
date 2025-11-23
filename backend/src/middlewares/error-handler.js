const { error } = require('../utils/response');

/**
 * Middleware de manejo de errores centralizado.
 * Captura todos los errores pasados a next()
 */
const errorHandler = (err, req, res, next) => {
  console.error('ERROR:', err);

  // Error de Prisma: Recurso no encontrado
  if (err.code === 'P2025') {
    return error(res, 'Recurso no encontrado', 404);
  }

  // Error de Prisma: Violación de constraint 
  if (err.code === 'P2002') {
    const target = err.meta?.target || ['campo'];
    return error(res, `El campo '${target[0]}' ya existe`, 409); // 409 Conflict
  }

  if (err.statusCode) {
    return error(res, err.message, err.statusCode);
  }

  // Error por defecto
  return error(res, 'Error interno del servidor', 500);
};

module.exports = errorHandler;