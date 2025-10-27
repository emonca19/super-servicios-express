const router = require('express').Router();
const ctrl = require('./automovil.controller');
const v = require('./automovil.validation');
const validate = require('../../middlewares/validate');

router.post('/', v.createRules, validate, ctrl.create);
router.get('/:id', v.idParamRule, validate, ctrl.getById);
router.put('/:id', v.updateRules, validate, ctrl.update);
router.delete('/:id', v.idParamRule, validate, ctrl.remove);
router.get('/', ctrl.list);

module.exports = router;