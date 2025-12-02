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

export const ServicesLogic = {
  
  async fetchServices() {
    try {
      const res = await api.servicios.obtenerTodos();
      const rawServices = extractArray(res);

      return rawServices.map(s => ({
        id: s.id_servicio || s.id,
        nombre: s.nombre,
        descripcion: s.descripcion,
        duracion: `${s.duracion_estimada} min`,
        precio: new Intl.NumberFormat('es-MX', { 
            style: 'currency', 
            currency: 'MXN' 
        }).format(s.precio_con_utilidad),
        rawPrice: s.precio_con_utilidad,
        rawDuration: s.duracion_estimada,
        disponible: true 
      }));

    } catch (error) {
      console.error("[ServicesLogic] Error:", error);
      return [];
    }
  },

  filter(services, text) {
    if (!text) return services;
    const q = text.toLowerCase().trim();
    return services.filter(s =>
      [s.nombre, s.descripcion, s.duracion, s.precio]
      .filter(Boolean)
      .some(field => String(field).toLowerCase().includes(q))
    );
  },

  async getServiceById(id) {
    try {
      console.log(`[Logic] Buscando servicio ID: ${id}`);
      const response = await api.servicios.obtenerPorId(id);
      const service = extractObject(response);
      if (!service) throw new Error("Servicio no encontrado");
      return service;
    } catch (error) {
      console.error("[Logic] Error getServiceById:", error);
      throw error;
    }
  },

  async createService(data) {
    try {
      console.log("[Logic] Creando servicio:", data);
      const payload = {
        ...data,
        duracion_estimada: Number(data.duracion_estimada),
        precio_con_utilidad: parseFloat(data.precio_con_utilidad)
      };
      const res = await api.servicios.crear(payload);
      return extractObject(res);
    } catch (error) {
      console.error("[Logic] Error createService:", error);
      throw error;
    }
  },

  async updateService(id, data) {
    try {
      console.log(`[Logic] Actualizando servicio ID: ${id}`, data);
      const payload = {
        ...data,
        duracion_estimada: Number(data.duracion_estimada),
        precio_con_utilidad: parseFloat(data.precio_con_utilidad)
      };
      await api.servicios.actualizar(id, payload);
      return true;
    } catch (error) {
      console.error("[Logic] Error updateService:", error);
      throw error;
    }
  },

  async deleteService(id) {
    try {
      console.log(`[Logic] Eliminando servicio ID: ${id}`);
      await api.servicios.eliminar(id);
      return true;
    } catch (error) {
      console.error("[Logic] Error deleteService:", error);
      throw error;
    }
  }
};