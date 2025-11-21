
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./api/index.routes'); 
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
app.use(helmet());
app.use(express.json());

const path = require('path');
const fs = require('fs');
try {
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  app.use('/uploads', (req, res, next) => {
    try {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      if (req.method === 'OPTIONS') return res.status(204).end();
    } catch (e) {}
    return next();
  }, express.static(uploadsDir));
} catch (e) {
  console.warn('[app] Could not configure uploads static dir', e && e.message);
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    try {
      const u = new URL(origin);
      if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') return callback(null, true);
    } catch (e) {
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  try {
    const bodyPreview = req.body && Object.keys(req.body).length ? JSON.stringify(req.body).slice(0, 500) : '';
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${bodyPreview}`);
  } catch (e) {
    console.log('Logger error', e && e.message);
  }
  next();
});


app.use((err, req, res, next) => {
  if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.warn('Bad JSON received:', err.message);
    return res.status(400).json({ ok: false, message: 'JSON inválido en el cuerpo de la petición', detail: err.message });
  }
  return next(err);
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/docs.json', (req, res) => {
  res.json(swaggerSpec);
});

app.use('/api', routes);

app.get('/uploads-debug', (req, res) => {
  try {
    const servicesDir = path.join(__dirname, '..', 'public', 'uploads', 'services');
    let files = [];
    try { files = fs.readdirSync(servicesDir); } catch (e) { /* ignore */ }
    return res.json({ ok: true, path: servicesDir, files });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  }
});

app.get('/', (req, res) => res.redirect('/api/docs'));

app.get('/health', (req, res) => res.json({ ok: true, status: 'healthy' }));

app.use((req, res) => res.status(404).json({ ok: false, message: 'Not Found' }));

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  const isProd = process.env.NODE_ENV === 'production';
  const payload = { ok: false, message: isProd ? 'Error interno' : (err && err.message) || 'Error interno' };
  if (!isProd && err && err.stack) payload.stack = err.stack;
  res.status(500).json(payload);
});

module.exports = app; 
