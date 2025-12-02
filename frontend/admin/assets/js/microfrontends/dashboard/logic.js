import { AppointmentsLogic } from "../appointments/logic.js";

export const DashboardLogic = {

  async getDashboardData() {
    try {
      const allAppointments = await AppointmentsLogic.fetchAppointments();
      
      const now = new Date();
      const startOfToday = new Date(now.setHours(0,0,0,0));
      const endOfToday = new Date(now.setHours(23,59,59,999));

      const citasHoy = allAppointments.filter(a => {
        const d = new Date(a.date); 
        return d >= startOfToday && d <= endOfToday;
      });

      const ingresosHoy = citasHoy.reduce((acc, curr) => acc + (curr.rawPrice || 0), 0);

      const capacidadDiaria = 15;
      const ocupacion = Math.min(Math.round((citasHoy.length / capacidadDiaria) * 100), 100);

      return {
        stats: {
          citasHoy: citasHoy.length,
          citasDelta: "",
          ingresos: ingresosHoy,
          ingresosDelta: "",
          clientesNuevos: 0, 
          ocupacion: `${ocupacion}%`
        },
        citasRecientes: citasHoy.slice(0, 5) 
      };

    } catch (error) {
      console.error("[DashboardLogic] Error calculando datos:", error);
      throw error;
    }
  },

  adaptDashboardResponse(stats) {
    return {
      citasHoy: stats.citasHoy,
      citasDelta: stats.citasDelta,
      ingresos: this.formatCurrency(stats.ingresos),
      ingresosDelta: stats.ingresosDelta,
      clientesNuevos: stats.clientesNuevos,
      ocupacion: stats.ocupacion,
    };
  },

  adaptCitasResponse(citasProcesadas) {
    return citasProcesadas.map(c => ({
      hora: c.displayTime,     
      cliente: c.client,       
      vehiculo: `${c.vehicle} (${c.plate})`, 
      servicio: c.service,
      estado: {                
        label: c.statusLabel, 
        variant: this.getVariantByStatus(c.statusClass)
      }, 
      acciones: true
    }));
  },

  formatCurrency(amount) {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0
    }).format(amount || 0);
  },

  getVariantByStatus(statusClass) {
    switch (statusClass) {
      case 'completed': return 'success'; 
      case 'in-process': return 'info';  
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  }
};