const { validationResult } = require('express-validator');

/**
 * Middleware que procesa los resultados de express-validator.
 * Debe usarse después de las cadenas de validación en las rutas.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Formateamos los errores para que sean más legibles
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Error de validación',
      errors: formattedErrors,
    });
  }

  // Si no hay errores, continuamos
  next();
};

module.exports = { handleValidationErrors };