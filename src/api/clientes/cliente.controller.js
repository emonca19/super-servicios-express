const prisma = require('../../prisma');

exports.create = async (req, res, next) => {
  try {
    const { nombre, telefono, email, direccion } = req.body;

    const data = await prisma.cliente.create({
      data: { nombre, telefono, email, direccion },
    });

    // opcional: header Location
    res.set('Location', `/api/clientes/${data.id_cliente}`);

    return res.status(201).json({ ok: true, data });
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({ ok: false, message: 'Email ya registrado' });
    }
    next(e);
  }
};
