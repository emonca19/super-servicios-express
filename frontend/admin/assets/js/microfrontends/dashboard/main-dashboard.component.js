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
    const css = await injectStyles(dashboardStyles);
    const style = document.createElement("style");
    style.textContent = css;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = dashboardTemplate();

    this.root.appendChild(style);
    this.root.appendChild(wrapper);

    // Esperamos a que la tabla esté definida antes de cargar datos
    await customElements.whenDefined("admin-table");
    this.loadData();
  }

  async loadData() {
    try {
      // 1. Obtenemos datos REALES calculados en la lógica
      const data = await DashboardLogic.getDashboardData();

      // 2. Adaptamos los datos para la vista (formateo de moneda, etiquetas, etc)
      const stats = DashboardLogic.adaptDashboardResponse(data.stats);
      const citas = DashboardLogic.adaptCitasResponse(data.citasRecientes);

      this.render(stats, citas);

    } catch (error) {
      console.error("[DashboardPage] Error:", error);
      this.renderError();
    }
  }

  render(stats, citas) {
    // Renderizado de KPIs
    this.root.querySelector("#kpi-citas").textContent = stats.citasHoy;
    // Ejemplo: Si quisieras calcular la diferencia real, necesitarías datos de ayer
    this.root.querySelector("#kpi-citas-delta").textContent = stats.citasDelta; 

    this.root.querySelector("#kpi-ingresos").textContent = stats.ingresos;
    this.root.querySelector("#kpi-ingresos-delta").textContent = stats.ingresosDelta;

    this.root.querySelector("#kpi-clientes").textContent = stats.clientesNuevos;
    this.root.querySelector("#kpi-ocupacion").textContent = stats.ocupacion;

    // Renderizado de Tabla
    const table = this.root.querySelector("#tabla-citas");
    if (!table) return;

    table.columns = [
      { key: "hora", label: "Hora", type: "text" },
      { key: "cliente", label: "Cliente", type: "text" },
      { key: "vehiculo", label: "Vehículo", type: "text" },
      { key: "servicio", label: "Servicio", type: "text" },
      { key: "estado", label: "Estado", type: "badge" },
      { key: "acciones", label: "Acciones", type: "actions" }
    ];

    table.data = citas;
  }

  renderError() {
    const container = this.root.querySelector(".dashboard") || this.root;
    container.innerHTML = `
      <div style="padding: 2rem; background: #ffe6e6; border: 1px solid #ffb3b3; border-radius: 12px; color: #b30000; text-align: center;">
        <h3>Error de conexión</h3>
        <p>No se pudieron cargar los datos del dashboard.</p>
      </div>
    `;
  }
}

customElements.define("dashboard-page", DashboardPage);
export default DashboardPage;