// src/controllers/clientes.controller.js

async function crearCliente(req, res) {
  // TODO: integra Prisma aquí
  return res.json({ ok: true, action: 'crearCliente', body: req.body || {} });
}
async function listarClientes(req, res) {
  // TODO: integra Prisma aquí
  return res.json({ ok: true, action: 'listarClientes', data: [] });
}
async function obtenerCliente(req, res) {
  // TODO: integra Prisma aquí
  return res.json({ ok: true, action: 'obtenerCliente', id: req.params.id });
}
async function actualizarCliente(req, res) {
  // TODO: integra Prisma aquí
  return res.json({ ok: true, action: 'actualizarCliente', id: req.params.id, body: req.body || {} });
}
async function eliminarCliente(req, res) {
  // TODO: integra Prisma aquí
  return res.json({ ok: true, action: 'eliminarCliente', id: req.params.id });
}

module.exports = {
  crearCliente,
  listarClientes,
  obtenerCliente,
  actualizarCliente,
  eliminarCliente,
};
