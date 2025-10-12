// src/dal/repository/AutomovilRepository.js
const prisma = require('../prisma-client');

const includeAuto = { cliente: true }; // no traemos citas (otro compañero las hace)

class AutomovilRepository {
  async crear(data, include = includeAuto) {
    return prisma.automovil.create({
      data: {
        marca: data.marca,
        modelo: data.modelo,
        anio: Number(data.anio),
        color: data.color,
        placas: data.placas,
        numero_serie: data.numero_serie,      // <- snake_case
        cliente: { connect: { id_cliente: Number(data.id_cliente) } }, // <- FK snake_case
      },
      include,
    });
  }

  async obtenerPorId(id_auto, include = includeAuto) {
    return prisma.automovil.findUnique({
      where: { id_auto: Number(id_auto) },
      include,
    });
  }

  async obtenerPorPlacas(placas, include = includeAuto) {
    return prisma.automovil.findUnique({
      where: { placas },
      include,
    });
  }

  async obtenerMuchos(filtros = {}, opciones = {}) {
    const { id_cliente, marca, modelo, color, placas, numero_serie, anio, anioMin, anioMax } = filtros;
    const { skip = 0, take = 50, orderBy = { id_auto: 'desc' }, include = includeAuto } = opciones;

    return prisma.automovil.findMany({
      where: {
        ...(id_cliente ? { id_cliente: Number(id_cliente) } : {}),
        ...(anio ? { anio: Number(anio) } : {}),
        ...(anioMin || anioMax ? { anio: { ...(anioMin ? { gte: Number(anioMin) } : {}), ...(anioMax ? { lte: Number(anioMax) } : {}) } } : {}),
        ...(marca ? { marca: { contains: marca, mode: 'insensitive' } } : {}),
        ...(modelo ? { modelo: { contains: modelo, mode: 'insensitive' } } : {}),
        ...(color ? { color: { contains: color, mode: 'insensitive' } } : {}),
        ...(placas ? { placas: { contains: placas, mode: 'insensitive' } } : {}),
        ...(numero_serie ? { numero_serie: { contains: numero_serie, mode: 'insensitive' } } : {}),
      },
      skip,
      take,
      orderBy,
      include,
    });
  }

  async actualizar(id_auto, data, include = includeAuto) {
    return prisma.automovil.update({
      where: { id_auto: Number(id_auto) },
      data: {
        ...(data.marca !== undefined ? { marca: data.marca } : {}),
        ...(data.modelo !== undefined ? { modelo: data.modelo } : {}),
        ...(data.anio !== undefined ? { anio: Number(data.anio) } : {}),
        ...(data.color !== undefined ? { color: data.color } : {}),
        ...(data.placas !== undefined ? { placas: data.placas } : {}),
        ...(data.numero_serie !== undefined ? { numero_serie: data.numero_serie } : {}),
        ...(data.id_cliente ? { cliente: { connect: { id_cliente: Number(data.id_cliente) } } } : {}),
      },
      include,
    });
  }

  async eliminar(id_auto) {
    return prisma.automovil.delete({ where: { id_auto: Number(id_auto) } });
  }
}

module.exports = new AutomovilRepository();
