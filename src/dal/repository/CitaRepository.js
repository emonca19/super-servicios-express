const prisma = require('../prisma-client');

/**
 * Clase para manejar todo lo de las citas
 * basicamente CRUD de la tabla cita y traer sus relaciones
 */
class CitaRepository {

    /**
     * obtiene todas las citas que hay en la base de datos
     * @returns {Promise<Cita[]>} un array con todas las citas, incluyendo cliente, auto y servicios
     */
    async obtenerTodas() {
        return prisma.cita.findMany({
            include: {
                cliente: true,
                automovil: true,
                detalles: { include: { servicio: true } } // trae los servicios de cada cita
            }
        });
    }

    /**
     * obtiene una cita por su id
     * @param {number} id_cita - id de la cita que quieres
     * @returns {Promise<Cita|null>} devuelve la cita con todo incluido o null si no existe
     */
    async obtenerPorId(id_cita) {
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
     * crea una cita nueva
     * @param {Object} datosCita - los datos que quieres ponerle a la cita
     * @returns {Promise<Cita>} devuelve la cita creada con todo incluido
     */
    async crear(datosCita) {
        return prisma.cita.create({
            data: datosCita,
            include: {
                cliente: true,
                automovil: true,
                detalles: { include: { servicio: true } }
            }
        });
    }

    /**
     * actualiza una cita existente
     * @param {number} id_cita - id de la cita que quieres actualizar
     * @param {Object} datosActualizados - campos que quieres cambiar
     * @returns {Promise<Cita>} devuelve la cita actualizada con todo incluido
     */
    async actualizar(id_cita, datosActualizados) {
        return prisma.cita.update({
            where: { id_cita: parseInt(id_cita) },
            data: datosActualizados,
            include: {
                cliente: true,
                automovil: true,
                detalles: { include: { servicio: true } }
            }
        });
    }

    /**
     * borra una cita
     * @param {number} id_cita - id de la cita que quieres borrar
     * @returns {Promise<Cita>} devuelve la cita que borro
     */
    async eliminar(id_cita) {
        return prisma.cita.delete({
            where: { id_cita: parseInt(id_cita) }
        });
    }

    /**
     * obtiene todas las citas de un cliente
     * @param {number} id_cliente - id del cliente
     * @returns {Promise<Cita[]>} devuelve un array con las citas del cliente y sus servicios
     */
    async obtenerPorCliente(id_cliente) {
        return prisma.cita.findMany({
            where: { id_cliente: parseInt(id_cliente) },
            include: {
                automovil: true,
                detalles: { include: { servicio: true } }
            }
        });
    }

    /**
     * obtiene todas las citas de un auto
     * @param {number} id_auto - id del auto
     * @returns {Promise<Cita[]>} devuelve un array con las citas del auto y sus servicios
     */
    async obtenerPorAuto(id_auto) {
        return prisma.cita.findMany({
            where: { id_auto: parseInt(id_auto) },
            include: {
                cliente: true,
                detalles: { include: { servicio: true } }
            }
        });
    }
}

module.exports = new CitaRepository();
