const prisma = require('../../prisma');

exports.create = async (req,res,next) => {
  try {
    const { nombre, telefono, email, direccion } = req.body;
    const data = await prisma.cliente.create({ data:{ nombre, telefono, email, direccion }});
    res.status(201).json({ ok:true, data });
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({ ok:false, message:'Email ya registrado' });
    }
    next(e);
  }
};

exports.getById = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    const data = await prisma.cliente.findUnique({ where:{ id_cliente:id }, include:{ automoviles:true, citas:true } });
    if (!data) return res.status(404).json({ ok:false, message:'Cliente no encontrado' });
    res.json({ ok:true, data });
  } catch (e) { next(e); }
};

exports.update = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    const data = await prisma.cliente.update({ where:{ id_cliente:id }, data:req.body });
    res.json({ ok:true, data });
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ ok:false, message:'Cliente no encontrado' });
    if (e.code === 'P2002') return res.status(409).json({ ok:false, message:'Email ya registrado' });
    next(e);
  }
};

exports.remove = async (req,res,next) => {
  try {
    const id = parseInt(req.params.id,10);
    await prisma.cliente.delete({ where:{ id_cliente:id } });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025') return res.status(404).json({ ok:false, message:'Cliente no encontrado' });
    next(e);
  }
};

exports.list = async (req,res,next) => {
  try {
    const data = await prisma.cliente.findMany({ orderBy:{ id_cliente:'desc' }});
    res.json({ ok:true, data });
  } catch (e) { next(e); }
};