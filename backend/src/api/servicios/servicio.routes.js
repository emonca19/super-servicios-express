const router = require('express').Router();
const ServicioController = require('./servicio.controller');
const v = require('./servicio.validation');
const validate = require('../../middlewares/validate');
const { protect } = require('../../middlewares/auth.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', '..', '..', 'public', 'uploads', 'services');
try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (e) {}
console.log('[servicio.routes] uploads folder:', uploadDir);
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname) || '';
		const name = `${Date.now()}-${Math.round(Math.random()*1e6)}${ext}`;
		cb(null, name);
	}
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

/**
 * @openapi
 * /servicios:
 *   post:
 *     tags:
 *       - Servicios
 *     summary: Crear servicio (acepta imagen)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               duracion_estimada:
 *                 type: integer
 *               precio_con_utilidad:
 *                 type: number
 *                 format: double
 *               imagen:
 *                 type: string
 *                 format: binary
 *           encoding:
 *             imagen:
 *               contentType: image/*
 *           example:
 *             nombre: "Cambio de aceite"
 *             descripcion: "Cambio de aceite y filtro"
 *             duracion_estimada: 60
 *             precio_con_utilidad: 150.00
 *             imagen: "/uploads/services/ejemplo.jpg"
 *     responses:
 *       '201':
 *         description: Creado
 */
router.post('/', protect, upload.single('imagen'), v.createRules, validate, ServicioController.crearServicio.bind(ServicioController));

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
 *     summary: Actualizar servicio (acepta imagen)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               duracion_estimada:
 *                 type: integer
 *               precio_con_utilidad:
 *                 type: number
 *                 format: double
 *               imagen:
 *                 type: string
 *                 format: binary
 *           encoding:
 *             imagen:
 *               contentType: image/*
 *     responses:
 *       '200':
 *         description: Actualizado
 */
router.put('/:id', protect, upload.single('imagen'), v.updateRules, validate, ServicioController.actualizarServicio.bind(ServicioController));

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
