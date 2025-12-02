import { api } from "../../../services/api.js";

const extractArray = (res) => {
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.data)) return res.data;
  return [];
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
      [v.marca, v.modelo, v.placas, v.propietario, v.color, String(v.anio)]
      .filter(Boolean)
      .some(field => field.toLowerCase().includes(q))
    );
  }
};