const prisma = require('../../prisma');

exports.create = async (req,res,next) => {
  try {
    const { id_cliente, id_auto } = req.body;
    // Verifica que el auto pertenezca al cliente
    const auto = await prisma.automovil.findUnique({ where:{ id_auto }, select:{ id_cliente:true } });
    if (!auto) return res.status(400).json({ ok:false, message:'Auto no existe' });
    if (auto.id_cliente !== id_cliente) {
      return res.status(400).json({ ok:false, message:'El auto no pertenece al cliente indicado' });
    }
    const data = await prisma.cita.create({ data:req.body });
    res.status(201).json({ ok:true, data });
  } catch (e) { next(e); }
};

exports.getById = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    const data = await prisma.cita.findUnique({
      where:{ id_cita:id },
      include:{ cliente:true, automovil:true, servicios:{ include:{ servicio:true } } }
    });
    if (!data) return res.status(404).json({ ok:false, message:'Cita no encontrada' });
    res.json({ ok:true, data });
  } catch (e) { next(e); }
};

exports.update = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    if (req.body.id_cliente || req.body.id_auto) {
      const id_cliente = req.body.id_cliente ?? undefined;
      const id_auto = req.body.id_auto ?? undefined;
      if (id_cliente && id_auto) {
        const auto = await prisma.automovil.findUnique({ where:{ id_auto }, select:{ id_cliente:true } });
        if (!auto || auto.id_cliente !== id_cliente) {
          return res.status(400).json({ ok:false, message:'El auto no pertenece al cliente indicado' });
        }
      }
    }
    const data = await prisma.cita.update({ where:{ id_cita:id }, data:req.body });
    res.json({ ok:true, data });
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ ok:false, message:'Cita no encontrada' });
    next(e);
  }
};

exports.remove = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    await prisma.cita.delete({ where:{ id_cita:id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ ok:false, message:'Cita no encontrada' });
    next(e);
  }
};

exports.list = async (req,res,next) => {
  try {
    const data = await prisma.cita.findMany({ orderBy:{ id_cita:'desc' } });
    res.json({ ok:true, data });
  } catch (e) { next(e); }
};