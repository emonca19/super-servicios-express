/**
 * Servicio de gestión de citas
 */

import { ApiClient } from './api-client.js';

// helper to create client and car before creating cita

class AppointmentsService {
  constructor() {
    this.apiClient = new ApiClient();
  }

  /**
   * Crear una nueva cita
   * @param {Object} appointmentData - Datos completos de la cita
   * @returns {Promise<Object>}
   */
  async create(appointmentData) {
    try {
      // Flow for backend schema:
      // 1) Ensure cliente exists (create via POST /clientes)
      // 2) Create automovil with id_cliente (POST /automoviles)
      // 3) Create cita with id_cliente, id_auto, inicio, fin, detalles

      // Normalize input
      const phone = (appointmentData.telefono || '').replace(/\D/g, '');

      // 1) create cliente if not provided
      let clienteId = appointmentData.id_cliente;
      if (!clienteId) {
        const clientePayload = {
          nombre: appointmentData.nombre,
          telefono: phone,
          email: appointmentData.email,
          direccion: appointmentData.direccion || ''
        };
        const clienteResp = await this.apiClient.post('/clientes', clientePayload);
        clienteId = clienteResp?.data?.id_cliente || clienteResp?.data?.id || clienteResp?.data?.idCliente;
      }

      // 2) create automovil if not provided
      let autoId = appointmentData.id_auto;
      if (!autoId) {
        const automovilPayload = {
          id_cliente: Number(clienteId),
          placas: (appointmentData.placas || '').toUpperCase() || `TEMP-${Date.now()}-${Math.floor(Math.random()*10000)}`,
          marca: appointmentData.marca || '',
          modelo: appointmentData.modelo || '',
          anio: appointmentData.ano ? Number(appointmentData.ano) : undefined,
          numero_serie: appointmentData.numero_serie || appointmentData.vin || `SN-${Date.now()}-${Math.floor(Math.random()*10000)}`,
          color: appointmentData.color || undefined
        };

        const autoResp = await this.apiClient.post('/automoviles', automovilPayload);
        autoId = autoResp?.data?.id_auto || autoResp?.data?.id || autoResp?.data?.idAuto;
      }

      // 3) build cita payload
      const fecha = appointmentData.fecha;
      const hora = appointmentData.hora || '09:00';
      const inicioDate = new Date(`${fecha}T${hora}:00`);
      if (Number.isNaN(inicioDate.getTime())) {
        throw new Error('Fecha u hora inválida');
      }

      const durationMin = Number(appointmentData.duracion_minutos) || Number(appointmentData.duration) || 60;
      const finDate = new Date(inicioDate.getTime() + durationMin * 60000);

      const detalles = [
        {
          id_servicio: appointmentData.servicio || appointmentData.servicioId || appointmentData.serviceId,
          notas: appointmentData.observaciones || appointmentData.notas || '',
          suministros: appointmentData.suministros || null,
          precio_por_servicio: appointmentData.precio || appointmentData.price || 0,
        },
      ];

      // Coerce id_servicio to integer (backend expects numeric ids). If it's not numeric, throw early.
      for (let i = 0; i < detalles.length; i += 1) {
        const d = detalles[i];
        const sid = Number(d.id_servicio);
        if (Number.isNaN(sid)) {
          throw new Error('Servicio inválido seleccionado');
        }
        d.id_servicio = sid;
      }

      const citaPayload = {
        id_cliente: Number(clienteId),
        id_auto: Number(autoId),
        inicio: inicioDate.toISOString(),
        fin: finDate.toISOString(),
        estado: (appointmentData.estado || 'PENDIENTE').toString().toUpperCase(),
        motivo: appointmentData.motivo || appointmentData.servicioNombre || appointmentData.servicio || 'Servicio Solicitado',
        observaciones: appointmentData.observaciones || appointmentData.notas || '',
        detalles,
      };

      console.log('[AppointmentsService] Creating cita payload:', citaPayload);
      const response = await this.apiClient.post('/citas', citaPayload);
      console.log('[AppointmentsService] Appointment created successfully:', response);
      return response;
    } catch (error) {
      console.error('[AppointmentsService] Error creating appointment:', error);
      throw new Error(error.message || 'No se pudo agendar la cita');
    }
  }

  /**
   * Obtener horarios disponibles para una fecha y servicio
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @param {string} serviceId - ID del servicio
   * @returns {Promise<Array<string>>}
   */
  async getAvailableSlots(date, serviceId) {
    try {
      console.log('[AppointmentsService] Getting slots for:', { date, serviceId });
      
      const slots = await this.apiClient.get('/citas/available-slots', {
        date,
        serviceId,
      });
      
      return slots;
    } catch (error) {
      console.error('[AppointmentsService] Error getting available slots:', error);
      
      // Si el endpoint no existe, devolver horarios por defecto
      if (error.status === 404) {
        return this.getDefaultSlots();
      }
      
      throw new Error('No se pudieron cargar los horarios disponibles');
    }
  }

  /**
   * Horarios por defecto si el backend no tiene el endpoint
   */
  getDefaultSlots() {
    return [
      '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];
  }

  /**
   * Obtener cita por ID
   */
  async getById(id) {
    try {
  const appointment = await this.apiClient.get(`/citas/${id}`);
      return appointment;
    } catch (error) {
      console.error(`[AppointmentsService] Error getting appointment ${id}:`, error);
      throw new Error('No se pudo cargar la cita');
    }
  }

  /**
   * Validar datos de la cita antes de enviar
   */
  validateAppointmentData(data) {
    const errors = [];

    // Validar datos del cliente
    // nombre: require at least 2 characters (allow short names like 'Al')
    if (!data.nombre || data.nombre.trim().length < 2) {
      errors.push('El nombre del cliente debe tener al menos 2 caracteres');
    }

    // email: optional, validate only if provided
    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('El email no es válido');
    }

    // telefono: allow typical local or international lengths (7-15 digits)
    if (!data.telefono || !this.isValidPhone(data.telefono)) {
      errors.push('El teléfono debe tener entre 7 y 15 dígitos');
    }

    // Validar datos del vehículo
    if (!data.marca) {
      errors.push('Debe seleccionar una marca');
    }

    if (!data.modelo || data.modelo.trim().length < 2) {
      errors.push('El modelo del vehículo es requerido');
    }

    if (!data.ano) {
      errors.push('Debe seleccionar el año');
    }

    // Validar datos de la cita
    if (!data.fecha) {
      errors.push('La fecha de la cita es requerida');
    }

    if (!data.hora) {
      errors.push('La hora de la cita es requerida');
    }

    if (!data.servicio) {
      errors.push('Debe seleccionar un servicio');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  isValidPhone(phone) {
    const digitsOnly = (phone || '').replace(/\D/g, '');
    // Accept between 7 and 15 digits to accommodate local and international formats
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  }
}

export { AppointmentsService };
