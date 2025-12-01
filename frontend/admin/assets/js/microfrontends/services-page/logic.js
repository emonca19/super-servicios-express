import { api } from "../../../services/api.js";

// Logica para manejar servicios en la pagina
export const ServicesLogic = {

  // Funcion que obtiene la lista de servicios
  // Aqui se usa una lista fija simulando datos reales
  async fetchServices() {
    try {
      const rawServices = await api.servicios.obtenerTodos();

      return rawServices.map(s => ({
        id: s.id,
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
      console.error("[ServicesLogic] Error al cargar servicios:", error);
      return [];
    }
  },

  // Funcion para filtrar servicios segun texto ingresado
  // (Esta se mantiene igual porque filtra sobre los datos ya transformados)
  filter(services, text) {
    if (!text) return services;

    const q = text.toLowerCase().trim();

    return services.filter(s =>
      [
        s.nombre,
        s.descripcion,
        s.duracion,
        s.precio
      ]
      .filter(Boolean)
      .some(field => field.toLowerCase().includes(q))
    );
  }
};
