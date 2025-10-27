const prisma = require('../../prisma');

exports.create = async (req,res,next) => {
  try {
    const { id_cliente, placas } = req.body;
    // Verifica que el auto pertenezca al cliente cuando se use en citas (consistencia de datos futura)
    const cliente = await prisma.cliente.findUnique({ where:{ id_cliente } });
    if (!cliente) return res.status(400).json({ ok:false, message:'Cliente no existe' });

    const data = await prisma.automovil.create({ data: req.body });
    res.status(201).json({ ok:true, data });
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({ ok:false, message:'Placas o número de serie ya registrados' });
    }
    next(e);
  }
};

exports.getById = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    const data = await prisma.automovil.findUnique({ where:{ id_auto:id }, include:{ cliente:true, citas:true } });
    if (!data) return res.status(404).json({ ok:false, message:'Auto no encontrado' });
    res.json({ ok:true, data });
  } catch (e) { next(e); }
};

exports.update = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    const data = await prisma.automovil.update({ where:{ id_auto:id }, data:req.body });
    res.json({ ok:true, data });
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ ok:false, message:'Auto no encontrado' });
    if (e.code === 'P2002') return res.status(409).json({ ok:false, message:'Placas o número de serie ya registrados' });
    next(e);
  }
};

exports.remove = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    await prisma.automovil.delete({ where:{ id_auto:id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ ok:false, message:'Auto no encontrado' });
    next(e);
  }
};

exports.list = async (req,res,next) => {
  try {
    const data = await prisma.automovil.findMany({ orderBy:{ id_auto:'desc' } });
    res.json({ ok:true, data });
  } catch (e) { next(e); }
};