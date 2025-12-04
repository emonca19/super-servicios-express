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

export const VehiclesLogic = {
  async fetchVehicles() {
    try {
      const [autosRes, clientesRes] = await Promise.all([
        api.automoviles.obtenerTodos(),
        api.clientes.obtenerTodos()
      ]);

      const autos = extractArray(autosRes);
      const clientes = extractArray(clientesRes);

      const clientesMap = new Map(clientes.map(c => [c.id_cliente || c.id, c.nombre]));

      return autos.map(a => ({
        id: a.id_auto || a.id,
        marca: a.marca,
        modelo: a.modelo,
        placas: a.placas,
        id_cliente: a.id_cliente,
        propietario: clientesMap.get(a.id_cliente) || `ID: ${a.id_cliente}`,
        color: a.color,
        anio: a.anio,
        numero_serie: a.numero_serie
      }));
    } catch (error) {
      console.error("Error vehiculos:", error);
      return [];
    }
  },

  async fetchClientsOptions() {
    try {
      const res = await api.clientes.obtenerTodos();
      const data = extractArray(res);
      return data.map(c => ({
        id: c.id_cliente || c.id,
        nombre: c.nombre
      }));
    } catch (e) {
      return [];
    }
  },

  filter(list, text) {
    if (!text) return list;
    const q = text.toLowerCase().trim();
    return list.filter(v =>
      [v.marca, v.modelo, v.placas, v.propietario, v.color, String(v.anio)]
      .filter(Boolean)
      .some(field => field.toLowerCase().includes(q))
    );
  },

  async getVehicleById(id) {
    try {
      console.log(`[Logic] Buscando auto ID: ${id}`);
      const response = await api.automoviles.obtenerPorId(id);
      const auto = extractObject(response);
      if (!auto) throw new Error("Auto no encontrado");
      return auto;
    } catch (error) {
      console.error("[Logic] Error getVehicleById:", error);
      throw error;
    }
  },

  async createVehicle(data) {
    try {
      console.log("[Logic] Creando auto:", data);
      // Aseguramos que id_cliente sea número
      if(data.id_cliente) data.id_cliente = Number(data.id_cliente);
      
      const res = await api.automoviles.crear(data);
      return extractObject(res);
    } catch (error) {
      console.error("[Logic] Error createVehicle:", error);
      throw error;
    }
  },

  async updateVehicle(id, data) {
    try {
      console.log(`[Logic] Actualizando auto ID: ${id}`, data);
      if(data.id_cliente) data.id_cliente = Number(data.id_cliente);
      
      await api.automoviles.actualizar(id, data);
      return true;
    } catch (error) {
      console.error("[Logic] Error updateVehicle:", error);
      throw error;
    }
  },

  async deleteVehicle(id) {
    try {
      console.log(`[Logic] Eliminando auto ID: ${id}`);
      await api.automoviles.eliminar(id);
      return true;
    } catch (error) {
      console.error("[Logic] Error deleteVehicle:", error);
      throw error;
    }
  }

};