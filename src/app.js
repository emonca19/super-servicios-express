// src/app.js
const express = require('express');
const helmet = require('helmet');
const routes = require('./api/index.routes'); // centralizado

const app = express();
app.use(helmet());
app.use(express.json());

// Rutas
app.use('/api', routes);


// Health check
app.get('/health', (req, res) => res.json({ ok: true, status: 'healthy' }));

// 404
app.use((req, res) => res.status(404).json({ ok: false, message: 'Not Found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, message: 'Error interno' });
});

module.exports = app; 
