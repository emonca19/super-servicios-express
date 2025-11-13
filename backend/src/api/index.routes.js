const { Router } = require('express');
const AuthRoutes = require('./auth/auth.routes');
const ClienteRoutes = require('./clientes/cliente.routes');
const AutomovilRoutes = require('./automoviles/automovil.routes');
const CitaRoutes = require('./citas/cita.routes');
const ServicioRoutes = require('./servicios/servicio.routes');
const ServicioCitaRoutes = require('./servicio-cita/servicioCita.routes');

const { protect } = require('../middlewares/auth.middleware');

const router = Router();

// ===== RUTAS PÚBLICAS (sin autenticación) =====
// Se montan aquí las rutas que deben ser accesibles sin token.
// Si algún endpoint dentro de estos routers necesita protección, puede
// aplicar el middleware `protect` directamente en ese archivo de rutas.
router.use('/auth', AuthRoutes);
router.use('/servicios', ServicioRoutes);
router.use('/citas', CitaRoutes);
router.use('/servicio-cita', ServicioCitaRoutes);

// ===== RUTAS PROTEGIDAS (requieren autenticación) =====
// Aplicamos el middleware `protect` a partir de aqui para que todas las
// rutas montadas después requieran un token válido.
router.use(protect);

router.use('/clientes', ClienteRoutes);
router.use('/automoviles', AutomovilRoutes);

module.exports = router;
