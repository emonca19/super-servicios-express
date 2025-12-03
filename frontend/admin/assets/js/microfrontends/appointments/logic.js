import { api } from "../../../services/api.js";

const Utils = {
  formatTime: (dateString) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  },
  extractArray: (res) => {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    if (res && Array.isArray(res.result)) return res.result;
    return [];
  },
  extractObject: (res) => {
    if (!res) return null;
    if (res.data && typeof res.data === "object") return res.data;
    if (typeof res === "object") return res;
    return null;
  }
};

export const AppointmentsLogic = {
  FILTERS: { ALL: "all", TODAY: "today", WEEK: "week", OVERDUE: "overdue" },

  async fetchAppointments() {
    try {
      const [citasRes, clientesRes, autosRes] = await Promise.all([
        api.citas.obtenerTodos(),
        api.clientes.obtenerTodos(),
        api.automoviles.obtenerTodos()
      ]);

      const citasRaw = Utils.extractArray(citasRes);
      const clientesRaw = Utils.extractArray(clientesRes);
      const autosRaw = Utils.extractArray(autosRes);

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

  async fetchOptions() {
    try {
        const [clientes, autos, servicios] = await Promise.all([
            api.clientes.obtenerTodos(),
            api.automoviles.obtenerTodos(),
            api.servicios.obtenerTodos()
        ]);
        return {
            clients: Utils.extractArray(clientes),
            vehicles: Utils.extractArray(autos),
            services: Utils.extractArray(servicios)
        };
    } catch (e) {
        console.error("Error cargando opciones:", e);
        return { clients: [], vehicles: [], services: [] };
    }
  },

  async getAppointmentById(id) {
    try {
        const res = await api.citas.obtenerPorId(id);
        const cita = Utils.extractObject(res);
        if(!cita) throw new Error("Cita no encontrada");
        return cita;
    } catch (e) {
        throw e;
    }
  },

  async createAppointment(data) {
    try {
        const inicio = new Date(`${data.fecha}T${data.hora}:00`);
        const fin = new Date(inicio.getTime() + (60 * 60 * 1000)); 

        const payload = {
            id_cliente: Number(data.id_cliente),
            id_auto: Number(data.id_auto),
            inicio: inicio.toISOString(),
            fin: fin.toISOString(),
            estado: data.estado || "PENDIENTE",
            motivo: data.motivo || "Servicio General",
            observaciones: data.observaciones,
            detalles: [
                {
                    id_servicio: Number(data.id_servicio),
                    notas: data.observaciones,
                    suministros: "",
                    precio_por_servicio: parseFloat(data.precio || 0)
                }
            ]
        };
        
        await api.citas.crear(payload);
        return true;
    } catch (e) {
        console.error("Error creating appointment:", e);
        throw e;
    }
  },

  async updateAppointment(id, data) {
    try {
        const inicio = new Date(`${data.fecha}T${data.hora}:00`);
        const fin = new Date(inicio.getTime() + (60 * 60 * 1000)); 

        const payload = {
            id_cliente: Number(data.id_cliente),
            id_auto: Number(data.id_auto),
            inicio: inicio.toISOString(),
            fin: fin.toISOString(),
            estado: data.estado,
            motivo: data.motivo,
            observaciones: data.observaciones,
            detalles: [
                {
                    id_servicio: Number(data.id_servicio),
                    notas: data.observaciones,
                    suministros: "",
                    precio_por_servicio: parseFloat(data.precio || 0)
                }
            ]
        };

        console.log("[Logic] Enviando Update:", payload); // Debug para ver qué enviamos
        await api.citas.actualizar(id, payload);
        return true;
    } catch (e) {
        throw e;
    }
  },

  async deleteAppointment(id) {
    try {
        await api.citas.eliminar(id);
        return true;
    } catch (e) {
        throw e;
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
        case this.FILTERS.TODAY: return d >= startOfToday && d <= endOfToday;
        case this.FILTERS.WEEK: return d >= startOfWeek && d <= endOfWeek;
        case this.FILTERS.OVERDUE: return d < startOfToday && a.statusClass !== "completed";
        case this.FILTERS.ALL: default: return true;
      }
    });
  }
};