const { body, param } = require('express-validator');

// Validate cita schedule: expect `inicio` and `fin` in ISO-8601 format
const inicio = body('inicio').isISO8601().withMessage('inicio debe ser ISO-8601');
const fin = body('fin').isISO8601().withMessage('fin debe ser ISO-8601');
// Allow either id_cliente/id_auto or provide `cliente` / `automovil` objects in the payload.
// Make id_cliente/id_auto optional so controller can create/find records when objects are provided.
const id_cliente = body('id_cliente').optional({nullable: true}).isInt({min:1});
const id_auto = body('id_auto').optional({nullable: true}).isInt({min:1});
const estado = body('estado').optional({values:'falsy'})
  .isIn(['PENDIENTE','CONFIRMADA','CANCELADA','COMPLETADA']);
const notas = body('notas').optional({values:'falsy'}).isString().isLength({max:255});

exports.createRules = [inicio, fin, id_cliente, id_auto, estado, notas];
exports.updateRules = [param('id').isInt(), inicio.optional({values:'falsy'}), fin.optional({values:'falsy'}), id_cliente.optional({values:'falsy'}),
  id_auto.optional({values:'falsy'}), estado, notas];
exports.idParamRule = [param('id').isInt()];