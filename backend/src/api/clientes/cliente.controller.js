const prisma = require('../../prisma');
const bcrypt = require('bcryptjs');

class ClientesController {
  constructor() {
    this.prisma = prisma; 
  }

  async crearCliente(req, res, next) {
    try {
      const { nombre, telefono, email, direccion, password } = req.body;

      const data = { nombre, telefono, email, direccion };
      if (password) {
        const hash = await bcrypt.hash(password, 10);
        data.password = hash;
      }

      const cliente = await this.prisma.cliente.create({
        data,
      });

      // Do not return password hash
      const { password: _pw, ...safe } = cliente;
      res.status(201).json({ ok: true, data: safe });
    } catch (e) {
      if (e.code === 'P2002') {
        return res.status(409).json({ ok: false, message: 'Email ya registrado' });
      }
      next(e);
    }
  }

  async listarClientes(req, res, next) {
    try {
      const clientes = await this.prisma.cliente.findMany({
        where: { activo: true }, // solo activos
      });
      const safe = clientes.map(({ password, ...rest }) => rest);
      res.json({ ok: true, data: safe });
    } catch (e) {
      next(e);
    }
  }

  async obtenerCliente(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const cliente = await this.prisma.cliente.findUnique({
        where: { id_cliente: id },
      });
      if (!cliente || !cliente.activo)
        return res.status(404).json({ ok: false, message: 'No encontrado' });
      const { password, ...safe } = cliente;
      res.json({ ok: true, data: safe });
    } catch (e) {
      next(e);
    }
  }

  async obtenerPerfil(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ ok: false, message: 'No autorizado' });
      const idNum = Number(userId);
      if (Number.isNaN(idNum)) {
        // Token user id is not a numeric cliente id (e.g. fallback admin). Return not found.
        return res.status(404).json({ ok: false, message: 'Cliente no encontrado' });
      }
      const cliente = await this.prisma.cliente.findUnique({ where: { id_cliente: idNum } });
      if (!cliente) return res.status(404).json({ ok: false, message: 'Cliente no encontrado' });
      const { password, ...safe } = cliente;
      res.json({ ok: true, data: safe });
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
      const { password, ...safe } = cliente;
      res.json({ ok: true, data: safe });
    } catch (e) {
      next(e);
    }
  }

  async eliminarCliente(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const cliente = await this.prisma.cliente.update({
        where: { id_cliente: id },
        data: { activo: false }, // soft delete
      });
      const { password, ...safe } = cliente;
      res.json({ ok: true, message: 'Cliente desactivado', data: safe });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ClientesController();
