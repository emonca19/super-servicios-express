const prisma = require('../../prisma');

class CitasController {
  constructor() {
    this.prisma = prisma;
  }

  // Crear una cita
  async crearCita(req, res, next) {
    try {
      const { id_cliente, id_auto, inicio, fin, estado, motivo, observaciones, detalles } = req.body;

      // Verificar que el auto exista y pertenezca al cliente
      const auto = await this.prisma.automovil.findUnique({
        where: { id_auto },
        select: { id_cliente: true },
      });
      if (!auto) return res.status(400).json({ ok: false, message: 'Auto no existe' });
      if (auto.id_cliente !== id_cliente)
        return res.status(400).json({ ok: false, message: 'El auto no pertenece al cliente' });

      // Validar que todos los servicios existan
      if (detalles?.length) {
        const serviciosExistentes = await this.prisma.servicio.findMany({
          where: { id_servicio: { in: detalles.map(d => d.id_servicio) } }
        });

        if (serviciosExistentes.length !== detalles.length) {
          return res.status(400).json({ ok: false, message: 'Alguno de los servicios no existe' });
        }
      }

      // Crear la cita con detalles
      const cita = await this.prisma.cita.create({
        data: {
          id_cliente,
          id_auto,
          inicio: new Date(inicio),
          fin: new Date(fin),
          estado,
          motivo,
          observaciones,
          detalles: {
            create: detalles?.map(d => ({
              id_servicio: d.id_servicio,
              notas: d.notas,
              suministros: d.suministros,
              precio_por_servicio: d.precio_por_servicio,
            })) || [],
          },
        },
        include: {
          cliente: true,
          automovil: true,
          detalles: { include: { servicio: true } },
        },
      });

      res.status(201).json({ ok: true, data: cita });
    } catch (e) {
      next(e);
    }
  }

  // Listar todas las citas
  async listarCitas(req, res, next) {
    try {
      const citas = await this.prisma.cita.findMany({
        orderBy: { id_cita: 'desc' },
        include: {
          cliente: true,
          automovil: true,
          detalles: { include: { servicio: true } },
        },
      });
      res.json({ ok: true, data: citas });
    } catch (e) {
      next(e);
    }
  }

  // Obtener una cita por ID
  async obtenerCita(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const cita = await this.prisma.cita.findUnique({
        where: { id_cita: id },
        include: {
          cliente: true,
          automovil: true,
          detalles: { include: { servicio: true } },
        },
      });

      if (!cita) return res.status(404).json({ ok: false, message: 'Cita no encontrada' });
      res.json({ ok: true, data: cita });
    } catch (e) {
      next(e);
    }
  }

  // Actualizar una cita
  async actualizarCita(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const { id_cliente, id_auto, inicio, fin, estado, motivo, observaciones, detalles } = req.body;

      // Validar que el auto pertenezca al cliente si se actualiza
      if (id_cliente && id_auto) {
        const auto = await this.prisma.automovil.findUnique({
          where: { id_auto },
          select: { id_cliente: true },
        });
        if (!auto || auto.id_cliente !== id_cliente) {
          return res.status(400).json({ ok: false, message: 'El auto no pertenece al cliente' });
        }
      }

      // Actualizar la cita
      const cita = await this.prisma.cita.update({
        where: { id_cita: id },
        data: {
          ...(id_cliente !== undefined ? { id_cliente } : {}),
          ...(id_auto !== undefined ? { id_auto } : {}),
          ...(inicio ? { inicio: new Date(inicio) } : {}),
          ...(fin ? { fin: new Date(fin) } : {}),
          ...(estado !== undefined ? { estado } : {}),
          ...(motivo !== undefined ? { motivo } : {}),
          ...(observaciones !== undefined ? { observaciones } : {}),
          ...(detalles
            ? {
                detalles: {
                  deleteMany: {},
                  create: detalles.map(d => ({
                    id_servicio: d.id_servicio,
                    notas: d.notas,
                    suministros: d.suministros,
                    precio_por_servicio: d.precio_por_servicio,
                  })),
                },
              }
            : {}),
        },
        include: {
          cliente: true,
          automovil: true,
          detalles: { include: { servicio: true } },
        },
      });

      res.json({ ok: true, data: cita });
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ ok: false, message: 'Cita no encontrada' });
      next(e);
    }
  }

  // Eliminar una cita
  async eliminarCita(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      await this.prisma.cita.delete({ where: { id_cita: id } });
      res.status(204).send();
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ ok: false, message: 'Cita no encontrada' });
      next(e);
    }
  }
}

module.exports = new CitasController();
