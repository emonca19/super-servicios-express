// src/controllers/clientes.controller.js
const prisma = require('../../prisma');

class ClientesController {
  constructor() {
    this.prisma = prisma; 
  }

  async crearCliente(req, res, next) {
    try {
      const { nombre, telefono, email, direccion } = req.body;
      const cliente = await this.prisma.cliente.create({
        data: { nombre, telefono, email, direccion },
      });
      res.status(201).json({ ok: true, data: cliente });
    } catch (e) {
      if (e.code === 'P2002') {
        return res.status(409).json({ ok: false, message: 'Email ya registrado' });
      }
      next(e);
    }
  }

  async listarClientes(req, res, next) {
    try {
      const clientes = await this.prisma.cliente.findMany();
      res.json({ ok: true, data: clientes });
    } catch (e) {
      next(e);
    }
  }

  async obtenerCliente(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const cliente = await this.prisma.cliente.findUnique({ where: { id_cliente: id } });
      if (!cliente) return res.status(404).json({ ok: false, message: 'No encontrado' });
      res.json({ ok: true, data: cliente });
    } catch (e) {
      next(e);
    }
  }

  async actualizarCliente(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const cliente = await this.prisma.cliente.update({
        where: { id_cliente: id },
        data: req.body,
      });
      res.json({ ok: true, data: cliente });
    } catch (e) {
      next(e);
    }
  }

  async eliminarCliente(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      await this.prisma.cliente.delete({ where: { id_cliente: id } });
      res.json({ ok: true, message: 'Eliminado' });
    } catch (e) {
      next(e);
    }
  }
}


module.exports = new ClientesController();
