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
 }
};