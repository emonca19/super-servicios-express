const jwt = require('jsonwebtoken');
const { authConfig } = require('../../config/auth.config');
const asyncHandler = require('../../utils/async-handler');
const { success, error } = require('../../utils/response');

const simpleAuthDB = {
  email: 'admin@taller.com',
  password: 'admin123',
  id: 'cl_admin_001',
};

/**
 * @desc    Autenticar un usuario y devolver un token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return error(res, 'Email y contraseña son requeridos', 400);
  }

  const user = (email === simpleAuthDB.email);
  if (!user) {
    return error(res, 'Credenciales inválidas', 401);
  }

  const isMatch = (password === simpleAuthDB.password);
  if (!isMatch) {
    return error(res, 'Credenciales inválidas', 401);
  }

  const payload = {
    id: simpleAuthDB.id,
  };

  const token = jwt.sign(payload, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
  });

  success(res, { token }, 200);
});

module.exports = {
  login,
};