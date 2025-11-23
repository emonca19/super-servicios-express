// assets/js/services/dashboard.service.js

import apiClient from "./api-client.js";

/**
 * Servicio para obtener datos del panel de administración
 * (resumen del día, citas de hoy, etc.)
 *
 * AJUSTA las rutas según tu API real.
 */
class DashboardService {
  constructor() {
    this.apiClient = apiClient;
  }

  /**
   * Resumen del día (citas, ingresos, clientes nuevos, ocupación, etc.)
   * Ejemplo de endpoints posibles:
   *   GET /dashboard/resumen
   */
  async getTodaySummary() {
    const res = await this.apiClient.get("/dashboard/resumen");

    // Normalización flexible según lo que devuelva tu API
    const data = res?.data || res?.result || res || {};

    return {
      appointmentsToday: Number(data.citas_hoy ?? data.appointments_today ?? 0),
      appointmentsDiff: Number(data.citas_diferencia ?? data.appointments_diff ?? 0),
      incomeToday: Number(data.ingresos_hoy ?? data.income_today ?? 0),
      incomeVariation: Number(
        data.ingresos_variacion ?? data.income_variation ?? 0
      ),
      newClients: Number(data.clientes_nuevos ?? data.new_clients ?? 0),
      occupancy: Number(data.ocupacion ?? data.occupancy ?? 0),
      occupancyLabel:
        data.ocupacion_label ??
        data.occupancy_label ??
        "Capacidad actual",
    };
  }

  /**
   * Citas del día actual.
   * Ejemplo de endpoint:
   *   GET /citas?fecha=YYYY-MM-DD
   */
  async getTodayAppointments() {
    const today = new Date().toISOString().slice(0, 10);
    const res = await this.apiClient.get("/citas", { fecha: today });

    const list = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.result)
      ? res.result
      : Array.isArray(res)
      ? res
      : [];

    return list.map((cita) => ({
      id: cita.id_cita ?? cita.id ?? cita._id ?? null,
      hora: cita.hora ?? cita.fecha_hora ?? "",
      cliente: cita.cliente ?? cita.nombre_cliente ?? "",
      vehiculo:
        cita.vehiculo ??
        cita.auto ??
        `${cita.marca ?? ""} ${cita.modelo ?? ""} ${
          cita.placas ? "- " + cita.placas : ""
        }`.trim(),
      servicio: cita.servicio ?? cita.nombre_servicio ?? "",
      estado: (cita.estado ?? "pendiente").toLowerCase(),
    }));
  }

  /**
   * Cambiar estado de una cita (opcional, por si luego lo usas
   * al dar clic en "Completar", "Cancelar", etc.)
   */
  async updateAppointmentStatus(idCita, nuevoEstado) {
    if (!idCita) throw new Error("idCita requerido");
    const payload = { estado: nuevoEstado };
    const res = await this.apiClient.patch(`/citas/${idCita}`, payload);
    return res?.data ?? res;
  }
}

export { DashboardService };
export default DashboardService;
