const prisma = require('../../prisma');

class CitasController {
  constructor() {
    this.prisma = prisma;
  }

  // Crear una cita
  async crearCita(req, res, next) {
    try {
      // Support payloads that provide either ids or full objects for cliente/automovil.
      // If id is missing, try to find by unique fields (email, telefono, placas, numero_serie)
      // or create the records.
      let { id_cliente, id_auto, inicio, fin, estado, motivo, observaciones, detalles, cliente, automovil } = req.body;

      // Normalize incoming cliente/automovil payloads if present
      cliente = cliente || req.body.cliente || null;
      automovil = automovil || req.body.automovil || null;

      // If id_cliente not provided, attempt to find or create cliente
      if (!id_cliente && cliente) {
        // Try to find existing cliente by email or telefono (prefer email)
        const where = {};
        if (cliente.email) where.email = cliente.email;
        let found = null;
        if (cliente.email) {
          found = await this.prisma.cliente.findUnique({ where: { email: cliente.email } });
        }
        if (!found && cliente.telefono) {
          found = await this.prisma.cliente.findFirst({ where: { telefono: cliente.telefono } });
        }
        if (found) {
          id_cliente = found.id_cliente;
        } else {
          // Create cliente
          const created = await this.prisma.cliente.create({
            data: {
              nombre: cliente.nombre || 'Sin nombre',
              telefono: cliente.telefono || '',
              email: cliente.email || `cliente_${Date.now()}@local`,
              direccion: cliente.direccion || null,
            },
          });
          id_cliente = created.id_cliente;
        }
      }

      // If id_auto not provided, attempt to find or create automovil (requires id_cliente)
      if (!id_auto && automovil) {
        // Prefer lookup by placas or numero_serie
        let foundAuto = null;
        if (automovil.placas) {
          foundAuto = await this.prisma.automovil.findUnique({ where: { placas: automovil.placas } });
        }
        if (!foundAuto && automovil.numero_serie) {
          foundAuto = await this.prisma.automovil.findUnique({ where: { numero_serie: automovil.numero_serie } });
        }

        if (foundAuto) {
          // Ensure ownership: if automovil exists but id_cliente provided and differs, reject
          if (id_cliente && foundAuto.id_cliente !== id_cliente) {
            return res.status(400).json({ ok: false, message: 'El auto existe y pertenece a otro cliente' });
          }
          id_auto = foundAuto.id_auto;
        } else {
          // Create automovil; require id_cliente
          if (!id_cliente) return res.status(400).json({ ok: false, message: 'No se proporcionó id_cliente para crear el automovil' });
          const createdAuto = await this.prisma.automovil.create({
            data: {
              marca: automovil.marca || 'Sin marca',
              modelo: automovil.modelo || 'Sin modelo',
              anio: automovil.anio ? Number(automovil.anio) : 0,
              color: automovil.color || '',
              placas: automovil.placas || `PL-${Date.now()}`,
              numero_serie: automovil.numero_serie || `SN-${Date.now()}`,
              id_cliente: id_cliente,
            },
          });
          id_auto = createdAuto.id_auto;
        }
      }

      // Now we must have id_cliente and id_auto; validate presence
      if (!id_cliente) return res.status(400).json({ ok: false, message: 'id_cliente es requerido (o cliente object)' });
      if (!id_auto) return res.status(400).json({ ok: false, message: 'id_auto es requerido (o automovil object)' });
      // Wrap DB operations in a transaction for atomicity
      const result = await this.prisma.$transaction(async (tx) => {
        let { id_cliente, id_auto, inicio, fin, estado, motivo, observaciones, detalles, cliente, automovil } = req.body;
        cliente = cliente || req.body.cliente || null;
        automovil = automovil || req.body.automovil || null;

        // Resolve or create cliente
        if (id_cliente) {
          // ensure exists
          const c = await tx.cliente.findUnique({ where: { id_cliente: Number(id_cliente) } });
          if (!c) throw Object.assign(new Error('Cliente no encontrado'), { status: 400, code: 'CLIENTE_NOT_FOUND' });
        } else if (cliente) {
          let found = null;
          if (cliente.email) found = await tx.cliente.findUnique({ where: { email: cliente.email } });
          if (!found && cliente.telefono) found = await tx.cliente.findFirst({ where: { telefono: cliente.telefono } });
          if (found) {
            id_cliente = found.id_cliente;
          } else {
            try {
              const created = await tx.cliente.create({
                data: {
                  nombre: cliente.nombre || 'Sin nombre',
                  telefono: cliente.telefono || '',
                  email: cliente.email || `cliente_${Date.now()}@local`,
                  direccion: cliente.direccion || null,
                },
              });
              id_cliente = created.id_cliente;
            } catch (err) {
              // Handle race condition where unique constraint may have been inserted concurrently
              if (err.code === 'P2002' && cliente.email) {
                const existing = await tx.cliente.findUnique({ where: { email: cliente.email } });
                if (existing) id_cliente = existing.id_cliente;
                else throw err;
              } else {
                throw err;
              }
            }
          }
        }

        // Resolve or create automovil
        if (id_auto) {
          const a = await tx.automovil.findUnique({ where: { id_auto: Number(id_auto) } });
          if (!a) throw Object.assign(new Error('Auto no encontrado'), { status: 400, code: 'AUTO_NOT_FOUND' });
        } else if (automovil) {
          let foundAuto = null;
          if (automovil.placas) foundAuto = await tx.automovil.findUnique({ where: { placas: automovil.placas } });
          if (!foundAuto && automovil.numero_serie) foundAuto = await tx.automovil.findUnique({ where: { numero_serie: automovil.numero_serie } });

          if (foundAuto) {
            if (id_cliente && foundAuto.id_cliente !== id_cliente) {
              throw Object.assign(new Error('El auto existe y pertenece a otro cliente'), { status: 400, code: 'AUTO_OWNER_MISMATCH' });
            }
            id_auto = foundAuto.id_auto;
          } else {
            if (!id_cliente) throw Object.assign(new Error('No se proporcionó id_cliente para crear el automovil'), { status: 400, code: 'MISSING_CLIENT_FOR_AUTO' });
            try {
              const createdAuto = await tx.automovil.create({
                data: {
                  marca: automovil.marca || 'Sin marca',
                  modelo: automovil.modelo || 'Sin modelo',
                  anio: automovil.anio ? Number(automovil.anio) : 0,
                  color: automovil.color || '',
                  placas: automovil.placas || `PL-${Date.now()}`,
                  numero_serie: automovil.numero_serie || `SN-${Date.now()}`,
                  id_cliente: Number(id_cliente),
                },
              });
              id_auto = createdAuto.id_auto;
            } catch (err) {
              if (err.code === 'P2002') {
                // Unique constraint on placas/numero_serie - try to fetch existing
                let existing = null;
                if (automovil.placas) existing = await tx.automovil.findUnique({ where: { placas: automovil.placas } });
                if (!existing && automovil.numero_serie) existing = await tx.automovil.findUnique({ where: { numero_serie: automovil.numero_serie } });
                if (existing) {
                  if (id_cliente && existing.id_cliente !== id_cliente) throw Object.assign(new Error('El auto existe y pertenece a otro cliente'), { status: 400, code: 'AUTO_OWNER_MISMATCH' });
                  id_auto = existing.id_auto;
                } else throw err;
              } else throw err;
            }
          }
        }

        // Ensure we have ids
        if (!id_cliente) throw Object.assign(new Error('id_cliente es requerido (o cliente object)'), { status: 400, code: 'MISSING_CLIENT' });
        if (!id_auto) throw Object.assign(new Error('id_auto es requerido (o automovil object)'), { status: 400, code: 'MISSING_AUTO' });

        // Verify auto belongs to client
        const autoRow = await tx.automovil.findUnique({ where: { id_auto: Number(id_auto) }, select: { id_cliente: true } });
        if (!autoRow) throw Object.assign(new Error('Auto no existe'), { status: 400, code: 'AUTO_NOT_FOUND' });
        if (autoRow.id_cliente !== Number(id_cliente)) throw Object.assign(new Error('El auto no pertenece al cliente'), { status: 400, code: 'AUTO_NOT_OWNER' });

        // Validate servicios: accept either numeric id_servicio or service nombre
        if (detalles?.length) {
          const ids = [];
          const names = [];
          detalles.forEach((d) => {
            const maybe = d.id_servicio;
            const n = Number(maybe);
            if (!Number.isNaN(n)) ids.push(n);
            else if (typeof maybe === 'string' && maybe.trim() !== '') names.push(maybe.trim());
          });

          let serviciosExistentes = [];
          if (ids.length && names.length) {
            serviciosExistentes = await tx.servicio.findMany({ where: { OR: [{ id_servicio: { in: ids } }, { nombre: { in: names } }] } });
          } else if (ids.length) {
            serviciosExistentes = await tx.servicio.findMany({ where: { id_servicio: { in: ids } } });
          } else if (names.length) {
            serviciosExistentes = await tx.servicio.findMany({ where: { nombre: { in: names } } });
          }

          if (serviciosExistentes.length !== detalles.length) {
            throw Object.assign(new Error('Alguno de los servicios no existe'), { status: 400, code: 'SERVICIO_NOT_FOUND' });
          }

          // Map string names to numeric ids in detalles so subsequent create uses numeric id_servicio
          const mapByName = new Map(serviciosExistentes.map((s) => [String(s.nombre).trim(), s.id_servicio]));
          detalles = detalles.map((d) => {
            const n = Number(d.id_servicio);
            if (!Number.isNaN(n)) return { ...d, id_servicio: n };
            const key = String(d.id_servicio || '').trim();
            if (mapByName.has(key)) return { ...d, id_servicio: mapByName.get(key) };
            return d;
          });
        }

        // Create cita
        const cita = await tx.cita.create({
          data: {
            id_cliente: Number(id_cliente),
            id_auto: Number(id_auto),
            inicio: new Date(inicio),
            fin: new Date(fin),
            estado,
            motivo,
            observaciones,
            detalles: { create: detalles?.map(d => ({ id_servicio: d.id_servicio, notas: d.notas, suministros: d.suministros, precio_por_servicio: d.precio_por_servicio })) || [] },
          },
          include: { cliente: true, automovil: true, detalles: { include: { servicio: true } } },
        });

        return cita;
      });

      res.status(201).json({ ok: true, data: result });
    } catch (e) {
      // Propagate known statuses
      if (e && e.status) return res.status(e.status).json({ ok: false, message: e.message });
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

  // Listar citas (para administración)
  async listarCitas(req, res, next) {
    try {
      const citas = await this.prisma.cita.findMany({
        include: { cliente: true, automovil: true, detalles: { include: { servicio: true } } },
        orderBy: { inicio: 'asc' },
      });
      res.json({ ok: true, data: citas });
    } catch (e) {
      next(e);
    }
  }

  // Listar citas del cliente autenticado
  async listarMisCitas(req, res, next) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ ok: false, message: 'No autorizado' });
      const citas = await this.prisma.cita.findMany({
        where: { id_cliente: Number(userId) },
        include: { cliente: true, automovil: true, detalles: { include: { servicio: true } } },
        orderBy: { inicio: 'asc' },
      });
      res.json({ ok: true, data: citas });
    } catch (e) {
      next(e);
    }
  }

  // Obtener una cita por id
  async obtenerCita(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const cita = await this.prisma.cita.findUnique({
        where: { id_cita: id },
        include: { cliente: true, automovil: true, detalles: { include: { servicio: true } } },
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
      const payload = {};
      const fields = ['inicio', 'fin', 'estado', 'motivo', 'observaciones'];
      fields.forEach((f) => {
        if (req.body[f] !== undefined) payload[f] = req.body[f];
      });
      const updated = await this.prisma.cita.update({
        where: { id_cita: id },
        data: payload,
        include: { cliente: true, automovil: true, detalles: { include: { servicio: true } } },
      });
      res.json({ ok: true, data: updated });
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ ok: false, message: 'Cita no encontrada' });
      next(e);
    }
  }
}

module.exports = new CitasController();
