const prisma = require('../../prisma');

class AutomovilesController {
  constructor() {
    this.prisma = prisma;
  }

  async crearAutomovil(req, res, next) {
    try {
      const { id_cliente } = req.body;

      // If authenticated and no id_cliente provided, use token identity
      let clienteId = id_cliente;
      if (!clienteId && req.user && req.user.id) clienteId = Number(req.user.id);

      // Validate clienteId
      if (!clienteId || Number.isNaN(Number(clienteId))) {
        return res.status(400).json({ ok: false, message: 'id_cliente es requerido en el cuerpo de la petición o debes estar autenticado' });
      }

      // Verifica que el cliente exista
      const cliente = await this.prisma.cliente.findUnique({ where: { id_cliente: Number(clienteId) } });
      if (!cliente) return res.status(400).json({ ok: false, message: 'Cliente no existe' });

      // Normalizar payload: asegurar id_cliente y anio como números antes de crear
      const payload = Object.assign({}, req.body, { id_cliente: Number(clienteId) });

      // Coerce numeric fields that may come as strings from the client
      if (payload.anio !== undefined) {
        const anioNum = Number(payload.anio);
        if (Number.isNaN(anioNum)) {
          return res.status(400).json({ ok: false, message: 'Año (anio) inválido' });
        }
        payload.anio = anioNum;
      }

      // Ensure required vehicle identifiers exist; if not, generate safe temporary values
      try {
        if (!payload.placas || String(payload.placas).trim() === '') {
          payload.placas = `TEMP-${Date.now()}-${Math.floor(Math.random()*10000)}`;
        }
      } catch (e) {}
      try {
        if (!payload.numero_serie || String(payload.numero_serie).trim() === '') {
          payload.numero_serie = `SN-${Date.now()}-${Math.floor(Math.random()*10000)}`;
        }
      } catch (e) {}

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

  async listarMisAutomoviles(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ ok: false, message: 'No autorizado' });
      const automoviles = await this.prisma.automovil.findMany({ where: { id_cliente: Number(userId) }, orderBy: { id_auto: 'desc' } });
      res.json({ ok: true, data: automoviles });
    } catch (e) {
      next(e);
    }
  }

  async actualizarAutomovil(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      // Ensure ownership if authenticated
      if (req.user && req.user.id) {
        const existing = await this.prisma.automovil.findUnique({ where: { id_auto: id }, select: { id_cliente: true } });
        if (!existing) return res.status(404).json({ ok: false, message: 'Auto no encontrado' });
        if (Number(existing.id_cliente) !== Number(req.user.id)) return res.status(403).json({ ok: false, message: 'No autorizado para modificar este auto' });
      }
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
      // Ownership check
      if (req.user && req.user.id) {
        const existing = await this.prisma.automovil.findUnique({ where: { id_auto: id }, select: { id_cliente: true } });
        if (!existing) return res.status(404).json({ ok: false, message: 'Auto no encontrado' });
        if (Number(existing.id_cliente) !== Number(req.user.id)) return res.status(403).json({ ok: false, message: 'No autorizado para eliminar este auto' });
      }
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
