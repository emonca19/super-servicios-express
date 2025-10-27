const router = require('express').Router();
const servicioCitaController = require('./servicioCita.controller');
const v = require('./servicioCita.validation');
const validate = require('../../middlewares/validate');

router.post('/', v.createRules, validate, servicioCitaController.crearServicioCita.bind(servicioCitaController));
router.get('/:id', v.idParamRule, validate, servicioCitaController.obtenerServicioCita.bind(servicioCitaController));
router.put('/:id', v.updateRules, validate, servicioCitaController.actualizarServicioCita.bind(servicioCitaController));
router.delete('/:id', v.idParamRule, validate, servicioCitaController.eliminarServicioCita.bind(servicioCitaController));
router.get('/', servicioCitaController.listarServiciosCita.bind(servicioCitaController));

module.exports = router;