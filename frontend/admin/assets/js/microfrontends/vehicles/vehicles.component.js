import { injectStyles } from "../../utils/shadow-style-loader.js";
import { vehiclesTemplate } from "./vehicles.template.js";
import { vehiclesStyles } from "./vehicles.styles.js";
import { VehiclesLogic } from "./logic.js";
import "../../components/search-bar/index.js";

class VehiclesPage extends HTMLElement {

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });

    this.allVehicles = [];
    this.filteredVehicles = [];
  }

  async connectedCallback() {
    const css = await injectStyles(vehiclesStyles);

    const style = document.createElement("style");
    style.textContent = css;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = vehiclesTemplate();

    this.root.appendChild(style);
    this.root.appendChild(wrapper);

    await Promise.all([
      customElements.whenDefined("admin-search"),
      customElements.whenDefined("admin-table")
    ]);

    await this.loadData();
    this.setupSearchListener();
    this.setupNewVehicleButton();
  }

  async loadData() {
    this.allVehicles = await VehiclesLogic.fetchVehicles();
    this.filteredVehicles = [...this.allVehicles];
    this.renderTable();
  }

  setupSearchListener() {
    const search = this.root.querySelector("admin-search");

    search.addEventListener("search:change", (e) => {
      const q = e.detail.value;
      this.applySearch(q);
    });
  }

  setupNewVehicleButton() {
    const btn = this.root.querySelector("#newVehicleBtn");

    btn.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("vehicle:new", {
        bubbles: true,
        composed: true
      }));
    });
  }

  applySearch(q) {
    if (!q || q.trim() === "") {
      this.filteredVehicles = [...this.allVehicles];
    } else {
      this.filteredVehicles = VehiclesLogic.filter(this.allVehicles, q);
    }

    this.renderTable();
  }

  renderTable() {
    const table = this.root.querySelector("#vehiclesTable");
    if (!table) return;

    table.columns = [
      { key: "marca", label: "Marca" },
      { key: "modelo", label: "Modelo" },
      { key: "placas", label: "Placas" },
      { key: "propietario", label: "Propietario" },
      { key: "color", label: "Color" },
      { key: "anio", label: "Año" },
      {
        key: "acciones",
        label: "Acciones",
        type: "actions",
        actions: [
          { key: "ver", label: "Ver", variant: "dark" },
          { key: "editar", label: "Editar", variant: "primary" },
          { key: "eliminar", label: "Eliminar", variant: "danger" }
        ]
      }
    ];

    table.data = this.filteredVehicles.map(v => ({
      ...v,
      acciones: true
    }));
  }
}

customElements.define("vehicles-page", VehiclesPage);
export default VehiclesPage;