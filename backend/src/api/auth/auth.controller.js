const jwt = require('jsonwebtoken');
const { authConfig } = require('../../config/auth.config');
const asyncHandler = require('../../utils/async-handler');
const { success, error } = require('../../utils/response');
const prisma = require('../../prisma');
const bcrypt = require('bcryptjs');

// Backwards-compat admin fallback (kept for tests). Prefer DB-based auth.
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

  // Try DB first
  const cliente = await prisma.cliente.findUnique({ where: { email } });
  if (cliente && cliente.password) {
    const match = await bcrypt.compare(password, cliente.password);
    if (!match) return error(res, 'Credenciales inválidas', 401);
    const payload = { id: cliente.id_cliente };
    const token = jwt.sign(payload, authConfig.secret, { expiresIn: authConfig.expiresIn });
    return success(res, { token }, 200);
  }

  // Fallback to simple test account
  if (email === simpleAuthDB.email && password === simpleAuthDB.password) {
    const payload = { id: simpleAuthDB.id };
    const token = jwt.sign(payload, authConfig.secret, { expiresIn: authConfig.expiresIn });
    return success(res, { token }, 200);
  }

  return error(res, 'Credenciales inválidas', 401);
});

module.exports = {
  login,
};