const { Router } = require('express');
const ClientesController = require('./cliente.controller'); 
const v = require('./cliente.validation');
const validate = require('../../middlewares/validate');

const router = Router();

/**
 * @openapi
 * /clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags:
 *       - Clientes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
							example:
								nombre: 'Juan Pérez'
								email: 'juan.perez@mail.com'
								telefono: '6441234567'
 *     responses:
 *       '201':
 *         description: Cliente creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 */
router.post('/', v.createRules, validate, ClientesController.crearCliente.bind(ClientesController));

/**
 * @openapi
 * /clientes:
 *   get:
 *     summary: Listar clientes activos
 *     tags:
 *       - Clientes
 *     responses:
 *       '200':
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cliente'
 */
router.get('/', ClientesController.listarClientes.bind(ClientesController));

/**
 * @openapi
 * /clientes/{id}:
 *   get:
 *     summary: Obtener datos de un cliente por id
 *     tags:
 *       - Clientes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 *       '404':
 *         description: No encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', v.idParamRule, validate, ClientesController.obtenerCliente.bind(ClientesController));

/**
 * @openapi
 * /clientes/{id}:
 *   put:
 *     summary: Actualizar un cliente
 *     tags:
 *       - Clientes
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
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       '200':
 *         description: Cliente actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 */
router.put('/:id', v.updateRules, validate, ClientesController.actualizarCliente.bind(ClientesController));

/**
 * @openapi
 * /clientes/{id}:
 *   delete:
 *     summary: Desactivar (soft-delete) un cliente
 *     tags:
 *       - Clientes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Cliente desactivado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Cliente'
 */
router.delete('/:id', v.idParamRule, validate, ClientesController.eliminarCliente.bind(ClientesController));

module.exports = router;
