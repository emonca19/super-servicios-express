// src/routes/clientes.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/clientes.controller');

router.post('/', ctrl.crearCliente);
router.get('/', ctrl.listarClientes);
router.get('/:id', ctrl.obtenerCliente);
router.put('/:id', ctrl.actualizarCliente);
router.delete('/:id', ctrl.eliminarCliente);

module.exports = router;
