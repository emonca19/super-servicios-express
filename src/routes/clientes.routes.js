const { Router } = require('express');
const ctrl = require('../controllers/clientes.controller');
const validate = require('../middlewares/validate.middleware');
const { crearClienteSchema, actualizarClienteSchema } = require('../validators/clientes.schemas');

const r = Router();
r.get('/', ctrl.listar);
r.get('/:id', ctrl.obtenerPorId);
r.post('/', validate(crearClienteSchema), ctrl.crear);
r.patch('/:id', validate(actualizarClienteSchema), ctrl.actualizar);
r.delete('/:id', ctrl.eliminar);
module.exports = r;
