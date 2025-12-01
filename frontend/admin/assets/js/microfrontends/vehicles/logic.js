import { api } from "../../../services/api.js";

export const VehiclesLogic = {

  async fetchVehicles() {
    try {
      const [autos, clientes] = await Promise.all([
        api.automoviles.obtenerTodos(),
        api.clientes.obtenerTodos()
      ]);

      const clientesMap = new Map(clientes.map(c => [c.id, c.nombre]));

      return autos.map(a => ({
        id: a.id,
        marca: a.marca,
        modelo: a.modelo,
        placas: a.placas,
        propietario: clientesMap.get(a.id_cliente) || `ID: ${a.id_cliente}`,
        color: a.color,
        anio: a.anio
      }));
    } catch (error) {
      console.error("Error vehiculos:", error);
      return [];
    }
  },

  filter(list, text) {
    if (!text) return list;

    const q = text.toLowerCase().trim();

    return list.filter(v =>
      [
        v.marca,
        v.modelo,
        v.placas,
        v.propietario,
        v.color,
        v.anio
      ]
      .filter(Boolean)
      .some(field => field.toLowerCase().includes(q))
    );
  }
};