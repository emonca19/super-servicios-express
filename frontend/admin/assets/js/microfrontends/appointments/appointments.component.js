import { injectStyles } from "../../utils/shadow-style-loader.js";
import { appointmentsTemplate } from "./appointments.template.js";
import { appointmentsStyles } from "./appointments.styles.js";
import { AppointmentsLogic } from "./logic.js";

class AppointmentsPage extends HTMLElement {

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.allAppointments = [];
    this.currentFilter = AppointmentsLogic.FILTERS.ALL;

    // referencias para evitar re-render completo
    this.table = null;
    this.filterBar = null;
  }

  async connectedCallback() {
    const css = await injectStyles(appointmentsStyles);

    const style = document.createElement("style");
    style.textContent = css;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = appointmentsTemplate(this.currentFilter);

    this.root.appendChild(style);
    this.root.appendChild(wrapper);

    await customElements.whenDefined("admin-table");

    this.table = this.root.querySelector("#tabla-appointments");
    this.filterBar = this.root.querySelector(".filters");

    this.table.columns = [
      { key: "displayTime", label: "Hora", type: "text" },
      { key: "client", label: "Cliente", type: "text" },
      { key: "vehicle", label: "Vehículo", type: "text" },
      { key: "service", label: "Servicio", type: "text" },
      { key: "statusLabel", label: "Estado", type: "badge" },
      { key: "acciones", label: "Acciones", type: "actions" }
    ];

    this.setupFilterListeners();
    this.loadData();
  }

  async loadData() {
    try {
      this.allAppointments = await AppointmentsLogic.fetchAppointments();
      this.render();
    } catch (err) {
      console.error("[AppointmentsPage] Error:", err);
      this.renderError();
    }
  }

  setupFilterListeners() {
    this.filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-pill");
      if (!btn) return;

      this.currentFilter = btn.dataset.filter;
      this.render();
    });
  }

  render() {
    const filtered = AppointmentsLogic.filterAppointments(
      this.allAppointments,
      this.currentFilter
    );

    this.filterBar.querySelectorAll(".filter-pill").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.filter === this.currentFilter);
    });

    this.table.data = filtered.map(a => ({
      ...a,
      acciones: true     
    }));
  }

  renderError() {
    this.root.querySelector(".appointments").innerHTML = `
      <div style="padding:2rem; background:#fee2e2; border-radius:12px; color:#b91c1c;">
        Error al cargar las citas.
      </div>
    `;
  }
}

customElements.define("appointments-page", AppointmentsPage);
export default AppointmentsPage;
