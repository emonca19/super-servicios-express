const prisma = require('../prisma-client');

// Default include options
const defaultInclude = {
  cliente: true, // Assuming the relation field is 'cliente'
};

/**
 * Repository to handle CRUD operations for the Automobile entity.
 * Manages automobiles and their relationship with the client.
 */
class AutomobileRepository {

  /**
   * Creates a new automobile.
   * @param {Object} data - Automobile data.
   * @param {Object} [include=defaultInclude] - Relations to include.
   * @returns {Promise<Automobile>} The created automobile.
   */
  async create(data, include = defaultInclude) {
    return prisma.automovil.create({
      data: {
        marca: data.brand,
        modelo: data.model,
        anio: Number(data.year),
        color: data.color,
        placas: data.license_plate,
        numero_serie: data.serial_number,
        cliente: { connect: { id_cliente: Number(data.id_client) } },
      },
      include,
    });
  }

  /**
   * Gets an automobile by its ID.
   * @param {number} id_automobile - The automobile's ID.
   * @param {Object} [include=defaultInclude] - Relations to include.
   * @returns {Promise<Automobile|null>} The automobile or null if not found.
   */
  async findById(id_automobile, include = defaultInclude) {
    return prisma.automovil.findUnique({
      where: { id_auto: Number(id_automobile) },
      include,
    });
  }

  /**
   * Gets an automobile by its license plate.
   * @param {string} license_plate - The automobile's license plate.
   * @param {Object} [include=defaultInclude] - Relations to include.
   * @returns {Promise<Automobile|null>} The automobile or null if not found.
   */
  async findByLicensePlate(license_plate, include = defaultInclude) {
    return prisma.automovil.findUnique({
      where: { placas: license_plate },
      include,
    });
  }

  /**
   * Gets automobiles with filters and options.
   * @param {Object} [filters={}] - Filters to apply (id_client, brand, minYear, etc.).
   * @param {Object} [options={}] - Query options (pagination, ordering, includes).
   * @returns {Promise<Automobile[]>} An array of automobiles.
   */
  async findMany(filters = {}, options = {}) {
    const { id_client, brand, model, color, license_plate, serial_number, year, minYear, maxYear } = filters;
    const { skip = 0, take = 50, orderBy = { id_auto: 'desc' }, include = defaultInclude } = options;

    return prisma.automovil.findMany({
      where: {
        ...(id_client ? { id_cliente: Number(id_client) } : {}),
        ...(year ? { anio: Number(year) } : {}),
        ...(minYear || maxYear ? { anio: { ...(minYear ? { gte: Number(minYear) } : {}), ...(maxYear ? { lte: Number(maxYear) } : {}) } } : {}),
        ...(brand ? { marca: { contains: brand, mode: 'insensitive' } } : {}),
        ...(model ? { modelo: { contains: model, mode: 'insensitive' } } : {}),
        ...(color ? { color: { contains: color, mode: 'insensitive' } } : {}),
        ...(license_plate ? { placas: { contains: license_plate, mode: 'insensitive' } } : {}),
        ...(serial_number ? { numero_serie: { contains: serial_number, mode: 'insensitive' } } : {}),
      },
      skip,
      take,
      orderBy,
      include,
    });
  }

  /**
   * Updates an automobile (partial update).
   * @param {number} id_automobile - The automobile's ID.
   * @param {Object} data - Data to update.
   * @param {Object} [include=defaultInclude] - Relations to include.
   * @returns {Promise<Automobile>} The updated automobile.
   */
  async update(id_automobile, data, include = defaultInclude) {
    return prisma.automovil.update({
      where: { id_auto: Number(id_automobile) },
      data: {
        ...(data.brand !== undefined ? { marca: data.brand } : {}),
        ...(data.model !== undefined ? { modelo: data.model } : {}),
        ...(data.year !== undefined ? { anio: Number(data.year) } : {}),
        ...(data.color !== undefined ? { color: data.color } : {}),
        ...(data.license_plate !== undefined ? { placas: data.license_plate } : {}),
        ...(data.serial_number !== undefined ? { numero_serie: data.serial_number } : {}),
        ...(data.id_client ? { cliente: { connect: { id_cliente: Number(data.id_client) } } } : {}),
      },
      include,
    });
  }

  /**
   * Deletes an automobile.
   * @param {number} id_automobile - The automobile's ID.
   * @returns {Promise<Automobile>} The deleted automobile.
   */
  async delete(id_automobile) {
    return prisma.automovil.delete({
      where: { id_auto: Number(id_automobile) }
    });
  }
}

module.exports = new AutomobileRepository();