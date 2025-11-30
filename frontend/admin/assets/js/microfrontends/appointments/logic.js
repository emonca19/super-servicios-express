export const AppointmentsLogic = {

  FILTERS: {
    ALL: "all",
    TODAY: "today",
    WEEK: "week",
    OVERDUE: "overdue",
  },

  async fetchAppointments() {
    try {
      const [citasRaw, clientesRaw, autosRaw] = await Promise.all([
        api.citas.obtenerTodos(),
        api.clientes.obtenerTodos(),
        api.automoviles.obtenerTodos()
      ]);

      const clientesMap = new Map(clientesRaw.map(c => [c.id, c]));
      const autosMap = new Map(autosRaw.map(a => [a.id, a]));

      return citasRaw.map(cita => {
        const cliente = clientesMap.get(cita.id_cliente);
        const auto = autosMap.get(cita.id_auto);

        return {
          id: cita.id,
          date: cita.inicio, 
          displayTime: Utils.formatTime(cita.inicio),
          client: cliente ? cliente.nombre : `Cliente #${cita.id_cliente}`,
          clientExtra: cliente ? cliente.telefono : "",
          vehicle: auto ? `${auto.marca} ${auto.modelo}` : "Auto desconocido",
          plate: auto ? auto.placas : "--",
          service: cita.motivo,
          status: cita.estado ? cita.estado.toLowerCase() : "pending",
          rawPrice: cita.total_estimado || 0 
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

    if (app.status === "in-process") {
      statusLabel = "En Proceso";
      statusClass = "in-process";
    } else if (app.status === "completed") {
      statusLabel = "Completada";
      statusClass = "completed";
    }

    return { ...app, statusLabel, statusClass };
  },

  filterAppointments(appointments, filterKey) {
    const filter = filterKey || this.FILTERS.ALL;
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

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
          return d < startOfToday;

        case this.FILTERS.ALL:
        default:
          return true;
      }
    });
  }
};
