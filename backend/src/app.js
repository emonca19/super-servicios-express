// src/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./api/index.routes'); // centralizado
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
app.use(helmet());
app.use(express.json());

// CORS: permitir llamadas desde el servidor de frontend (dev)
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Simple request logger for debugging (prints method, url and small body preview)
// Simple request logger for debugging (prints method, url and small body preview)
app.use((req, res, next) => {
  try {
    const bodyPreview = req.body && Object.keys(req.body).length ? JSON.stringify(req.body).slice(0, 500) : '';
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${bodyPreview}`);
  } catch (e) {
    console.log('Logger error', e && e.message);
  }
  next();
});

// Handler específico para JSON mal formado (body-parser SyntaxError)
// Debe registrarse inmediatamente después de express.json() para interceptar
// errores de parseo y devolver 400 en lugar de 500.
app.use((err, req, res, next) => {
  if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.warn('Bad JSON received:', err.message);
    return res.status(400).json({ ok: false, message: 'JSON inválido en el cuerpo de la petición', detail: err.message });
  }
  return next(err);
});

// Swagger UI (montado antes del router /api para mantener la documentación pública
// incluso si las rutas bajo /api están protegidas por middleware de autenticación)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoint que expone la especificación OpenAPI (útil para pruebas o CI)
app.get('/api/docs.json', (req, res) => {
  res.json(swaggerSpec);
});

// Rutas (aplicadas después de exponer la documentación)
app.use('/api', routes);

// Redirect raíz a la documentación para facilitar el acceso
app.get('/', (req, res) => res.redirect('/api/docs'));

// Health check
app.get('/health', (req, res) => res.json({ ok: true, status: 'healthy' }));

// 404
app.use((req, res) => res.status(404).json({ ok: false, message: 'Not Found' }));

// Error handler (más verboso en desarrollo)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  const isProd = process.env.NODE_ENV === 'production';
  const payload = { ok: false, message: isProd ? 'Error interno' : (err && err.message) || 'Error interno' };
  if (!isProd && err && err.stack) payload.stack = err.stack;
  res.status(500).json(payload);
});

module.exports = app; 
