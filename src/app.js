require('dotenv').config();
const express = require('express');
const helmet = require('helmet');

const clienteRoutes = require('./api/clientes/cliente.routes');
const autoRoutes = require('./api/automoviles/automovil.routes');
const servicioRoutes = require('./api/servicios/servicio.routes');
const citaRoutes = require('./api/citas/cita.routes');
const servicioCitaRoutes = require('./api/servicio-cita/servicioCita.routes');

const app = express();
app.use(helmet());
app.use(express.json());

app.get('/health', (req,res)=> res.json({ ok:true, status:'healthy' }));

app.use('/api/clientes', clienteRoutes);
app.use('/api/automoviles', autoRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/servicio-cita', servicioCitaRoutes);

// 404
app.use((req, res) => res.status(404).json({ ok:false, message:'Not Found' }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ ok:false, message:'Error interno' });
});

module.exports = app;