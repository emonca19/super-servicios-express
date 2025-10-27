const prisma = require('../../prisma');

exports.create = async (req,res,next) => {
  try {
    const { id_cita, id_servicio } = req.body;
    // Ensure cita exists
    const cita = await prisma.cita.findUnique({ where:{ id_cita } });
    if (!cita) return res.status(400).json({ ok:false, message:'Cita no existe' });
    // Ensure servicio exists
    const serv = await prisma.servicio.findUnique({ where:{ id_servicio } });
    if (!serv) return res.status(400).json({ ok:false, message:'Servicio no existe' });

    const data = await prisma.servicio_cita.create({ data:req.body });
    res.status(201).json({ ok:true, data });
  } catch (e) {
    if (e.code === 'P2002') return res.status(409).json({ ok:false, message:'El servicio ya está agregado a esta cita' });
    next(e);
  }
};

exports.getById = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    const data = await prisma.servicio_cita.findUnique({
      where:{ id },
      include:{ cita:true, servicio:true }
    });
    if (!data) return res.status(404).json({ ok:false, message:'Registro no encontrado' });
    res.json({ ok:true, data });
  } catch (e) { next(e); }
};

exports.update = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    const data = await prisma.servicio_cita.update({ where:{ id }, data:req.body });
    res.json({ ok:true, data });
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ ok:false, message:'Registro no encontrado' });
    if (e.code === 'P2002') return res.status(409).json({ ok:false, message:'Duplicado (id_cita, id_servicio)' });
    next(e);
  }
};

exports.remove = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    await prisma.servicio_cita.delete({ where:{ id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ ok:false, message:'Registro no encontrado' });
    next(e);
  }
};

exports.list = async (req,res,next) => {
  try {
    const data = await prisma.servicio_cita.findMany({ orderBy:{ id:'desc' } });
    res.json({ ok:true, data });
  } catch (e) { next(e); }
};