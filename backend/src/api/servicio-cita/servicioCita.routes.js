const router = require('express').Router();
const ServicioCitaController = require('./servicioCita.controller');
const v = require('./servicioCita.validation');
const validate = require('../../middlewares/validate');
const { protect } = require('../../middlewares/auth.middleware');

/**
 * @openapi
 * /servicio-cita:
 *   post:
 *     tags:
 *       - Servicio-Cita
 *     summary: Asignar servicio a una cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             id_cita: 1
 *             id_servicio: 1
 *             precio_por_servicio: 100.00
 *             notas: 'Revisar frenos'
 *     responses:
 *       '201':
 *         description: Creado
 */
// Public: asignar servicio a una cita (permitir creación desde cliente)
router.post('/', v.createRules, validate, ServicioCitaController.crearServicioCita.bind(ServicioCitaController));

/**
 * @openapi
 * /servicio-cita:
 *   get:
 *     tags:
 *       - Servicio-Cita
 *     summary: Listar servicios por cita
 *     responses:
 *       '200':
 *         description: Lista
 */
// Protected: listado y gestión de asignaciones (administrativo)
router.get('/', protect, ServicioCitaController.listarServiciosCita.bind(ServicioCitaController));

/**
 * @openapi
 * /servicio-cita/{id}:
 *   get:
 *     tags:
 *       - Servicio-Cita
 *     summary: Obtener servicio asignado por id
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
router.get('/:id', protect, v.idParamRule, validate, ServicioCitaController.obtenerServicioCita.bind(ServicioCitaController));

/**
 * @openapi
 * /servicio-cita/{id}:
 *   put:
 *     tags:
 *       - Servicio-Cita
 *     summary: Actualizar servicio asignado
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
router.put('/:id', protect, v.updateRules, validate, ServicioCitaController.actualizarServicioCita.bind(ServicioCitaController));

/**
 * @openapi
 * /servicio-cita/{id}:
 *   delete:
 *     tags:
 *       - Servicio-Cita
 *     summary: Eliminar asignación de servicio
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
router.delete('/:id', protect, v.idParamRule, validate, ServicioCitaController.eliminarServicioCita.bind(ServicioCitaController));

module.exports = router;