import { api } from "../../../services/api.js";

export const ClientsLogic = {
  
 async fetchClients() {
    try {
      const data = await api.clientes.obtenerTodos();
      
      return data.map(c => ({
        id: c.id,
        nombre: c.nombre,
        telefono: c.telefono,
        email: c.email,
        direccion: c.direccion,
        // Campos calculados falsos (el backend no los manda aun)
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
    return [
      c.nombre,
      c.telefono,
      c.email,
      c.vehiculos,
      c.ultimasCitas
    ]
    .filter(Boolean) // elimina undefined/null
    .some(field => field.toLowerCase().includes(q));
  });
}

};