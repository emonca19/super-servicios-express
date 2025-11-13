const prisma = require('../../prisma');

class AutomovilesController {
  constructor() {
    this.prisma = prisma;
  }

  async crearAutomovil(req, res, next) {
    try {
      const { id_cliente, placas } = req.body;

      // Validar que se haya enviado id_cliente
      if (!id_cliente) {
        return res.status(400).json({ ok: false, message: 'id_cliente es requerido en el cuerpo de la petición' });
      }

      // Asegurar que id_cliente sea número
      const clienteId = Number.isInteger(id_cliente) ? id_cliente : parseInt(id_cliente, 10);
      if (!clienteId || Number.isNaN(clienteId)) {
        return res.status(400).json({ ok: false, message: 'id_cliente debe ser un entero válido' });
      }

      // Verifica que el cliente exista
      const cliente = await this.prisma.cliente.findUnique({
        where: { id_cliente: clienteId },
      });

      if (!cliente) {
        return res.status(400).json({ ok: false, message: 'Cliente no existe' });
      }

      // Normalizar payload: asegurar id_cliente como número antes de crear
      const payload = Object.assign({}, req.body, { id_cliente: clienteId });

      const automovil = await this.prisma.automovil.create({ data: payload });
      res.status(201).json({ ok: true, data: automovil });
    } catch (e) {
      if (e.code === 'P2002') {
        return res.status(409).json({
          ok: false,
          message: 'Placas o número de serie ya registrados',
        });
      }
      next(e);
    }
  }

  async obtenerAutomovil(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const automovil = await this.prisma.automovil.findUnique({
        where: { id_auto: id },
        include: { cliente: true, citas: true },
      });

      if (!automovil) {
        return res
          .status(404)
          .json({ ok: false, message: 'Auto no encontrado' });
      }

      res.json({ ok: true, data: automovil });
    } catch (e) {
      next(e);
    }
  }

  async listarAutomoviles(req, res, next) {
    try {
      const automoviles = await this.prisma.automovil.findMany({
        orderBy: { id_auto: 'desc' },
      });
      res.json({ ok: true, data: automoviles });
    } catch (e) {
      next(e);
    }
  }

  async actualizarAutomovil(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const automovil = await this.prisma.automovil.update({
        where: { id_auto: id },
        data: req.body,
      });

      res.json({ ok: true, data: automovil });
    } catch (e) {
      if (e.code === 'P2025') {
        return res
          .status(404)
          .json({ ok: false, message: 'Auto no encontrado' });
      }
      if (e.code === 'P2002') {
        return res.status(409).json({
          ok: false,
          message: 'Placas o número de serie ya registrados',
        });
      }
      next(e);
    }
  }

  async eliminarAutomovil(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      await this.prisma.automovil.delete({ where: { id_auto: id } });
      res.status(204).send();
    } catch (e) {
      if (e.code === 'P2025') {
        return res
          .status(404)
          .json({ ok: false, message: 'Auto no encontrado' });
      }
      next(e);
    }
  }
}

module.exports = new AutomovilesController();
