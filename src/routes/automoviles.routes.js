const { Router } = require('express');
const ctrl = require('../controllers/automoviles.controller');
const validate = require('../middlewares/validate.middleware');
const { crearAutoSchema, actualizarAutoSchema } = require('../validators/automoviles.schemas');

const r = Router();
r.get('/', ctrl.listar);
r.get('/:id', ctrl.obtenerPorId);
r.post('/', validate(crearAutoSchema), ctrl.crear);
r.patch('/:id', validate(actualizarAutoSchema), ctrl.actualizar);
r.delete('/:id', ctrl.eliminar);
module.exports = r;
