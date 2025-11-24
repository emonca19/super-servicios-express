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

    this.loadData();
  }

  async loadData() {
    try {
      const apiStats = {
        citasHoy: 12,
        citasDelta: 2,
        ingresos: 2450,
        ingresosDelta: 15,
        clientesNuevos: 8,
        ocupacion: 85
      };

      const apiCitas = [
        { hora: "09:00 AM", cliente: "Juan García", vehiculo: "Honda Civic - ABC1234", servicio: "Cambio de aceite", estado: "Completada" },
        { hora: "10:30 AM", cliente: "María López", vehiculo: "Toyota Corolla - XYZ5678", servicio: "Revisión general", estado: "En Proceso" },
        { hora: "12:00 PM", cliente: "Pedro Ramírez", vehiculo: "Ford Focus - DEF9012", servicio: "Cambio de frenos", estado: "Pendiente" },
        { hora: "02:30 PM", cliente: "Ana Martínez", vehiculo: "Chevrolet Spark - GHI3456", servicio: "Alineación y balanceo", estado: "Pendiente" }
      ];

      const stats = DashboardLogic.adaptDashboardResponse(apiStats);
      const citas = DashboardLogic.adaptCitasResponse(apiCitas);

      await customElements.whenDefined("admin-table");

      this.render(stats, citas);

    } catch (error) {
      console.error("[DashboardPage] Error:", error);
      this.renderError();
    }
  }

  render(stats, citas) {
    this.root.querySelector("#kpi-citas").textContent = stats.citasHoy;
    this.root.querySelector("#kpi-citas-delta").textContent = `+${stats.citasDelta} desde ayer`;

    this.root.querySelector("#kpi-ingresos").textContent = `$${stats.ingresos}`;
    this.root.querySelector("#kpi-ingresos-delta").textContent = `+${stats.ingresosDelta}% vs ayer`;

    this.root.querySelector("#kpi-clientes").textContent = stats.clientesNuevos;
    this.root.querySelector("#kpi-ocupacion").textContent = `${stats.ocupacion}%`;

    const table = this.root.querySelector("#tabla-citas");
    if (!table) {
      console.warn("[DashboardPage] <admin-table id='tabla-citas'> no encontrado");
      return;
    }

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
      <div style="
        padding: 2rem;
        background: #ffe6e6;
        border: 1px solid #ffb3b3;
        border-radius: 12px;
        font-size: 16px;
        color: #b30000;
      ">
        Error al cargar el dashboard.<br>
        Verifica tu conexión o intenta nuevamente.
      </div>
    `;
  }
}

customElements.define("dashboard-page", DashboardPage);
export default DashboardPage;
