const prisma = require('../prisma-client');

/**
 * Repository to handle the relationship between appointments and services (DetalleCita).
 * Manages services associated with appointments.
 */
class ServicioCitaRepository {

  /**
   * Get all service-appointment records.
   * @returns {Promise<DetalleCita[]>} Array of all records with appointment and service info.
   */
  async findAll() {
    return prisma.detalleCita.findMany({
      include: { cita: true, servicio: true }
    });
  }

  /**
   * Get a service-appointment record by its ID.
   * @param {number} id_detalleCita - The detail ID.
   * @returns {Promise<DetalleCita|null>} The record with relations or null.
   */
  async findById(id_detalleCita) {
    return prisma.detalleCita.findUnique({
      where: { id_detalleCita: parseInt(id_detalleCita) },
      include: { cita: true, servicio: true }
    });
  }

  /**
   * Get all services for a specific appointment.
   * @param {number} id_cita - The appointment ID.
   * @returns {Promise<DetalleCita[]>} Array of services for that appointment.
   */
  async findByAppointment(id_cita) {
    return prisma.detalleCita.findMany({
      where: { id_cita: parseInt(id_cita) },
      include: { servicio: true }
    });
  }

  /**
   * Add a service to an appointment.
   * @param {number} id_cita - The appointment ID.
   * @param {number} id_servicio - The service ID.
   * @param {Object} [data={}] - Optional data (notas, precio_final, suministros_usados).
   * @returns {Promise<DetalleCita>} The created record with appointment and service info.
   */
  async addServiceToAppointment(id_cita, id_servicio, data = {}) {
    return prisma.detalleCita.create({
      data: {
        id_cita: parseInt(id_cita),
        id_servicio: parseInt(id_servicio),
        // Mapeo explícito para seguridad (evita ...extras)
        notas: data.notas,
        precio_final: data.precio_final,
        suministros_usados: data.suministros_usados,
      },
      include: { cita: true, servicio: true }
    });
  }

  /**
   * Update a service-appointment record (partial update).
   * @param {number} id_detalleCita - The detail ID to update.
   * @param {Object} data - Fields to update (e.g., notas, precio_final).
   * @returns {Promise<DetalleCita>} The updated record.
   */
  async update(id_detalleCita, data) {
    return prisma.detalleCita.update({
      where: { id_detalleCita: parseInt(id_detalleCita) },
      // Lógica de actualización parcial segura (la que tenías antes)
      data: {
        ...(data.notas !== undefined ? { notas: data.notas } : {}),
        ...(data.precio_final !== undefined ? { precio_final: data.precio_final } : {}),
        ...(data.suministros_usados !== undefined ? { suministros_usados: data.suministros_usados } : {}),
        // No permitimos actualizar id_cita o id_servicio desde aquí
      },
      include: { cita: true, servicio: true }
    });
  }

  /**
   * Delete a service from an appointment by detail ID.
   * @param {number} id_detalleCita - The detail ID to delete.
   * @returns {Promise<DetalleCita>} The deleted record.
   */
  async delete(id_detalleCita) {
    return prisma.detalleCita.delete({
      where: { id_detalleCita: parseInt(id_detalleCita) }
    });
  }

  /**
   * Delete all services from an appointment.
   * @param {number} id_cita - The appointment ID to clear services from.
   * @returns {Promise<{count: number}>} Number of deleted rows.
   */
  async deleteByAppointment(id_cita) {
    return prisma.detalleCita.deleteMany({
      where: { id_cita: parseInt(id_cita) }
    });
  }
}

module.exports = new ServicioCitaRepository();