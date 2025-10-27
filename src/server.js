const express = require('express');
const app = express();

// Middlewares previos
app.use(express.json());

// Rutas base
app.get('/health', (req, res) => res.json({ ok: true, status: 'healthy' }));

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Super Servicios Express API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3001' }],
  },
  apis: ['./src/routes/**/*.js', './src/**/*.js'],
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Tus rutas de negocio
app.use('/api/clientes', require('./routes/clientes.routes'));
app.use('/api/automoviles', require('./routes/automoviles.routes'));
// ...otras rutas

// ------ 404: aquí, al final de las rutas ------
app.use((req, res) => res.status(404).json({ ok: false, message: 'Not Found' }));

// (Opcional) Manejador de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, message: 'Internal Server Error' });
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`API escuchando en puerto ${process.env.PORT || 3000}`)
);
