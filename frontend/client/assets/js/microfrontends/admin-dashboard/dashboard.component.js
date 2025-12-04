// assets/js/microfrontends/admin-dashboard/dashboard.component.js

import { dashboardTemplate } from "./dashboard.template.js";
import { dashboardStyles } from "./dashboard.styles.js";
import { injectStyles } from "../../utils/shadow-style-loader.js";
import { DashboardService } from "../../services/dashboard.service.js";

class AdminDashboardShell extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.service = new DashboardService();
    this.state = {
      loading: true,
      error: null,
      summary: {},
      appointments: [],
    };
  }

  connectedCallback() {
    this.loadData();
  }

  async loadData() {
    try {
      this.state.loading = true;
      await this.render();

      const [summary, appointments] = await Promise.all([
        this.service.getTodaySummary().catch((e) => {
          console.warn("[dashboard] Error resumen:", e);
          throw e;
        }),
        this.service.getTodayAppointments().catch((e) => {
          console.warn("[dashboard] Error citas:", e);
          throw e;
        }),
      ]);

      this.state.summary = summary || {};
      this.state.appointments = appointments || [];
      this.state.error = null;
    } catch (err) {
      console.error("[dashboard] Error cargando datos", err);
      this.state.error = err?.message || "Error desconocido";
    } finally {
      this.state.loading = false;
      await this.render();
    }
  }

  async render() {
    const template = document.createElement("template");
    template.innerHTML = dashboardTemplate(this.state);

    this.root.innerHTML = "";
    await injectStyles(this.root, dashboardStyles);
    this.root.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("admin-dashboard-shell", AdminDashboardShell);

export { AdminDashboardShell };
export default AdminDashboardShell;
