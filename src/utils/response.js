/**
 * Envía una respuesta de éxito
 * @param {import('express').Response} res - Objeto de respuesta
 * @param {any} data - Datos a enviar
 * @param {number} statusCode - Código de estado HTTP (default: 200)
 */
const success = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    status: 'success',
    data: data,
  });
};

/**
 * Envía una respuesta de error
 * @param {import('express').Response} res - Objeto de respuesta
 * @param {string} message - Mensaje de error
 * @param {number} statusCode - Código de estado HTTP (default: 500)
 */
const error = (res, message, statusCode = 500) => {
  res.status(statusCode).json({
    status: 'error',
    message: message,
  });
};

module.exports = { success, error };