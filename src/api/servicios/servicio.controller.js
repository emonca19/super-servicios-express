const prisma = require('../../prisma');

class ServiciosController {
  constructor() {
    this.prisma = prisma;
  }

  async crearServicio(req, res, next) {
    try {
      const servicio = await this.prisma.servicio.create({ data: req.body });
      res.status(201).json({ ok: true, data: servicio });
    } catch (e) {
      if (e.code === 'P2002') {
        return res.status(409).json({ ok: false, message: 'Nombre de servicio ya existe' });
      }
      next(e);
    }
  }

  async obtenerServicio(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const servicio = await this.prisma.servicio.findUnique({ where: { id_servicio: id } });
      if (!servicio) return res.status(404).json({ ok: false, message: 'Servicio no encontrado' });
      res.json({ ok: true, data: servicio });
    } catch (e) {
      next(e);
    }
  }

  async listarServicios(req, res, next) {
    try {
      const servicios = await this.prisma.servicio.findMany({ orderBy: { id_servicio: 'desc' } });
      res.json({ ok: true, data: servicios });
    } catch (e) {
      next(e);
    }
  }

  async actualizarServicio(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const servicio = await this.prisma.servicio.update({ where: { id_servicio: id }, data: req.body });
      res.json({ ok: true, data: servicio });
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ ok: false, message: 'Servicio no encontrado' });
      if (e.code === 'P2002') return res.status(409).json({ ok: false, message: 'Nombre de servicio ya existe' });
      next(e);
    }
  }

  async eliminarServicio(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      await this.prisma.servicio.delete({ where: { id_servicio: id } });
      res.status(204).send();
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ ok: false, message: 'Servicio no encontrado' });
      next(e);
    }
  }
}

module.exports = new ServiciosController();
