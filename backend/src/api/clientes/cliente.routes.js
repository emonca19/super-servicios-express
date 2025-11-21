const { Router } = require('express');
const ClientesController = require('./cliente.controller'); 
const v = require('./cliente.validation');
const validate = require('../../middlewares/validate');

const router = Router();

router.post('/', v.createRules, validate, ClientesController.crearCliente.bind(ClientesController));
router.get('/:id', v.idParamRule, validate, ClientesController.obtenerCliente.bind(ClientesController));
router.get('/', ClientesController.listarClientes.bind(ClientesController));
router.put('/:id', v.updateRules, validate, ClientesController.actualizarCliente.bind(ClientesController));
router.delete('/:id', v.idParamRule, validate, ClientesController.eliminarCliente.bind(ClientesController));

module.exports = router;
