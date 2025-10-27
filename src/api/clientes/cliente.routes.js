// src/routes/clientes.routes.js
const { Router } = require('express');
const ctrl = require('../controllers/clientes.controller');

const router = Router();

/**
 * @openapi
 * /api/clientes:
 *   post:
 *     summary: Crear cliente
 *     tags: [Clientes]
 */
router.post('/', ctrl.create);

/**
 * @openapi
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtener cliente por id
 *     tags: [Clientes]
 */
router.get('/:id', ctrl.getById);

router.get('/', ctrl.list);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
