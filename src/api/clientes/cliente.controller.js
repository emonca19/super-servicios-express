const { success, error } = require('../../utils/response');
const asyncHandler = require('../../utils/async-handler');
const ClienteRepository = require('../../dal/repository/cliente.repository');

const clienteRepository = new ClienteRepository();

const getAllClientes = asyncHandler(async (req, res) => {
  const clientes = await clienteRepository.findAll();
  success(res, clientes);
});

const getClienteById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cliente = await clienteRepository.findById(id);
  if (!cliente) {
    return error(res, 'Cliente no encontrado', 404);
  }
  success(res, cliente);
});

const createCliente = asyncHandler(async (req, res) => {
  const data = req.body;
  const newCliente = await clienteRepository.create(data);
  success(res, newCliente, 201);
});

const updateCliente = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const updatedCliente = await clienteRepository.update(id, data);
  success(res, updatedCliente);
});

const deleteCliente = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await clienteRepository.delete(id);
  success(res, null, 204);
});

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
};