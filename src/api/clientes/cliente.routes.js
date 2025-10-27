const { Router } = require('express');
const {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
} = require('./cliente.controller');
const { handleValidationErrors } = require('../../middlewares/validator');
const {
  createClienteValidations,
  updateClienteValidations,
  clienteIdValidations,
} = require('./cliente.validation');
const { protect } = require('../../middlewares/auth.middleware');

const router = Router();

router.use(protect);

/**
 * @swagger
 * /clientes:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Listar todos los clientes
 *     description: Obtiene la lista completa de clientes registrados
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cliente'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags:
 *       - Clientes
 *     summary: Crear un nuevo cliente
 *     description: Registra un nuevo cliente en el sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: No autorizado
 *       409:
 *         description: El email ya existe
 */
router
  .route('/')
  .get(getAllClientes)
  .post(
    createClienteValidations,
    handleValidationErrors,
    createCliente
  );

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Obtener cliente por ID
 *     description: Obtiene los detalles de un cliente específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *   put:
 *     tags:
 *       - Clientes
 *     summary: Actualizar cliente
 *     description: Actualiza los datos de un cliente existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Cliente no encontrado
 *       401:
 *         description: No autorizado
 *   delete:
 *     tags:
 *       - Clientes
 *     summary: Eliminar cliente
 *     description: Elimina un cliente del sistema
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       204:
 *         description: Cliente eliminado exitosamente
 *       404:
 *         description: Cliente no encontrado
 *       401:
 *         description: No autorizado
 */
router
  .route('/:id')
  .get(
    clienteIdValidations,
    handleValidationErrors,
    getClienteById
  )
  .put(
    updateClienteValidations,
    handleValidationErrors,
    updateCliente
  )
  .delete(
    clienteIdValidations,
    handleValidationErrors,
    deleteCliente
  );

module.exports = router;