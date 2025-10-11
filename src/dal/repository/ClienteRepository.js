
const prisma = require('../prisma-client');

/**
 * Repositorio para manejar las operaciones CRUD de la entidad Cliente.
 * Cliente(id_cliente PK, nombre, telefono, email UNIQUE, direccion)
 */
class ClienteRepository {

    /**
     * Obtiene todos los clientes de la base de datos.
     * @returns {Promise<Cliente[]>} Lista de todos los clientes.
     */
    async obtenerTodos() {
        return prisma.cliente.findMany();
    }

    /**
     * Obtiene un cliente por su ID.
     * @param {number} id_cliente - El ID único del cliente.
     * @returns {Promise<Cliente | null>} El cliente encontrado o null si no existe.
     */
    async obtenerPorId(id_cliente) {
        return prisma.cliente.findUnique({
            where: { id_cliente: parseInt(id_cliente) },
            // Incluye los automóviles asociados al cliente (relación 1:M)
            include: {
                automoviles: true 
            }
        });
    }

    /**
     * Crea un nuevo cliente.
     * @param {Object} datosCliente - Datos del cliente: { nombre, telefono, email, direccion }.
     * @returns {Promise<Cliente>} El nuevo cliente creado.
     */
    async crear(datosCliente) {
        // Prisma maneja automáticamente las restricciones UNIQUE (email)
        return prisma.cliente.create({
            data: datosCliente,
        });
    }

    /**
     * Actualiza la información de un cliente existente.
     * @param {number} id_cliente - El ID único del cliente a actualizar.
     * @param {Object} datosActualizados - Datos a actualizar (ej: { telefono, direccion }).
     * @returns {Promise<Cliente>} El cliente actualizado.
     */
    async actualizar(id_cliente, datosActualizados) {
        return prisma.cliente.update({
            where: { id_cliente: parseInt(id_cliente) },
            data: datosActualizados,
        });
    }

    /**
     * Elimina un cliente por su ID.
     * NOTA: Requiere que no haya registros de Automovil o Cita relacionados.
     * @param {number} id_cliente - El ID único del cliente a eliminar.
     * @returns {Promise<Cliente>} El cliente eliminado.
     */
    async eliminar(id_cliente) {
        return prisma.cliente.delete({
            where: { id_cliente: parseInt(id_cliente) },
        });
    }

    /**
     * Busca un cliente por su dirección de correo electrónico.
     * @param {string} email - El email único del cliente.
     * @returns {Promise<Cliente | null>} El cliente o null.
     */
    async obtenerPorEmail(email) {
        return prisma.cliente.findUnique({
            where: { email: email },
        });
    }
}

module.exports = new ClienteRepository();