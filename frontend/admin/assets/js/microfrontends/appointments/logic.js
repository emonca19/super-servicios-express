import { api } from "../../../services/api.js";

const Utils = {
  formatTime: (dateString) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  }
};

const extractArray = (res) => {
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.data)) return res.data;
  if (res && Array.isArray(res.result)) return res.result;
  return [];
};

export const AppointmentsLogic = {

  FILTERS: {
    ALL: "all",
    TODAY: "today",
    WEEK: "week",
    OVERDUE: "overdue",
  },

  async fetchAppointments() {
    try {
      const [citasRes, clientesRes, autosRes] = await Promise.all([
        api.citas.obtenerTodos(),
        api.clientes.obtenerTodos(),
        api.automoviles.obtenerTodos()
      ]);

      const citasRaw = extractArray(citasRes);
      const clientesRaw = extractArray(clientesRes);
      const autosRaw = extractArray(autosRes);

      const clientesMap = new Map(clientesRaw.map(c => [c.id_cliente || c.id, c]));
      const autosMap = new Map(autosRaw.map(a => [a.id_auto || a.id, a]));

      return citasRaw.map(cita => {
        const idCliente = cita.id_cliente || cita.idCliente;
        const idAuto = cita.id_auto || cita.idAuto;

        const cliente = clientesMap.get(idCliente);
        const auto = autosMap.get(idAuto);

        return {
          id: cita.id_cita || cita.id,
          date: cita.inicio, 
          displayTime: Utils.formatTime(cita.inicio),
          client: cliente ? cliente.nombre : `Cliente #${idCliente}`,
          clientExtra: cliente ? cliente.telefono : "",
          vehicle: auto ? `${auto.marca} ${auto.modelo}` : "Auto desconocido",
          plate: auto ? auto.placas : "--",
          service: cita.motivo || "Servicio General",
          status: cita.estado ? cita.estado.toLowerCase() : "pending",
          rawPrice: Number(cita.total_estimado || 0)
        };
      }).map(this.decorateStatus);

    } catch (error) {
      console.error("Error cargando citas:", error);
      return [];
    }
  },

  decorateStatus(app) {
    let statusLabel = "Pendiente";
    let statusClass = "pending";
    const st = app.status ? app.status.toLowerCase() : "";

    if (st.includes("proceso") || st.includes("confirmada")) {
      statusLabel = "En Proceso";
      statusClass = "in-process";
    } else if (st.includes("completada") || st.includes("finalizada")) {
      statusLabel = "Completada";
      statusClass = "completed";
    } else if (st.includes("cancelada")) {
      statusLabel = "Cancelada";
      statusClass = "cancelled"; 
    }

    return { ...app, statusLabel, statusClass };
  },

  filterAppointments(appointments, filterKey) {
    const filter = filterKey || this.FILTERS.ALL;
    const now = new Date();
    const startOfToday = new Date(now.setHours(0,0,0,0));
    const endOfToday = new Date(now.setHours(23,59,59,999));

    const startOfWeek = new Date(startOfToday);
    const day = startOfWeek.getDay() || 7; 
    if (day !== 1) startOfWeek.setHours(-24 * (day - 1));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return appointments.filter(a => {
      const d = new Date(a.date);

      switch (filter) {
        case this.FILTERS.TODAY:
          return d >= startOfToday && d <= endOfToday;
        case this.FILTERS.WEEK:
          return d >= startOfWeek && d <= endOfWeek;
        case this.FILTERS.OVERDUE:
          return d < startOfToday && a.statusClass !== "completed";
        case this.FILTERS.ALL:
        default:
          return true;
      }
    });
  }
};