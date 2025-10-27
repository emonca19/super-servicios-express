// src/server.js
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();

// --- Middlewares base ---
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json());

// --- Swagger ---
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Super Servicios Express API', version: '1.0.0' },
    servers: [{ url: process.env.API_PUBLIC_URL || 'http://localhost:3001' }],
  },
  // incluye todo src (rutas + controladores con @openapi)
  apis: ['./src/**/*.js'],
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Healthcheck ---
app.get('/health', (_req, res) => res.json({ ok: true }));

// --- Rutas de negocio ---
// Clientes
const clientesRoutes = require('./routes/clientes.routes');
app.use('/api/clientes', clientesRoutes);

// Automóviles
const automovilesRoutes = require('./api/automoviles/automovil.routes');
app.use('/api/automoviles', automovilesRoutes);

// Servicios
try {
  const serviciosRoutes = require('./api/servicios/servicio.routes');
  app.use('/api/servicios', serviciosRoutes);
} catch (_) {
  // si aún no existe, no truena el server; quita este try/catch cuando crees la ruta
}

// Citas
try {
  const citasRoutes = require('./api/citas/cita.routes');
  app.use('/api/citas', citasRoutes);
} catch (_) {}

// DetalleCita
try {
  const detalleCitaRoutes = require('./api/detalle-citas/detalleCita.routes');
  app.use('/api/detalle-citas', detalleCitaRoutes);
} catch (_) {}

// --- 404 ---
app.use((req, res) => res.status(404).json({ ok: false, message: 'Not Found' }));

// --- Manejo de errores ---
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  const code = err.status || err.statusCode || 500;
  res.status(code).json({ ok: false, message: err.message || 'Internal Server Error' });
});
/* eslint-enable no-unused-vars */

// --- Inicio de servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));

module.exports = app;
