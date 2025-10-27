// src/controllers/clientes.controller.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function crearCliente(req, res, next) {
  try {
    const { nombre, telefono, email, direccion } = req.body;
    const data = await prisma.cliente.create({
      data: { nombre, telefono, email, direccion },
    });
    res.set('Location', `/api/clientes/${data.id_cliente}`);
    return res.status(201).json({ ok: true, data });
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({ ok: false, message: 'Email ya registrado' });
    }
    next(e);
  }
}

async function listarClientes(_req, res, next) {
  try {
    const data = await prisma.cliente.findMany();
    return res.json({ ok: true, data });
  } catch (e) { next(e); }
}

async function obtenerCliente(req, res, next) {
  try {
    const id = Number(req.params.id);
    const data = await prisma.cliente.findUnique({ where: { id_cliente: id } });
    if (!data) return res.status(404).json({ ok: false, message: 'Cliente no encontrado' });
    return res.json({ ok: true, data });
  } catch (e) { next(e); }
}

async function actualizarCliente(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { nombre, telefono, email, direccion } = req.body;
    const data = await prisma.cliente.update({
      where: { id_cliente: id },
      data: { nombre, telefono, email, direccion },
    });
    return res.json({ ok: true, data });
  } catch (e) { next(e); }
}

async function eliminarCliente(req, res, next) {
  try {
    const id = Number(req.params.id);
    await prisma.cliente.delete({ where: { id_cliente: id } });
    return res.status(204).send();
  } catch (e) { next(e); }
}

module.exports = {
  crearCliente,
  listarClientes,
  obtenerCliente,
  actualizarCliente,
  eliminarCliente,
};
