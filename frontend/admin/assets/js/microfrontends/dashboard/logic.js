export const DashboardLogic = {

     adaptDashboardResponse(api) {
    return {
      citasHoy: api.citasHoy ?? 0,
      citasDelta: api.citasDelta ?? 0,
      ingresos: api.ingresos ?? 0,
      ingresosDelta: api.ingresosDelta ?? 0,
      clientesNuevos: api.clientesNuevos ?? 0,
      ocupacion: api.ocupacion ?? 0,
    };
  },

  adaptCitasResponse(apiList) {
    return apiList.map(item => ({
      hora: item.hora,
      cliente: item.cliente,
      vehiculo: item.vehiculo,
      servicio: item.servicio,
      estado: item.estado,
      acciones: null
    }));
  },

 
  formatHour(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      console.warn("[DashboardLogic] Error formateando hora:", error);
      return "—";
    }
  },

  
  formatCurrency(amount) {
    try {
      return amount.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 0
      });
    } catch (error) {
      console.warn("[DashboardLogic] Error formateando moneda:", error);
      return "$0";
    }
  },

  normalizeEstado(estado) {
    const map = {
      completada: "Completada",
      "en-proceso": "En Proceso",
      pendiente: "Pendiente"
    };

    return map[estado?.toLowerCase()] ?? "Pendiente";
  },


  getEstadoClass(estado) {
    const safe = estado?.toLowerCase() ?? "";

    if (safe.includes("complet")) return "completada";
    if (safe.includes("proceso")) return "en-proceso";
    return "pendiente";
  },



  adaptDashboardResponse(apiResponse) {
    try {
      return {
        citasHoy: apiResponse.citasHoy,
        citasDelta: apiResponse.citasDelta,
        ingresos: apiResponse.ingresos,
        ingresosDelta: apiResponse.ingresosDelta,
        clientesNuevos: apiResponse.clientesNuevos,
        ocupacion: apiResponse.ocupacion
      };
    } catch (error) {
      console.error("[DashboardLogic] Error adaptando stats:", error);
      return {};
    }
  },


  adaptCitasResponse(apiCitas) {
    try {
      return apiCitas.map(c => ({
        hora: c.hora,
        cliente: c.cliente,
        vehiculo: `${c.modelo} - ${c.placas}`,
        servicio: c.servicio,
        estado: DashboardLogic.normalizeEstado(c.estado)
      }));
    } catch (error) {
      console.error("[DashboardLogic] Error adaptando citas:", error);
      return [];
    }
  }

};
