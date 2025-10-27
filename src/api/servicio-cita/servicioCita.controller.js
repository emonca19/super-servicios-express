const prisma = require('../../prisma');

class ServicioCitaController {
  constructor() {
    this.prisma = prisma;
  }

  // Crear un nuevo detalle de cita
  async crearServicioCita(req, res, next) {
    try {
      const { id_cita, id_servicio } = req.body;

      // Verificar existencia de la cita
      const cita = await this.prisma.cita.findUnique({ where: { id_cita } });
      if (!cita)
        return res.status(400).json({ ok: false, message: 'La cita no existe' });

      // Verificar existencia del servicio
      const servicio = await this.prisma.servicio.findUnique({ where: { id_servicio } });
      if (!servicio)
        return res.status(400).json({ ok: false, message: 'El servicio no existe' });

      // Crear detalle de cita
      const data = await this.prisma.detalleCita.create({ data: req.body });
      res.status(201).json({ ok: true, data });
    } catch (e) {
      if (e.code === 'P2002') {
        return res
          .status(409)
          .json({ ok: false, message: 'El servicio ya está agregado a esta cita' });
      }
      next(e);
    }
  }

  // Obtener un detalle específico por su ID
  async obtenerServicioCita(req, res, next) {
    try {
      const id_detalleCita = parseInt(req.params.id, 10);
      const data = await this.prisma.detalleCita.findUnique({
        where: { id_detalleCita },
        include: {
          cita: true,
          servicio: true,
        },
      });

      if (!data)
        return res.status(404).json({ ok: false, message: 'Registro no encontrado' });

      res.json({ ok: true, data });
    } catch (e) {
      next(e);
    }
  }

  // Listar todos los detalles de cita
  async listarServiciosCita(req, res, next) {
    try {
      const data = await this.prisma.detalleCita.findMany({
        orderBy: { id_detalleCita: 'desc' },
        include: {
          cita: {
            select: { id_cita: true, motivo: true, estado: true, inicio: true },
          },
          servicio: {
            select: { id_servicio: true, nombre: true, precio_con_utilidad: true },
          },
        },
      });
      res.json({ ok: true, data });
    } catch (e) {
      next(e);
    }
  }

  // Actualizar un detalle de cita
  async actualizarServicioCita(req, res, next) {
    try {
      const id_detalleCita = parseInt(req.params.id, 10);
      const data = await this.prisma.detalleCita.update({
        where: { id_detalleCita },
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

  // Eliminar un detalle de cita
  async eliminarServicioCita(req, res, next) {
    try {
      const id_detalleCita = parseInt(req.params.id, 10);
      await this.prisma.detalleCita.delete({ where: { id_detalleCita } });
      res.status(204).send();
    } catch (e) {
      if (e.code === 'P2025')
        return res.status(404).json({ ok: false, message: 'Registro no encontrado' });
      next(e);
    }
  }
}

module.exports = new ServicioCitaController();
