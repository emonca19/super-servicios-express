import { api } from "../../../services/api.js";

const extractArray = (res) => {
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.data)) return res.data;
  return [];
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
      .some(field => field.toLowerCase().includes(q))
    );
  }
};