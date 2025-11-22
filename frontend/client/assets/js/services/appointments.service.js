/**
 * Servicio de gestión de citas
 */

import { ApiClient } from './api-client.js';


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
      const phone = (appointmentData.telefono || '').replace(/\D/g, '');

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
      const raw = Array.isArray(slots) ? slots : (slots?.data || slots || []);
      let result = Array.isArray(raw) ? raw.slice() : [];

      try {
        const parts = (date || '').split('-').map(Number);
        if (parts.length === 3) {
          const d = new Date(parts[0], parts[1] - 1, parts[2]);
          const dow = d.getDay(); 
          if (dow === 0) {
            return [];
          }
          if (dow === 6) {
            result = result.filter((s) => {
              try {
                const [hh, mm] = String(s).split(':').map(Number);
                if (Number.isNaN(hh)) return false;
                const minutes = hh * 60 + (Number(mm) || 0);
                return minutes >= (8 * 60) && minutes < (14 * 60);
              } catch (e) { return false; }
            });
          }
        }
      } catch (e) {
      }

      return result;
    } catch (error) {
      console.error('[AppointmentsService] Error getting available slots:', error);
      
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
   * Valida restricciones temporales y conflictos con citas existentes.
   * @param {Object} data - appointment data with fecha, hora y duracion_minutos (opcional)
   * @returns {Promise<{isValid:boolean,errors:Array}>}
   */
  async validateAppointmentConstraints(data) {
    const errors = [];
    try {
      const fecha = data.fecha;
      const hora = data.hora || '09:00';
      if (!fecha) {
        errors.push('La fecha de la cita es requerida');
        return { isValid: errors.length === 0, errors };
      }

      const inicio = new Date(`${fecha}T${hora}:00`);
      if (Number.isNaN(inicio.getTime())) {
        errors.push('Fecha u hora inválida');
        return { isValid: errors.length === 0, errors };
      }

      const now = new Date();
      if (inicio.getTime() < now.getTime()) {
        errors.push('No puedes agendar una cita en una fecha u hora anterior a la actual');
      }

      const durationMin = Number(data.duracion_minutos) || Number(data.duration) || 60;
      const fin = new Date(inicio.getTime() + durationMin * 60000);

      try {
        const dow = inicio.getDay(); // 0 = Sunday, 6 = Saturday
        if (dow === 0) {
          errors.push('No se pueden agendar citas los domingos');
        }
        if (dow === 6) {
          const startMinutes = inicio.getHours() * 60 + inicio.getMinutes();
          const endMinutes = fin.getHours() * 60 + fin.getMinutes();
          if (startMinutes < (8 * 60) || endMinutes > (14 * 60)) {
            errors.push('Los sábados las citas sólo pueden programarse entre las 08:00 y las 14:00');
          }
        }
      } catch (e) {}

      try {
        const resp = await this.apiClient.get('/citas/mine');
        const raw = resp?.data || resp || [];
        const citas = Array.isArray(raw) ? raw : (Array.isArray(resp) ? resp : (Array.isArray(resp?.data) ? resp.data : []));

        for (let i = 0; i < (citas || []).length; i += 1) {
          const c = citas[i];
          try {
            const estadoC = (c.estado || '').toString().toUpperCase();
            if (estadoC === 'CANCELADA' || estadoC === 'CANCELLED') continue;
            const cInicio = c.inicio ? new Date(c.inicio) : null;
            const cFin = c.fin ? new Date(c.fin) : null;
            if (!cInicio || !cFin || Number.isNaN(cInicio.getTime()) || Number.isNaN(cFin.getTime())) continue;

            const editingId = data.id_cita || data.id || data._id;
            if (editingId && (String(editingId) === String(c.id_cita) || String(editingId) === String(c.id))) continue;

            if (inicio.getTime() < cFin.getTime() && fin.getTime() > cInicio.getTime()) {
              errors.push(`La franja ${fecha} ${hora} se solapa con otra cita (${c.motivo || c.id_cita})`);
              break;
            }
          } catch (e) {
          }
        }
      } catch (err) {
        console.warn('[AppointmentsService] Could not fetch existing citas to validate conflicts', err);
      }
    } catch (err) {
      console.error('[AppointmentsService] validateAppointmentConstraints error', err);
      errors.push('Error validando disponibilidad de la fecha');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validar datos de la cita antes de enviar
   */
  validateAppointmentData(data) {
    const errors = [];

    if (!data.nombre || data.nombre.trim().length < 2) {
      errors.push('El nombre del cliente debe tener al menos 2 caracteres');
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('El email no es válido');
    }

    if (!data.telefono || !this.isValidPhone(data.telefono)) {
      errors.push('El teléfono debe tener entre 7 y 15 dígitos');
    }

    if (!data.marca) {
      errors.push('Debe seleccionar una marca');
    }

    if (!data.modelo || data.modelo.trim().length < 2) {
      errors.push('El modelo del vehículo es requerido');
    }

    if (!data.ano) {
      errors.push('Debe seleccionar el año');
    }

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
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  }
}

export { AppointmentsService };
