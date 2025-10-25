const prisma = require('../prisma-client');

/**
 * Repository to handle CRUD operations for the Cliente entity.
 * Cliente(id_cliente PK, nombre, telefono, email UNIQUE, direccion)
 */
class ClienteRepository {

    /**
     * Get all clients from the database.
     * @returns {Promise<Cliente[]>} List of all clients.
     */
    async findAll() {
        return prisma.cliente.findMany();
    }

    /**
     * Get a client by their ID.
     * @param {number} id_cliente - The unique ID of the client.
     * @returns {Promise<Cliente | null>} The found client or null if not exists.
     */
    async findById(id_cliente) {
        return prisma.cliente.findUnique({
            where: { id_cliente: parseInt(id_cliente) },
            include: {
                automoviles: true 
            }
        });
    }

    /**
     * Create a new client.
     * @param {Object} clientData - Client data: { nombre, telefono, email, direccion }.
     * @returns {Promise<Cliente>} The newly created client.
     */
    async create(clientData) {
        return prisma.cliente.create({
            data: clientData,
        });
    }

    /**
     * Update an existing client's information.
     * @param {number} id_cliente - The unique ID of the client to update.
     * @param {Object} updateData - Data to update (e.g.: { telefono, direccion }).
     * @returns {Promise<Cliente>} The updated client.
     */
    async update(id_cliente, updateData) {
        return prisma.cliente.update({
            where: { id_cliente: parseInt(id_cliente) },
            data: updateData,
        });
    }

    /**
     * Delete a client by their ID.
     * NOTE: Requires no related Automovil or Cita records.
     * @param {number} id_cliente - The unique ID of the client to delete.
     * @returns {Promise<Cliente>} The deleted client.
     */
    async delete(id_cliente) {
        return prisma.cliente.delete({
            where: { id_cliente: parseInt(id_cliente) },
        });
    }

    /**
     * Find a client by their email address.
     * @param {string} email - The unique email of the client.
     * @returns {Promise<Cliente | null>} The client or null.
     */
    async findByEmail(email) {
        return prisma.cliente.findUnique({
            where: { email: email },
        });
    }
}

module.exports = ClienteRepository;
