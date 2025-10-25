const { body, param } = require('express-validator');

// Reglas para POST /clientes
const createClienteValidations = [
  body('nombre')
    .notEmpty().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser texto')
    .trim(),
  body('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El email no es válido')
    .normalizeEmail(),
  body('telefono')
    .optional()
    .isString().withMessage('El teléfono debe ser texto')
    .trim(),
  body('direccion')
    .optional()
    .isString().withMessage('La dirección debe ser texto')
    .trim(),
];

// Reglas para PUT /clientes/:id
const updateClienteValidations = [
  // (Asumo CUID de Prisma, que son strings)
  param('id')
    .isString().withMessage('El ID debe ser un string')
    .trim()
    .notEmpty().withMessage('El ID es requerido'),
  // Validación de Body (opcional)
  body('nombre')
    .optional()
    .isString().withMessage('El nombre debe ser texto')
    .trim(),
  body('email')
    .optional()
    .isEmail().withMessage('El email no es válido')
    .normalizeEmail(),
  body('telefono')
    .optional()
    .isString().withMessage('El teléfono debe ser texto')
    .trim(),
];

// Reglas para GET /clientes/:id y DELETE /clientes/:id
const clienteIdValidations = [
  param('id')
    .isString().withMessage('El ID debe ser un string')
    .trim()
    .notEmpty().withMessage('El ID es requerido'),
];

module.exports = {
  createClienteValidations,
  updateClienteValidations,
  clienteIdValidations,
};