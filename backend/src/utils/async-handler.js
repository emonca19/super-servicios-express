/**
 * Wrapper para controladores asíncronos que captura errores
 * y los pasa al middleware de errores (usando next).
 * @param {Function} fn - El controlador asíncrono
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;