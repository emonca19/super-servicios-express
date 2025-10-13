const prisma = require('../prisma-client');

/**
 * Clase para manejar la relacion entre citas y servicios (DetalleCita)
 * basicamente todo lo que tiene que ver con los servicios que van en una cita
 */
class ServicioCitaRepository {

    /**
     * saca todos los registros de servicios en todas las citas
     * @returns {Promise<DetalleCita[]>} devuelve un array con todo, incluyendo info de la cita y el servicio
     */
    async obtenerTodos() {
        return prisma.detalleCita.findMany({
            include: { cita: true, servicio: true } // trae todo de la cita y el servicio
        });
    }

    /**
     * saca todos los servicios que tiene una cita en especifico
     * @param {number} id_cita - el id de la cita que quieres ver
     * @returns {Promise<DetalleCita[]>} devuelve un array con los servicios de esa cita
     */
    async obtenerPorCita(id_cita) {
        return prisma.detalleCita.findMany({
            where: { id_cita: parseInt(id_cita) }, // busca por el id
            include: { servicio: true } // trae los servicios nada mas
        });
    }

    /**
     * agrega un servicio a una cita
     * @param {number} id_cita - la cita a la que le quieres poner el servicio
     * @param {number} id_servicio - el servicio que quieres agregar
     * @param {Object} extras - cosas opcionales tipo notas, precio, suministros
     * @returns {Promise<DetalleCita>} devuelve el registro creado con toda la info de la cita y el servicio
     */
    async agregarServicioACita(id_cita, id_servicio, extras = {}) {
        return prisma.detalleCita.create({
            data: {
                id_cita: parseInt(id_cita),
                id_servicio: parseInt(id_servicio),
                ...extras // si pasas extras los pone aca
            },
            include: { cita: true, servicio: true } // incluye las relaciones
        });
    }

    /**
     * borra un servicio de una cita por su id de detalle
     * @param {number} id_detalleCita - el id del registro que quieres borrar
     * @returns {Promise<DetalleCita>} devuelve el registro que borro
     */
    async eliminar(id_detalleCita) {
        return prisma.detalleCita.delete({
            where: { id_detalleCita: parseInt(id_detalleCita) } // busca y borra
        });
    }

    /**
     * borra todos los servicios de una cita
     * @param {number} id_cita - la cita que quieres limpiar de servicios
     * @returns {Promise<{ count: number }>} devuelve cuantas filas borro
     */
    async eliminarPorCita(id_cita) {
        return prisma.detalleCita.deleteMany({
            where: { id_cita: parseInt(id_cita) } // borra todo de esa cita
        });
    }


    /**
     * obtiene un servicio de una cita por su id_detalleCita
     * @param {number} id_detalleCita
     * @returns {Promise<DetalleCita>}
     */
    async obtenerPorId(id_detalleCita) {
        return prisma.detalleCita.findUnique({
            where: { id_detalleCita: parseInt(id_detalleCita) },
            include: { cita: true, servicio: true }
        });
}

}

module.exports = new ServicioCitaRepository();
