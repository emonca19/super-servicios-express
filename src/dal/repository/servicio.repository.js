const prisma = require('../prisma-client');

// Default include options, assuming 'detalles' is 'details' in your schema
const defaultInclude = {
  detalles: true,
};

/**
 * Repository to handle CRUD operations for the Service entity.
 * Manages the services offered by the workshop.
 */
class ServiceRepository {
  /**
   * Creates a new service.
   * @param {Object} data - Service data (name, description, etc.).
   * @param {Object} [include=defaultInclude] - Prisma include options.
   * @returns {Promise<Service>} The created service.
   */
  async create(data, include = defaultInclude) {
    return prisma.servicio.create({
      data: {
        nombre: data.name,
        descripcion: data.description,
        duracion_estimada: data.estimated_duration,
        precio_con_utilidad: data.price_with_profit,
      },
      include,
    });
  }

  /**
   * Gets all services with filtering, pagination, and sorting.
   * @param {Object} [filters={}] - Filtering options (name, description, minPrice, maxPrice).
   * @param {Object} [options={}] - Pagination and sorting options (skip, take, orderBy, include).
   * @returns {Promise<Service[]>} An array of services.
   */
  async findAll(filters = {}, options = {}) {
    const { name, description, minPrice, maxPrice } = filters;
    const { skip = 0, take = 50, orderBy = { id_servicio: 'asc' }, include = defaultInclude } = options;

    return prisma.servicio.findMany({
      where: {
        ...(name ? { nombre: { contains: name, mode: 'insensitive' } } : {}),
        ...(description ? { descripcion: { contains: description, mode: 'insensitive' } } : {}),
        ...(minPrice || maxPrice
          ? {
              precio_con_utilidad: {
                ...(minPrice ? { gte: Number(minPrice) } : {}),
                ...(maxPrice ? { lte: Number(maxPrice) } : {}),
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

  /**
   * Gets a service by its ID.
   * @param {number|string} id_service - The service ID.
   * @param {Object} [include=defaultInclude] - Prisma include options.
   ** @returns {Promise<Service|null>} The service or null if not found.
   */
  async findById(id_service, include = defaultInclude) {
    return prisma.servicio.findUnique({
      where: { id_servicio: Number(id_service) },
      include,
    });
  }

  /**
   * Gets a service by its name (which is unique).
   * @param {string} name - The service name.
   * @param {Object} [include=defaultInclude] - Prisma include options.
   * @returns {Promise<Service|null>} The service or null if not found.
   */
  async findByName(name, include = defaultInclude) {
    return prisma.servicio.findUnique({
      where: { nombre: name },
      include,
    });
  }

  /**
   * Updates an existing service (partial update).
   * @param {number|string} id_service - The ID of the service to update.
   * @param {Object} data - Fields to update.
   * @param {Object} [include=defaultInclude] - Prisma include options.
   * @returns {Promise<Service>} The updated service.
   */
  async update(id_service, data, include = defaultInclude) {
    return prisma.servicio.update({
      where: { id_servicio: Number(id_service) },
      data: {
        ...(data.name !== undefined ? { nombre: data.name } : {}),
        ...(data.description !== undefined ? { descripcion: data.description } : {}),
        ...(data.estimated_duration !== undefined ? { duracion_estimada: data.estimated_duration } : {}),
        ...(data.price_with_profit !== undefined ? { precio_con_utilidad: data.price_with_profit } : {}),
      },
      include,
    });
  }

  /**
   * Deletes a service.
   * @param {number|string} id_service - The ID of the service to delete.
   * @returns {Promise<Service>} The deleted service.
   */
  async delete(id_service) {
    return prisma.servicio.delete({
      where: { id_servicio: Number(id_service) },
    });
  }
}

module.exports = new ServiceRepository();