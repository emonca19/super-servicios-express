const prisma = require('../prisma-client');

/**
 * Repository to handle CRUD operations for the Servicio entity.
 * Manages services offered by the workshop.
 */
class ServicioRepository {

    /**
     * Get all services from the database.
     * @returns {Promise<Servicio[]>} Array of all services.
     */
    async findAll() {
        return prisma.servicio.findMany();
    }

    /**
     * Get a service by its ID.
     * @param {number} id_servicio - The service ID.
     * @returns {Promise<Servicio|null>} The service or null if not found.
     */
    async findById(id_servicio) {
        return prisma.servicio.findUnique({
            where: { id_servicio: parseInt(id_servicio) }
        });
    }

    /**
     * Get a service by its name.
     * @param {string} nombre - The service name.
     * @returns {Promise<Servicio|null>} The service or null if not found.
     */
    async findByName(nombre) {
        return prisma.servicio.findUnique({
            where: { nombre }
        });
    }

    /**
     * Create a new service.
     * @param {Object} serviceData - The service data.
     * @returns {Promise<Servicio>} The created service.
     */
    async create(serviceData) {
        return prisma.servicio.create({
            data: serviceData
        });
    }

    /**
     * Update an existing service.
     * @param {number} id_servicio - The service ID to update.
     * @param {Object} updateData - Fields to update.
     * @returns {Promise<Servicio>} The updated service.
     */
    async update(id_servicio, updateData) {
        return prisma.servicio.update({
            where: { id_servicio: parseInt(id_servicio) },
            data: updateData
        });
    }

    /**
     * Delete a service.
     * @param {number} id_servicio - The service ID to delete.
     * @returns {Promise<Servicio>} The deleted service.
     */
    async delete(id_servicio) {
        return prisma.servicio.delete({
            where: { id_servicio: parseInt(id_servicio) }
        });
    }

    /**
     * Search services by name (partial match).
     * @param {string} searchTerm - The search term.
     * @returns {Promise<Servicio[]>} Array of matching services.
     */
    async search(searchTerm) {
        return prisma.servicio.findMany({
            where: {
                nombre: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }
        });
    }
}

module.exports = ServicioRepository;
