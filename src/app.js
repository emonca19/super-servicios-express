const express = require('express');
// Only load .env if DATABASE_URL is not already set (Docker sets it)
if (!process.env.DATABASE_URL) {
  require('dotenv').config();
}
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const centralRouter = require('./api/index.routes');
const errorHandler = require('./middlewares/error-handler');
const { error } = require('./utils/response');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Super Servicios Express - API Docs',
}));

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api/v1', centralRouter);

app.use((req, res, next) => {
  error(res, 'Ruta no encontrada', 404);
});

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Documentación API en http://localhost:${port}/api-docs`);
});

module.exports = app;