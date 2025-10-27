const prisma = require('../../prisma');

class CitasController {
  constructor() {
    this.prisma = prisma;
  }

  async crearCita(req, res, next) {
    try {
      const { id_cliente, id_auto } = req.body;

      // Verifica que el auto pertenezca al cliente
      const auto = await this.prisma.automovil.findUnique({
        where: { id_auto },
        select: { id_cliente: true },
      });

      if (!auto) {
        return res.status(400).json({ ok: false, message: 'Auto no existe' });
      }

      if (auto.id_cliente !== id_cliente) {
        return res.status(400).json({
          ok: false,
          message: 'El auto no pertenece al cliente indicado',
        });
      }

      const cita = await this.prisma.cita.create({ data: req.body });
      res.status(201).json({ ok: true, data: cita });
    } catch (e) {
      next(e);
    }
  }

  async obtenerCita(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const cita = await this.prisma.cita.findUnique({
        where: { id_cita: id },
        include: {
          cliente: true,
          automovil: true,
          servicios: { include: { servicio: true } },
        },
      });

      if (!cita) {
        return res.status(404).json({ ok: false, message: 'Cita no encontrada' });
      }

      res.json({ ok: true, data: cita });
    } catch (e) {
      next(e);
    }
  }

  async listarCitas(req, res, next) {
    try {
      const citas = await this.prisma.cita.findMany({
        orderBy: { id_cita: 'desc' },
      });
      res.json({ ok: true, data: citas });
    } catch (e) {
      next(e);
    }
  }

  async actualizarCita(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);

      if (req.body.id_cliente || req.body.id_auto) {
        const id_cliente = req.body.id_cliente ?? undefined;
        const id_auto = req.body.id_auto ?? undefined;

        if (id_cliente && id_auto) {
          const auto = await this.prisma.automovil.findUnique({
            where: { id_auto },
            select: { id_cliente: true },
          });

          if (!auto || auto.id_cliente !== id_cliente) {
            return res.status(400).json({
              ok: false,
              message: 'El auto no pertenece al cliente indicado',
            });
          }
        }
      }

      const cita = await this.prisma.cita.update({
        where: { id_cita: id },
        data: req.body,
      });

      res.json({ ok: true, data: cita });
    } catch (e) {
      if (e.code === 'P2025') {
        return res
          .status(404)
          .json({ ok: false, message: 'Cita no encontrada' });
      }
      next(e);
    }
  }

  async eliminarCita(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      await this.prisma.cita.delete({ where: { id_cita: id } });
      res.status(204).send();
    } catch (e) {
      if (e.code === 'P2025') {
        return res
          .status(404)
          .json({ ok: false, message: 'Cita no encontrada' });
      }
      next(e);
    }
  }
}

module.exports = new CitasController();
