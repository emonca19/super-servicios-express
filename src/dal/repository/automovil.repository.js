const prisma = require('../prisma-client');

const includeAuto = {
  cliente: true
};

/**
 * Repository to handle CRUD operations for the Automovil entity.
 * Manages automobiles with their client relationships.
 */
class AutomovilRepository {

  /**
   * Create a new automobile.
   * @param {Object} data - The automobile data.
   * @param {Object} include - Relations to include.
   * @returns {Promise<Automovil>} The created automobile.
   */
  async create(data, include = includeAuto) {
    return prisma.automovil.create({
      data: {
        placas: data.placas,
        marca: data.marca,
        modelo: data.modelo,
        anio: Number(data.anio),
        color: data.color,
        numero_serie: data.numero_serie,
        cliente: { connect: { id_cliente: Number(data.id_cliente) } },
      },
      include,
    });
  }

  /**
   * Get an automobile by ID.
   * @param {number} id_auto - The automobile ID.
   * @param {Object} include - Relations to include.
   * @returns {Promise<Automovil|null>} The automobile or null if not found.
   */
  async findById(id_auto, include = includeAuto) {
    return prisma.automovil.findUnique({
      where: { id_auto: Number(id_auto) },
      include,
    });
  }

  /**
   * Get an automobile by license plates.
   * @param {string} placas - The license plates.
   * @param {Object} include - Relations to include.
   * @returns {Promise<Automovil|null>} The automobile or null if not found.
   */
  async findByPlacas(placas, include = includeAuto) {
    return prisma.automovil.findUnique({
      where: { placas },
      include,
    });
  }

  /**
   * Get automobiles with filters and options.
   * @param {Object} filtros - Filters to apply.
   * @param {Object} opciones - Query options (pagination, ordering, includes).
   * @returns {Promise<Automovil[]>} Array of automobiles matching the criteria.
   */
  async findMany(filtros = {}, opciones = {}) {
    const { id_cliente, marca, modelo, color, placas, numero_serie, anio, anioMin, anioMax } = filtros;
    const { skip = 0, take = 50, orderBy = { id_auto: 'desc' }, include = includeAuto } = opciones;

    return prisma.automovil.findMany({
      where: {
        id_cliente: id_cliente ? Number(id_cliente) : undefined,
        marca: marca ? { contains: marca } : undefined,
        modelo: modelo ? { contains: modelo } : undefined,
        color: color ? { contains: color } : undefined,
        placas: placas ? { contains: placas } : undefined,
        numero_serie: numero_serie ? { contains: numero_serie } : undefined,
        anio: anio ? Number(anio) : (anioMin || anioMax) ? {
          gte: anioMin ? Number(anioMin) : undefined,
          lte: anioMax ? Number(anioMax) : undefined,
        } : undefined,
      },
      skip,
      take,
      orderBy,
      include,
    });
  }

  /**
   * Update an automobile.
   * @param {number} id_auto - The automobile ID.
   * @param {Object} data - The data to update.
   * @param {Object} include - Relations to include.
   * @returns {Promise<Automovil>} The updated automobile.
   */
  async update(id_auto, data, include = includeAuto) {
    return prisma.automovil.update({
      where: { id_auto: Number(id_auto) },
      data: {
        placas: data.placas,
        marca: data.marca,
        modelo: data.modelo,
        anio: data.anio ? Number(data.anio) : undefined,
        color: data.color,
        numero_serie: data.numero_serie,
        id_cliente: data.id_cliente ? Number(data.id_cliente) : undefined,
      },
      include,
    });
  }

  /**
   * Delete an automobile.
   * @param {number} id_auto - The automobile ID.
   * @returns {Promise<Automovil>} The deleted automobile.
   */
  async delete(id_auto) {
    return prisma.automovil.delete({
      where: { id_auto: Number(id_auto) }
    });
  }
}

module.exports = AutomovilRepository;
