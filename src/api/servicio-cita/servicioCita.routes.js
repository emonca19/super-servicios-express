const router = require('express').Router();
const ctrl = require('./servicioCita.controller');
const v = require('./servicioCita.validation');
const validate = require('../../middlewares/validate');

router.post('/', v.createRules, validate, ctrl.create);
router.get('/:id', v.idParamRule, validate, ctrl.getById);
router.put('/:id', v.updateRules, validate, ctrl.update);
router.delete('/:id', v.idParamRule, validate, ctrl.remove);
router.get('/', ctrl.list);

module.exports = router;