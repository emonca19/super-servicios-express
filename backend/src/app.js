const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./api/index.routes'); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const path = require('path');

const app = express();
const isDev = process.env.NODE_ENV !== 'production';

// ===== SEGURIDAD =====
app.use(helmet());
app.use(express.json());

// ===== CORS =====
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    try {
      const u = new URL(origin);
      if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
        return callback(null, true);
      }
    } catch (e) {}
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
app.use('/uploads', express.static(uploadsDir));

// ===== LOGGER=====
if (isDev) {
  app.use((req, res, next) => {
    const bodyPreview = req.body && Object.keys(req.body).length 
      ? JSON.stringify(req.body).slice(0, 200) : '';
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${bodyPreview}`);
    next();
  });
}

// ===== SWAGGER =====
if (isDev) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));
  app.get('/', (req, res) => res.redirect('/api/docs'));
}

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => res.json({ ok: true, status: 'healthy' }));

// ===== RUTAS PRINCIPALES =====
app.use('/api', routes);

// ===== ERROR HANDLERS =====
// 404
app.use((req, res) => {
  res.status(404).json({ ok: false, message: 'Not Found' });
});

// 500 - Error handler global
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err?.stack || err);
  
  const payload = { 
    ok: false, 
    message: isDev ? (err?.message || 'Error interno') : 'Error interno'
  };
  
  if (isDev && err?.stack) payload.stack = err.stack;
  
  res.status(err?.status || 500).json(payload);
});

module.exports = app;