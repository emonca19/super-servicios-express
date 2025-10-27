const { Router } = require('express');
const AuthRoutes = require('./auth/auth.routes');
const ClienteRoutes = require('./clientes/cliente.routes');

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/clientes', ClienteRoutes);

module.exports = router;