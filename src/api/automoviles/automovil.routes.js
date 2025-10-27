const router = require('express').Router();
const AutomovilesController = require('./automovil.controller');
const v = require('./automovil.validation');
const validate = require('../../middlewares/validate');

router.post('/', v.createRules, validate, AutomovilesController.crearAutomovil.bind(AutomovilesController));
router.get('/:id', v.idParamRule, validate, AutomovilesController.obtenerAutomovil.bind(AutomovilesController));
router.put('/:id', v.updateRules, validate, AutomovilesController.actualizarAutomovil.bind(AutomovilesController));
router.delete('/:id', v.idParamRule, validate, AutomovilesController.eliminarAutomovil.bind(AutomovilesController));
router.get('/', AutomovilesController.listarAutomoviles.bind(AutomovilesController));

module.exports = router;
