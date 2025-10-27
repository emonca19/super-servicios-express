const prisma = require('../../prisma');

class ServicioCitaController {
  constructor() {
    this.prisma = prisma;
  }

  async crearServicioCita(req, res, next) {
    try {
      const { id_cita, id_servicio } = req.body;

      // Verifica que la cita exista
      const cita = await this.prisma.cita.findUnique({ where: { id_cita } });
      if (!cita)
        return res.status(400).json({ ok: false, message: 'Cita no existe' });

      // Verifica que el servicio exista
      const serv = await this.prisma.servicio.findUnique({ where: { id_servicio } });
      if (!serv)
        return res.status(400).json({ ok: false, message: 'Servicio no existe' });

      const data = await this.prisma.servicio_cita.create({ data: req.body });
      res.status(201).json({ ok: true, data });
    } catch (e) {
      if (e.code === 'P2002')
        return res
          .status(409)
          .json({ ok: false, message: 'El servicio ya está agregado a esta cita' });
      next(e);
    }
  }

  async obtenerServicioCita(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await this.prisma.servicio_cita.findUnique({
        where: { id },
        include: { cita: true, servicio: true },
      });

      if (!data)
        return res.status(404).json({ ok: false, message: 'Registro no encontrado' });

      res.json({ ok: true, data });
    } catch (e) {
      next(e);
    }
  }

  async listarServiciosCita(req, res, next) {
    try {
      const data = await this.prisma.servicio_cita.findMany({
        orderBy: { id: 'desc' },
      });
      res.json({ ok: true, data });
    } catch (e) {
      next(e);
    }
  }

  async actualizarServicioCita(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await this.prisma.servicio_cita.update({
        where: { id },
        data: req.body,
      });
      res.json({ ok: true, data });
    } catch (e) {
      if (e.code === 'P2025')
        return res.status(404).json({ ok: false, message: 'Registro no encontrado' });
      if (e.code === 'P2002')
        return res
          .status(409)
          .json({ ok: false, message: 'Duplicado (id_cita, id_servicio)' });
      next(e);
    }
  }

  async eliminarServicioCita(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      await this.prisma.servicio_cita.delete({ where: { id } });
      res.status(204).send();
    } catch (e) {
      if (e.code === 'P2025')
        return res.status(404).json({ ok: false, message: 'Registro no encontrado' });
      next(e);
    }
  }
}

module.exports = new ServicioCitaController();
