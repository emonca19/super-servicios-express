const router = require('express').Router();
const ServicioCitaController = require('./servicioCita.controller');
const v = require('./servicioCita.validation');
const validate = require('../../middlewares/validate');

router.post('/', v.createRules, validate, ServicioCitaController.crearServicioCita.bind(ServicioCitaController));
router.get('/:id', v.idParamRule, validate, ServicioCitaController.obtenerServicioCita.bind(ServicioCitaController));
router.put('/:id', v.updateRules, validate, ServicioCitaController.actualizarServicioCita.bind(ServicioCitaController));
router.delete('/:id', v.idParamRule, validate, ServicioCitaController.eliminarServicioCita.bind(ServicioCitaController));
router.get('/', ServicioCitaController.listarServiciosCita.bind(ServicioCitaController));

module.exports = router;