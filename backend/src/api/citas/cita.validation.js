const { body, param } = require('express-validator');

const fecha = body('fecha').isISO8601().withMessage('fecha debe ser ISO-8601');
const id_cliente = body('id_cliente').isInt({min:1});
const id_auto = body('id_auto').isInt({min:1});
const estado = body('estado').optional({values:'falsy'})
  .isIn(['PENDIENTE','CONFIRMADA','CANCELADA','COMPLETADA']);
const notas = body('notas').optional({values:'falsy'}).isString().isLength({max:255});

exports.createRules = [fecha, id_cliente, id_auto, estado, notas];
exports.updateRules = [param('id').isInt(), fecha.optional({values:'falsy'}), id_cliente.optional({values:'falsy'}),
  id_auto.optional({values:'falsy'}), estado, notas];
exports.idParamRule = [param('id').isInt()];