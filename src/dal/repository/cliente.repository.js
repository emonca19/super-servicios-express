const prisma = require('../prisma-client');

const defaultInclude = {
  automoviles: true, 
};

/**
 * Repository to handle CRUD operations for the Client entity.
 * Client(id_client PK, name, phone, email UNIQUE, address)
 */
class ClientRepository {

  /**
   * Get clients with filters, pagination, and sorting.
   * @param {Object} [filters={}] - Filtering criteria (e.g., name, email).
   * @param {Object} [options={}] - Pagination and sorting (skip, take, orderBy).
   * @returns {Promise<Cliente[]>} List of clients.
   */
  async findMany(filters = {}, options = {}) {
    const { name, email, phone } = filters;
    const { skip = 0, take = 50, orderBy = { id_cliente: 'asc' }, include = defaultInclude } = options;

    return prisma.cliente.findMany({
      where: {
        ...(name ? { nombre: { contains: name, mode: 'insensitive' } } : {}),
        ...(email ? { email: { contains: email, mode: 'insensitive' } } : {}),
        ...(phone ? { telefono: { contains: phone, mode: 'insensitive' } } : {}),
      },
      skip,
      take,
      orderBy,
      include,
    });
  }

  /**
   * Get a client by their ID.
   * @param {number} id_client - The unique ID of the client.
   * @param {Object} [include=defaultInclude] - Relations to include.
   * @returns {Promise<Cliente | null>} The found client or null.
   */
  async findById(id_client, include = defaultInclude) {
    return prisma.cliente.findUnique({
      where: { id_cliente: Number(id_client) },
      include,
    });
  }

  /**
   * Create a new client.
   * @param {Object} data - Client data: { name, phone, email, address }.
   * @param {Object} [include=defaultInclude] - Relations to include.
   * @returns {Promise<Cliente>} The newly created client.
   */
  async create(data, include = defaultInclude) {
    // Mapeo explícito para seguridad
    return prisma.cliente.create({
      data: {
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        direccion: data.direccion,
      },
      include,
    });
  }

  /**
   * Update an existing client's information (partial update).
   * @param {number} id_client - The unique ID of the client to update.
   * @param {Object} data - Data to update (e.g.: { phone, address }).
   * @param {Object} [include=defaultInclude] - Relations to include.
   * @returns {Promise<Cliente>} The updated client.
   */
  async update(id_client, data, include = defaultInclude) {
    // Lógica de actualización parcial para evitar borrar datos
    return prisma.cliente.update({
      where: { id_cliente: Number(id_client) },
      data: {
        ...(data.nombre !== undefined ? { nombre: data.nombre } : {}),
        ...(data.telefono !== undefined ? { telefono: data.telefono } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.direccion !== undefined ? { direccion: data.direccion } : {}),
      },
      include,
    });
  }

  /**
   * Delete a client by their ID.
   * @param {number} id_client - The unique ID of the client to delete.
   * @returns {Promise<Cliente>} The deleted client.
   */
  async delete(id_client) {
    return prisma.cliente.delete({
      where: { id_cliente: Number(id_client) },
    });
  }

  /**
   * Find a client by their email address.
   * @param {string} email - The unique email of the client.
   * @param {Object} [include=defaultInclude] - Relations to include.
   * @returns {Promise<Cliente | null>} The client or null.
   */
  async findByEmail(email, include = defaultInclude) {
    return prisma.cliente.findUnique({
      where: { email: email },
      include,
    });
  }
}


module.exports = new ClientRepository();