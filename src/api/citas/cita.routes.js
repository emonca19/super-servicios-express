const { Router } = require('express');
const CitasController = require('./cita.controller');
const v = require('./cita.validation');
const validate = require('../../middlewares/validate');

const router = Router();

router.post('/', v.createRules, validate, CitasController.crearCita.bind(CitasController));
router.get('/', CitasController.listarCitas.bind(CitasController));
router.get('/:id', v.idParamRule, validate, CitasController.obtenerCita.bind(CitasController));
router.put('/:id', v.updateRules, validate, CitasController.actualizarCita.bind(CitasController));
router.delete('/:id', v.idParamRule, validate, CitasController.eliminarCita.bind(CitasController));

module.exports = router;
