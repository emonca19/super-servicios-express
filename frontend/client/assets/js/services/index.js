// Barrel file: simple, explicit exports for services
import apiClient, { ApiClient } from './api-client.js';
import { AppointmentsService } from './appointments.service.js';
import ServicesService from './services.service.js';

export { ApiClient, apiClient };
export { AppointmentsService };
export { ServicesService };

export default {
  apiClient,
  ApiClient,
  AppointmentsService,
  ServicesService,
};
