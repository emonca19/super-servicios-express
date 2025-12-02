import { api } from "../../../services/api.js";

const extractArray = (res) => {
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.data)) return res.data;
  return [];
};

export const ClientsLogic = {
  
  async fetchClients() {
    try {
      const res = await api.clientes.obtenerTodos();
      const data = extractArray(res);
      
      return data.map(c => ({
        id: c.id_cliente || c.id,
        nombre: c.nombre,
        telefono: c.telefono,
        email: c.email,
        direccion: c.direccion,
        vehiculos: "Ver detalles", 
        ultimasCitas: "--"
      }));
    } catch (error) {
      console.error("Error clientes:", error);
      return [];
    }
  },

  filter(clients, searchText) {
    if (!searchText) return clients;
    const q = searchText.toLowerCase().trim();
    return clients.filter(c => {
      return [c.nombre, c.telefono, c.email]
      .filter(Boolean)
      .some(field => field.toLowerCase().includes(q));
    });
  },

  async getClientById(id) {
    try {
      console.log(`[Logic] Buscando cliente ID: ${id}`);
      const response = await api.clientes.obtenerPorId(id);
      
      const client = response.data || response;
      
      if (!client) throw new Error("Cliente no encontrado o respuesta vacía");
      
      return client;
    } catch (error) {
      console.error("[Logic] Error getClientById:", error);
      throw error;
    }
  },

  async updateClient(id, data) {
    try {
      console.log(`[Logic] Actualizando cliente ID: ${id}`, data);
      await api.clientes.actualizar(id, data);
      return true;
    } catch (error) {
      console.error("[Logic] Error updateClient:", error);
      throw error;
    }
  }
};