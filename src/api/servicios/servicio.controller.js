const prisma = require('../../prisma');

exports.create = async (req,res,next) => {
  try {
    const data = await prisma.servicio.create({ data:req.body });
    res.status(201).json({ ok:true, data });
  } catch (e) {
    if (e.code === 'P2002') return res.status(409).json({ ok:false, message:'Nombre de servicio ya existe' });
    next(e);
  }
};

exports.getById = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    const data = await prisma.servicio.findUnique({ where:{ id_servicio:id } });
    if (!data) return res.status(404).json({ ok:false, message:'Servicio no encontrado' });
    res.json({ ok:true, data });
  } catch (e) { next(e); }
};

exports.update = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    const data = await prisma.servicio.update({ where:{ id_servicio:id }, data:req.body });
    res.json({ ok:true, data });
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ ok:false, message:'Servicio no encontrado' });
    if (e.code === 'P2002') return res.status(409).json({ ok:false, message:'Nombre de servicio ya existe' });
    next(e);
  }
};

exports.remove = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    await prisma.servicio.delete({ where:{ id_servicio:id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ ok:false, message:'Servicio no encontrado' });
    next(e);
  }
};

exports.list = async (req,res,next) => {
  try {
    const data = await prisma.servicio.findMany({ orderBy:{ id_servicio:'desc' } });
    res.json({ ok:true, data });
  } catch (e) { next(e); }
};