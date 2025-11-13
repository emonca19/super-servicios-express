const { body, param } = require('express-validator');

const id_cita = body('id_cita').isInt({min:1});
const id_servicio = body('id_servicio').isInt({min:1});
const precio_por_servicio = body('precio_por_servicio').isFloat({ min:0 });
const notas = body('notas').optional({values:'falsy'}).isString().isLength({max:255});

exports.createRules = [id_cita, id_servicio, precio_por_servicio, notas];
exports.updateRules = [param('id').isInt(), id_cita.optional({values:'falsy'}),
  id_servicio.optional({values:'falsy'}), precio_por_servicio.optional({values:'falsy'}), notas];
exports.idParamRule = [param('id').isInt()];