const router = require('express').Router();
const servicioController = require('./servicio.controller');
const v = require('./servicio.validation');
const validate = require('../../middlewares/validate');

router.post('/', v.createRules, validate, servicioController.crearServicio.bind(servicioController));
router.get('/:id', v.idParamRule, validate, servicioController.obtenerServicio.bind(servicioController));
router.put('/:id', v.updateRules, validate, servicioController.actualizarServicio.bind(servicioController));
router.delete('/:id', v.idParamRule, validate, servicioController.eliminarServicio.bind(servicioController));
router.get('/', servicioController.listarServicios.bind(servicioController));

module.exports = router;
