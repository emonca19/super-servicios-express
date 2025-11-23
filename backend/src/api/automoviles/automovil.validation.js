const { body, param } = require('express-validator');

const marca = body('marca').isString().isLength({min:2, max:50});
const modelo = body('modelo').isString().isLength({min:1, max:60});
const anio = body('anio').isInt({ min:1900, max:2100 });
const color = body('color').isString().isLength({max:30});
const placas = body('placas').isString().isLength({min:3, max:30});
const numero_serie = body('numero_serie').isString().isLength({max:50});
const id_cliente = body('id_cliente').isInt({min:1});

exports.createRules = [marca, modelo, anio, color, placas, numero_serie, id_cliente];
exports.updateRules = [param('id').isInt(), marca.optional({values:'falsy'}), modelo.optional({values:'falsy'}),
  anio.optional({values:'falsy'}), color.optional({values:'falsy'}), placas.optional({values:'falsy'}),
  numero_serie.optional({values:'falsy'}), id_cliente.optional({values:'falsy'})];
exports.idParamRule = [param('id').isInt()];