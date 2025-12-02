// assets/js/microfrontends/users/logic.js
import { api } from "../../../services/api.js";

const extractArray = (res) => {
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.data)) return res.data;
  return [];
};

const extractObject = (res) => {
  if (!res) return null;
  if (res.data && typeof res.data === "object") return res.data;
  if (typeof res === "object") return res;
  return null;
};

export const ClientsLogic = {
  // =========================
  // LISTAR
  // =========================
   async fetchClients() {
    try {
      const res = await api.clientes.obtenerTodos();
      const data = extractArray(res);

      return data.map((c) => ({
        id: c.id_cliente || c.id,
        nombre: c.nombre,
        telefono: c.telefono,
        email: c.email,
        direccion: c.direccion,
        vehiculos: c.vehiculos_descripcion || "Ver detalles",
        ultimasCitas: c.ultima_cita || c.ultimaCita || c.last_appointment || "--",
      }));
    } catch (error) {
      console.error("[Logic] Error clientes:", error);
      return [];
    }
  },

  // =========================
  // FILTRO BUSCADOR
  // =========================
  filter(clients, searchText) {
    if (!searchText) return clients;
    const q = searchText.toLowerCase().trim();

    return clients.filter((c) =>
      [c.nombre, c.telefono, c.email]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  },

  // =========================
  // OBTENER POR ID
  // =========================
  async getClientById(id) {
    try {
      console.log(`[Logic] Buscando cliente ID: ${id}`);
      const response = await api.clientes.obtenerPorId(id);

      const client = extractObject(response);

      if (!client) throw new Error("Cliente no encontrado o respuesta vacía");

      return client;
    } catch (error) {
      console.error("[Logic] Error getClientById:", error);
      throw error;
    }
  },

  // =========================
  // ACTUALIZAR
  // =========================
  async updateClient(id, data) {
    try {
      console.log(`[Logic] Actualizando cliente ID: ${id}`, data);

      const payload = {
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        direccion: data.direccion,
      };

      await api.clientes.actualizar(id, payload);
      return true;
    } catch (error) {
      console.error("[Logic] Error updateClient:", error);
      throw error;
    }
  },

  // =========================
  // CREAR (para el modal "Nuevo Cliente")
  // =========================
  async createClient(data) {
    try {
      console.log("[Logic] Creando cliente:", data);

      const payload = {
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        direccion: data.direccion,
      };

      // JSON enviado:
      // {
      //   "nombre": "Maria Perez",
      //   "telefono": "55513231567",
      //   "email": "maria.perez23@example.com",
      //   "direccion": "Calle Falsa 123"
      // }
      const res = await api.clientes.crear(payload);
      return extractObject(res) || payload;
    } catch (error) {
      console.error("[Logic] Error createClient:", error);
      throw error;
    }
  },

  // =========================
  // ELIMINAR (para el botón "Eliminar")
  // =========================
  async deleteClient(id) {
    try {
      console.log(`[Logic] Eliminando cliente ID: ${id}`);
      await api.clientes.eliminar(id);
      return true;
    } catch (error) {
      console.error("[Logic] Error deleteClient:", error);
      throw error;
    }
  },
};
