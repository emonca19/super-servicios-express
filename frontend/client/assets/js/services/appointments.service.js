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
      // Transformar datos del formulario al formato que espera el backend
      const payload = {
        clientName: appointmentData.nombre,
        clientPhone: appointmentData.telefono.replace(/\D/g, ''), // Solo números
        clientEmail: appointmentData.email,
        clientAddress: appointmentData.direccion,
        
        // Datos del vehículo
        vehicleBrand: appointmentData.marca,
        vehicleModel: appointmentData.modelo,
        vehicleYear: parseInt(appointmentData.ano),
        vehiclePlates: appointmentData.placas?.toUpperCase(),
        vehicleColor: appointmentData.color,
        
        // Datos de la cita
        appointmentDate: appointmentData.fecha,
        appointmentTime: appointmentData.hora,
        serviceId: appointmentData.servicio,
        observations: appointmentData.observaciones || '',
        
        // Metadata
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      console.log('[AppointmentsService] Creating appointment:', payload);
      
  const response = await this.apiClient.post('/citas', payload);
      
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
    if (!data.nombre || data.nombre.trim().length < 3) {
      errors.push('El nombre del cliente debe tener al menos 3 caracteres');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('El email no es válido');
    }

    if (!data.telefono || !this.isValidPhone(data.telefono)) {
      errors.push('El teléfono debe tener 10 dígitos');
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
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length === 10;
  }
}

export { AppointmentsService };
