const { body, param } = require('express-validator');

const nombre = body('nombre').trim().isString().isLength({min:3, max:60});
const descripcion = body('descripcion').optional({values:'falsy'}).isString().isLength({max:255});
const precio_base = body('precio_base').optional({values:'falsy'}).isFloat({ min:0 });
const activo = body('activo').optional({values:'falsy'}).isBoolean();

exports.createRules = [nombre, descripcion, precio_base, activo];
exports.updateRules = [param('id').isInt(), nombre.optional({values:'falsy'}), descripcion, precio_base, activo];
exports.idParamRule = [param('id').isInt()];