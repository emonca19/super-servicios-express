const prisma = require('../../prisma');

class AutomovilesController {
  constructor() {
    this.prisma = prisma;
  }

  async crearAutomovil(req, res, next) {
    try {
      const { id_cliente, placas } = req.body;

      // Verifica que el cliente exista
      const cliente = await this.prisma.cliente.findUnique({
        where: { id_cliente },
      });

      if (!cliente) {
        return res
          .status(400)
          .json({ ok: false, message: 'Cliente no existe' });
      }

      const automovil = await this.prisma.automovil.create({ data: req.body });
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
