// src/server.js
require('dotenv').config();
const app = require('./app');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 3000;

// Swagger
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Super Servicios Express API', version: '1.0.0' },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./src/routes/**/*.js', './src/**/*.js'],
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Levantar servidor
app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});
