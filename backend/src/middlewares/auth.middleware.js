const jwt = require('jsonwebtoken');
const { authConfig } = require('../config/auth.config');
const asyncHandler = require('../utils/async-handler');
const { error } = require('../utils/response');

/**
 * Middleware para proteger rutas.
 * Verifica el token JWT y adjunta el usuario a req.user
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Verificar si el token viene en el header 'Authorization'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return error(res, 'No autorizado. Token no proporcionado.', 401);
  }

  // 2. Verificar el token
  let decoded;
  try {
    decoded = jwt.verify(token, authConfig.secret);
  } catch (err) {
    return error(res, 'No autorizado. Token inválido o expirado.', 401);
  }


  req.user = decoded; 

  next();
});

module.exports = { protect };