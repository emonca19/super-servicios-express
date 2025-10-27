const { body, param } = require('express-validator');

const nombre = body('nombre').trim().isString().isLength({min:3, max:80});
const telefono = body('telefono').optional({values:'falsy'}).isString().isLength({max:30});
const email = body('email').optional({values:'falsy'}).isEmail().isLength({max:120});
const direccion = body('direccion').optional({values:'falsy'}).isString().isLength({max:200});

exports.createRules = [nombre, telefono, email, direccion];
exports.updateRules = [param('id').isInt(), nombre.optional({values:'falsy'}), telefono, email, direccion];
exports.idParamRule = [param('id').isInt()];