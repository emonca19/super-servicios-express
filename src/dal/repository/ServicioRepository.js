const prisma = require('../prisma-client');

const includeServicio = {
  detalles: true, 
};

class ServicioRepository {
  // Crear un nuevo servicio
  async crear(data, include = includeServicio) {
    return prisma.servicio.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        duracion_estimada: data.duracion_estimada,
        precio_con_utilidad: data.precio_con_utilidad,
      },
      include,
    });
  }

  // Obtener todos los servicios
  async obtenerTodos(filtros = {}, opciones = {}) {
    const { nombre, descripcion, precioMin, precioMax } = filtros;
    const { skip = 0, take = 50, orderBy = { id_servicio: 'asc' }, include = includeServicio } = opciones;

    return prisma.servicio.findMany({
      where: {
        ...(nombre ? { nombre: { contains: nombre, mode: 'insensitive' } } : {}),
        ...(descripcion ? { descripcion: { contains: descripcion, mode: 'insensitive' } } : {}),
        ...(precioMin || precioMax
          ? {
              precio_con_utilidad: {
                ...(precioMin ? { gte: Number(precioMin) } : {}),
                ...(precioMax ? { lte: Number(precioMax) } : {}),
              },
            }
          : {}),
      },
      skip,
      take,
      orderBy,
      include,
    });
  }

  // Obtener servicio por ID
  async obtenerPorId(id_servicio, include = includeServicio) {
    return prisma.servicio.findUnique({
      where: { id_servicio: Number(id_servicio) },
      include,
    });
  }

  // Obtener servicio por nombre (único)
  async obtenerPorNombre(nombre, include = includeServicio) {
    return prisma.servicio.findUnique({
      where: { nombre },
      include,
    });
  }

  // Actualizar servicio
  async actualizar(id_servicio, data, include = includeServicio) {
    return prisma.servicio.update({
      where: { id_servicio: Number(id_servicio) },
      data: {
        ...(data.nombre !== undefined ? { nombre: data.nombre } : {}),
        ...(data.descripcion !== undefined ? { descripcion: data.descripcion } : {}),
        ...(data.duracion_estimada !== undefined ? { duracion_estimada: data.duracion_estimada } : {}),
        ...(data.precio_con_utilidad !== undefined ? { precio_con_utilidad: data.precio_con_utilidad } : {}),
      },
      include,
    });
  }

  // Eliminar servicio
  async eliminar(id_servicio) {
    return prisma.servicio.delete({
      where: { id_servicio: Number(id_servicio) },
    });
  }
}

module.exports = new ServicioRepository();