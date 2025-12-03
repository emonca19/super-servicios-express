import { injectStyles } from "../../utils/shadow-style-loader.js";
import { dashboardTemplate } from "./main-dashboard.template.js";
import { dashboardStyles } from "./main-dashboard.styles.js";
import { DashboardLogic } from "./logic.js";

class DashboardPage extends HTMLElement {

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const style = document.createElement("style");
    try {
        const css = await injectStyles(dashboardStyles);
        style.textContent = css || dashboardStyles;
    } catch(e) { style.textContent = dashboardStyles; }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = dashboardTemplate();

    this.root.appendChild(style);
    this.root.appendChild(wrapper);

    await customElements.whenDefined("admin-table");
    
    this.loadData();
  }

  async loadData() {
    try {
      const data = await DashboardLogic.getDashboardData();

      const stats = DashboardLogic.adaptDashboardResponse(data.stats);
      const citas = DashboardLogic.adaptCitasResponse(data.citasRecientes);

      this.render(stats, citas);

    } catch (error) {
      this.renderError();
    }
  }

  render(stats, citas) {
    const safeText = (id, val) => {
        const el = this.root.querySelector(id);
        if(el) el.textContent = val;
    };

    safeText("#kpi-citas", stats.citasHoy);
    safeText("#kpi-citas-delta", stats.citasDelta);
    safeText("#kpi-ingresos", stats.ingresos);
    safeText("#kpi-ingresos-delta", stats.ingresosDelta);
    safeText("#kpi-clientes", stats.clientesNuevos);
    safeText("#kpi-ocupacion", stats.ocupacion);

    const table = this.root.querySelector("#tabla-citas");
    if (table) {
        table.columns = [
            { key: "hora", label: "Hora", type: "text" },
            { key: "cliente", label: "Cliente", type: "text" },
            { key: "vehiculo", label: "Vehículo", type: "text" },
            { key: "servicio", label: "Servicio", type: "text" },
            { key: "estado", label: "Estado", type: "badge" }
        ];
        table.data = citas;
    }
  }

  renderError() {
    const container = this.root.querySelector(".dashboard");
    if(container) {
        container.innerHTML = `
            <div style="padding: 2rem; background: #fee2e2; border: 1px solid #ef4444; border-radius: 12px; color: #b91c1c; text-align: center; margin-top: 2rem;">
                <h3 style="font-weight: 700; font-size: 1.2rem;">Error de Conexión</h3>
                <p>No se pudieron cargar los datos del taller.</p>
                <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #b91c1c; color: white; border: none; border-radius: 6px; cursor: pointer;">Reintentar</button>
            </div>
        `;
    }
  }
}

customElements.define("dashboard-page", DashboardPage);
export default DashboardPage;