const router = require('express').Router();
const ServicioController = require('./servicio.controller');
const v = require('./servicio.validation');
const validate = require('../../middlewares/validate');
const { protect } = require('../../middlewares/auth.middleware');

/**
 * @openapi
 * /servicios:
 *   post:
 *     tags:
 *       - Servicios
 *     summary: Crear servicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             nombre: "Cambio de aceite"
 *             descripcion: "Cambio de aceite y filtro"
 *             duracion_estimada: 60
 *             precio_con_utilidad: 150.00
 *     responses:
 *       '201':
 *         description: Creado
 */
router.post('/', protect, v.createRules, validate, ServicioController.crearServicio.bind(ServicioController));

/**
 * @openapi
 * /servicios:
 *   get:
 *     tags:
 *       - Servicios
 *     summary: Listar servicios
 *     responses:
 *       '200':
 *         description: Lista
 */
router.get('/', ServicioController.listarServicios.bind(ServicioController));

/**
 * @openapi
 * /servicios/{id}:
 *   get:
 *     tags:
 *       - Servicios
 *     summary: Obtener servicio
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
router.get('/:id', protect, v.idParamRule, validate, ServicioController.obtenerServicio.bind(ServicioController));

/**
 * @openapi
 * /servicios/{id}:
 *   put:
 *     tags:
 *       - Servicios
 *     summary: Actualizar servicio
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
router.put('/:id', protect, v.updateRules, validate, ServicioController.actualizarServicio.bind(ServicioController));

/**
 * @openapi
 * /servicios/{id}:
 *   delete:
 *     tags:
 *       - Servicios
 *     summary: Eliminar servicio
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
router.delete('/:id', protect, v.idParamRule, validate, ServicioController.eliminarServicio.bind(ServicioController));

module.exports = router;
