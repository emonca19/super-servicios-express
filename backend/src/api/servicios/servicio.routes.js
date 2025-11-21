const router = require('express').Router();
const ServicioController = require('./servicio.controller');
const v = require('./servicio.validation');
const validate = require('../../middlewares/validate');

router.post('/', v.createRules, validate, ServicioController.crearServicio.bind(ServicioController));
router.get('/:id', v.idParamRule, validate, ServicioController.obtenerServicio.bind(ServicioController));
router.put('/:id', v.updateRules, validate, ServicioController.actualizarServicio.bind(ServicioController));
router.delete('/:id', v.idParamRule, validate, ServicioController.eliminarServicio.bind(ServicioController));
router.get('/', ServicioController.listarServicios.bind(ServicioController));

module.exports = router;
