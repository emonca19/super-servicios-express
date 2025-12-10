const prisma = require('../../prisma');

class ServiciosController {
  constructor() {
    this.prisma = prisma;
  }

  async crearServicio(req, res, next) {
    try {
      try {
        if (req.file && req.file.filename) {
          req.body.imagen = `/uploads/services/${req.file.filename}`;
        }
      } catch (e) {}

      const data = {};
      if (req.body.nombre !== undefined) data.nombre = req.body.nombre;
      if (req.body.descripcion !== undefined) data.descripcion = req.body.descripcion;
      if (req.body.duracion_estimada !== undefined) {
        const val = parseInt(String(req.body.duracion_estimada).replace(/\s+/g, ''), 10);
        if (!Number.isNaN(val)) data.duracion_estimada = val;
      }
      if (req.body.precio_con_utilidad !== undefined) {
        const raw = String(req.body.precio_con_utilidad).replace(/\s+/g, '').replace(/,/, '.');
        const num = parseFloat(raw);
        if (!Number.isNaN(num)) data.precio_con_utilidad = num;
      }
      if (req.body.imagen !== undefined) data.imagen = req.body.imagen;

      const servicio = await this.prisma.servicio.create({ data });
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
      try {
        if (req.file && req.file.filename) {
          req.body.imagen = `/uploads/services/${req.file.filename}`;
        }
      } catch (e) {}
      const updateData = {};
      if (req.body.nombre !== undefined) updateData.nombre = req.body.nombre;
      if (req.body.descripcion !== undefined) updateData.descripcion = req.body.descripcion;
      if (req.body.duracion_estimada !== undefined) {
        const val = parseInt(String(req.body.duracion_estimada).replace(/\s+/g, ''), 10);
        if (!Number.isNaN(val)) updateData.duracion_estimada = val;
      }
      if (req.body.precio_con_utilidad !== undefined) {
        const raw = String(req.body.precio_con_utilidad).replace(/\s+/g, '').replace(/,/, '.');
        const num = parseFloat(raw);
        if (!Number.isNaN(num)) updateData.precio_con_utilidad = num;
      }
      if (req.body.imagen !== undefined) updateData.imagen = req.body.imagen;

      const servicio = await this.prisma.servicio.update({ where: { id_servicio: id }, data: updateData });
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
