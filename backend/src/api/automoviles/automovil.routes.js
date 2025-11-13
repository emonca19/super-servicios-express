const router = require('express').Router();
const AutomovilesController = require('./automovil.controller');
const v = require('./automovil.validation');
const validate = require('../../middlewares/validate');

/**
 * @openapi
 * /automoviles:
 *   post:
 *     tags:
 *       - Automóviles
 *     summary: Crear un automovil
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             id_cliente: 1
 *             placas: "ABC123"
 *             marca: "Toyota"
 *             modelo: "Corolla"
 *             anio: 2020
 *             numero_serie: "SN123456789"
 *             color: "Blanco"
 *     responses:
 *       '201':
 *         description: Creado
 */
router.post('/', v.createRules, validate, AutomovilesController.crearAutomovil.bind(AutomovilesController));

/**
 * @openapi
 * /automoviles:
 *   get:
 *     tags:
 *       - Automóviles
 *     summary: Listar automóviles
 *     responses:
 *       '200':
 *         description: Lista
 */
router.get('/', AutomovilesController.listarAutomoviles.bind(AutomovilesController));

/**
 * @openapi
 * /automoviles/{id}:
 *   get:
 *     tags:
 *       - Automóviles
 *     summary: Obtener automovil
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Encontrado
 */
router.get('/:id', v.idParamRule, validate, AutomovilesController.obtenerAutomovil.bind(AutomovilesController));

/**
 * @openapi
 * /automoviles/{id}:
 *   put:
 *     tags:
 *       - Automóviles
 *     summary: Actualizar automovil
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Actualizado
 */
router.put('/:id', v.updateRules, validate, AutomovilesController.actualizarAutomovil.bind(AutomovilesController));

/**
 * @openapi
 * /automoviles/{id}:
 *   delete:
 *     tags:
 *       - Automóviles
 *     summary: Eliminar (soft) automovil
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Eliminado
 */
router.delete('/:id', v.idParamRule, validate, AutomovilesController.eliminarAutomovil.bind(AutomovilesController));

module.exports = router;
