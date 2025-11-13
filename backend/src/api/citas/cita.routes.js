const { Router } = require('express');
const CitasController = require('./cita.controller');
const v = require('./cita.validation');
const validate = require('../../middlewares/validate');

const router = Router();
const { protect } = require('../../middlewares/auth.middleware');

// Public: crear cita (clientes pueden agendar sin token)
router.post('/', v.createRules, validate, CitasController.crearCita.bind(CitasController));

// Protected: listado y manipulación de citas (administrativo)
router.get('/', protect, CitasController.listarCitas.bind(CitasController));
router.get('/:id', protect, v.idParamRule, validate, CitasController.obtenerCita.bind(CitasController));
router.put('/:id', protect, v.updateRules, validate, CitasController.actualizarCita.bind(CitasController));
router.delete('/:id', protect, v.idParamRule, validate, CitasController.eliminarCita.bind(CitasController));

/**
 * @openapi
 * /citas:
 *   post:
 *     tags:
 *       - Citas
 *     summary: Crear una cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             inicio: '2025-11-20T09:00:00.000Z'
 *             fin: '2025-11-20T10:00:00.000Z'
 *             estado: 'pendiente'
 *             motivo: 'Cambio de aceite'
 *             id_cliente: 1
 *             id_auto: 1
 *     responses:
 *       '201':
 *         description: Creado
 */

/**
 * @openapi
 * /citas:
 *   get:
 *     tags:
 *       - Citas
 *     summary: Listar citas
 *     responses:
 *       '200':
 *         description: Lista
 */

/**
 * @openapi
 * /citas/{id}:
 *   get:
 *     tags:
 *       - Citas
 *     summary: Obtener cita
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

/**
 * @openapi
 * /citas/{id}:
 *   put:
 *     tags:
 *       - Citas
 *     summary: Actualizar cita
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

/**
 * @openapi
 * /citas/{id}:
 *   delete:
 *     tags:
 *       - Citas
 *     summary: Eliminar (soft) cita
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

module.exports = router;
