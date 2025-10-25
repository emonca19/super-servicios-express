const prisma = require('../prisma-client');

/**
 * Repository to handle CRUD operations for the Cita entity.
 * Manages appointments with their relationships (client, automobile, services).
 */
class CitaRepository {

    /**
     * Get all appointments from the database.
     * @returns {Promise<Cita[]>} Array of all appointments with client, automobile and service details.
     */
    async findAll() {
        return prisma.cita.findMany({
            include: {
                cliente: true,
                automovil: true,
                detalles: { include: { servicio: true } }
            }
        });
    }

    /**
     * Get an appointment by its ID.
     * @param {number} id_cita - The appointment ID.
     * @returns {Promise<Cita|null>} The appointment with all relations or null if not found.
     */
    async findById(id_cita) {
        return prisma.cita.findUnique({
            where: { id_cita: parseInt(id_cita) },
            include: {
                cliente: true,
                automovil: true,
                detalles: { include: { servicio: true } }
            }
        });
    }

    /**
     * Create a new appointment.
     * @param {Object} appointmentData - The appointment data.
     * @returns {Promise<Cita>} The created appointment with all relations.
     */
    async create(appointmentData) {
        return prisma.cita.create({
            data: appointmentData,
            include: {
                cliente: true,
                automovil: true,
                detalles: { include: { servicio: true } }
            }
        });
    }

    /**
     * Update an existing appointment.
     * @param {number} id_cita - The appointment ID to update.
     * @param {Object} updateData - Fields to update.
     * @returns {Promise<Cita>} The updated appointment with all relations.
     */
    async update(id_cita, updateData) {
        return prisma.cita.update({
            where: { id_cita: parseInt(id_cita) },
            data: updateData,
            include: {
                cliente: true,
                automovil: true,
                detalles: { include: { servicio: true } }
            }
        });
    }

    /**
     * Delete an appointment.
     * @param {number} id_cita - The appointment ID to delete.
     * @returns {Promise<Cita>} The deleted appointment.
     */
    async delete(id_cita) {
        return prisma.cita.delete({
            where: { id_cita: parseInt(id_cita) }
        });
    }

    /**
     * Get all appointments for a specific client.
     * @param {number} id_cliente - The client ID.
     * @returns {Promise<Cita[]>} Array of client appointments with automobile and services.
     */
    async findByClient(id_cliente) {
        return prisma.cita.findMany({
            where: { id_cliente: parseInt(id_cliente) },
            include: {
                automovil: true,
                detalles: { include: { servicio: true } }
            }
        });
    }

    /**
     * Get all appointments for a specific automobile.
     * @param {number} id_auto - The automobile ID.
     * @returns {Promise<Cita[]>} Array of automobile appointments with client and services.
     */
    async findByAutomobile(id_auto) {
        return prisma.cita.findMany({
            where: { id_auto: parseInt(id_auto) },
            include: {
                cliente: true,
                detalles: { include: { servicio: true } }
            }
        });
    }
}

module.exports = CitaRepository;
