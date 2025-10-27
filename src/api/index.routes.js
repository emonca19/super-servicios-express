const { Router } = require('express');
const AuthRoutes = require('./auth/auth.routes');
const ClienteRoutes = require('./clientes/cliente.routes');
const AutomovilRoutes = require('./automoviles/automovil.routes');
const CitaRoutes = require('./citas/cita.routes');
const ServicioRoutes = require('./servicios/servicio.routes');
const ServicioCitaRoutes = require('./servicio-cita/servicioCita.routes');

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/clientes', ClienteRoutes);
router.use('/automoviles', AutomovilRoutes);
router.use('/citas', CitaRoutes);
router.use('/servicios', ServicioRoutes);
router.use('/servicio-cita', ServicioCitaRoutes);

module.exports = router;
