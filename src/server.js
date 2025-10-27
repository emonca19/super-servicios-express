// src/server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
app.use(helmet());
app.use(express.json());

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Super Servicios Express API', version: '1.0.0' },
    servers: [{ url: process.env.API_PUBLIC_URL || 'http://localhost:3001' }],
  },
  apis: ['./src/routes/**/*.js', './src/**/*.js'],
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const clientesRoutes = require('./routes/clientes.routes');
app.use('/api/clientes', clientesRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use((req, res) => res.status(404).json({ ok: false, message: 'Not Found' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(500).json({ ok: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));

module.exports = app;
