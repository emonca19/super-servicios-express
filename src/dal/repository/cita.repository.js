const prisma = require('../prisma-client');

const defaultInclude = {
  cliente: true,
  automovil: true,
  detalles: {
    include: { servicio: true }
  }
};

/**
 * Repository to handle CRUD operations for the Appointment entity.
 * Manages appointments with their relationships (client, automobile, services).
 */
class CitaRepository {

  /**
   * Get all appointments.
   * @param {Object} [include=defaultInclude] - Prisma include options.
   * @returns {Promise<Appointment[]>} Array of all appointments.
   */
  async findAll(include = defaultInclude) {
    return prisma.cita.findMany({ include });
  }

  /**
   * Get an appointment by its ID.
   * @param {number} id_cita - The appointment ID.
   * @param {Object} [include=defaultInclude] - Prisma include options.
   * @returns {Promise<Appointment|null>} The appointment or null if not found.
   */
  async findById(id_cita, include = defaultInclude) {
    return prisma.cita.findUnique({
      where: { id_cita: parseInt(id_cita) },
      include,
    });
  }

  /**
   * Create a new appointment.
   * @param {Object} data - The appointment data.
   * @param {Object} [include=defaultInclude] - Prisma include options.
   * @returns {Promise<Appointment>} The created appointment.
   */
  async create(data, include = defaultInclude) {
    return prisma.cita.create({
      data: {
        fecha: data.fecha,
        estado: data.estado,
        notas: data.notas,
        id_cliente: parseInt(data.id_cliente),
        id_auto: parseInt(data.id_auto),
      },
      include,
    });
  }

  /**
   * Update an existing appointment (partial update).
   * @param {number} id_cita - The appointment ID to update.
   * @param {Object} data - Fields to update.
   * @param {Object} [include=defaultInclude] - Prisma include options.
   * @returns {Promise<Appointment>} The updated appointment.
   */
  async update(id_cita, data, include = defaultInclude) {
    return prisma.cita.update({
      where: { id_cita: parseInt(id_cita) },
      data: {
        ...(data.fecha !== undefined ? { fecha: data.fecha } : {}),
        ...(data.estado !== undefined ? { estado: data.estado } : {}),
        ...(data.notas !== undefined ? { notas: data.notas } : {}),
      },
      include,
    });
  }

  /**
   * Delete an appointment.
   * @param {number} id_cita - The appointment ID to delete.
   * @returns {Promise<Appointment>} The deleted appointment.
   */
  async delete(id_cita) {
    return prisma.cita.delete({
      where: { id_cita: parseInt(id_cita) }
    });
  }

  /**
   * Get all appointments for a specific client.
   * @param {number} id_cliente - The client ID.
   * @param {Object} [include] - Optional include object.
   * @returns {Promise<Appointment[]>} Array of client's appointments.
   */
  async findByClient(id_cliente, include = defaultInclude) {
    return prisma.cita.findMany({
      where: { id_cliente: parseInt(id_cliente) },
      include: {
        ...include,
        cliente: false,
      },
    });
  }

  /**
   * Get all appointments for a specific automobile.
   * @param {number} id_auto - The automobile ID.
   * @param {Object} [include] - Optional include object.
   * @returns {Promise<Appointment[]>} Array of automobile's appointments.
   */
  async findByAutomobile(id_auto, include = defaultInclude) {
    return prisma.cita.findMany({
      where: { id_auto: parseInt(id_auto) },
      include: {
        ...include,
        automovil: false, 
      },
    });
  }
}

module.exports = new CitaRepository();