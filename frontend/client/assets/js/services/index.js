import apiClient, { ApiClient } from "./api-client.js";
import { AppointmentsService } from "./appointments.service.js";
import ServicesService from "./services.service.js";
import { DashboardService } from "./dashboard.service.js";

export { ApiClient, apiClient };
export { AppointmentsService };
export { ServicesService };
export { DashboardService };

export default {
  apiClient,
  ApiClient,
  AppointmentsService,
  ServicesService,
  DashboardService,
};
