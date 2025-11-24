export const AppointmentsLogic = {

  FILTERS: {
    ALL: "all",
    TODAY: "today",
    WEEK: "week",
    OVERDUE: "overdue",
  },

  async fetchAppointments() {
    const today = new Date();

    const base = (h, m = 0) => {
      const d = new Date(today);
      d.setHours(h, m, 0, 0);
      return d.toISOString();
    };

    return [
      {
        id: 1,
        date: base(9, 0),
        displayTime: "09:00 AM",
        client: "Juan García",
        clientExtra: "",
        vehicle: "Honda Civic",
        plate: "ABC-1234",
        service: "Cambio de Aceite",
        status: "pending",
      },
      {
        id: 2,
        date: base(10, 30),
        displayTime: "10:30 AM",
        client: "María López",
        vehicle: "Ford F-150",
        plate: "XYZ-5678",
        service: "Frenos",
        status: "in-process",
      },
      {
        id: 3,
        date: (() => {
          const d = new Date(today);
          d.setDate(d.getDate() - 1);
          d.setHours(11, 0, 0, 0);
          return d.toISOString();
        })(),
        displayTime: "11:00 AM",
        client: "Carlos Méndez",
        vehicle: "Toyota Corolla",
        plate: "MNO-9012",
        service: "Eléctrico",
        status: "completed",
      },
      {
        id: 4,
        date: base(14, 15),
        displayTime: "02:15 PM",
        client: "Ana Rodríguez",
        vehicle: "Nissan Sentra",
        plate: "PQR-3456",
        service: "Transmisión",
        status: "pending",
      },
      {
        id: 5,
        date: (() => {
          const d = new Date(today);
          d.setDate(d.getDate() + 2);
          d.setHours(15, 45, 0, 0);
          return d.toISOString();
        })(),
        displayTime: "03:45 PM",
        client: "Roberto Silva",
        vehicle: "Chevrolet Malibu",
        plate: "STU-7890",
        service: "Aire Acondicionado",
        status: "in-process",
      },
    ].map(this.decorateStatus);
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
