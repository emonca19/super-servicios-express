import { injectStyles } from "../../utils/shadow-style-loader.js";
import { clientsTemplate } from "./main-clients.template.js";
import { clientsStyles } from "./main-clients.styles.js";
import { ClientsLogic } from "./logic.js";
import "../../components/search-bar/index.js";

class ClientsPage extends HTMLElement {

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.allClients = [];
    this.filteredClients = [];
  }

  async connectedCallback() {
    const css = await injectStyles(clientsStyles);

    const style = document.createElement("style");
    style.textContent = css;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = clientsTemplate([]);

    this.root.appendChild(style);
    this.root.appendChild(wrapper);

    // Esperar a que todos los componentes estén definidos
    await Promise.all([
      customElements.whenDefined("admin-search"),
      customElements.whenDefined("admin-table")
    ]);

    await this.loadData();
    this.setupSearchListener();
    this.setupNewClientButton();
  }

  async loadData() {
    this.allClients = await ClientsLogic.fetchClients();
    this.filteredClients = [...this.allClients];
    this.renderTable();
  }

  setupSearchListener() {
    const searchElement = this.root.querySelector("admin-search");
    
    if (searchElement) {
      searchElement.addEventListener("search:change", (e) => {
        const q = e.detail.value;
        this.applySearch(q);
      });
    }
  }

  setupNewClientButton() {
    const newClientBtn = this.root.querySelector("#newClientBtn");
    if (newClientBtn) {
      newClientBtn.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("client:new", {
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  applySearch(q) {
    if (!q || q.trim() === "") {
      this.filteredClients = [...this.allClients];
    } else {
      this.filteredClients = ClientsLogic.filter(this.allClients, q);
    }
    
    this.renderTable();
  }

  renderTable() {
    const table = this.root.querySelector("#clientsTable");
    if (!table) return;

    table.columns = [
      { key: "nombre", label: "Nombre" },
      { key: "telefono", label: "Teléfono" },
      { key: "email", label: "Correo" },
      { key: "vehiculos", label: "Vehículos" },
      { key: "ultimasCitas", label: "Última Cita" },
      { 
        key: "acciones", 
        label: "Acciones", 
        type: "actions",
        actions: [
          { key: "editar", label: "Editar", variant: "primary" },
          { key: "eliminar", label: "Eliminar", variant: "danger" }
        ]
      }
    ];

    table.data = this.filteredClients.map(client => ({
      nombre: client.nombre,
      telefono: client.telefono,
      email: client.email,
      vehiculos: client.vehiculos,
      ultimasCitas: client.ultimasCitas,
      acciones: true
    }));
  }
}

customElements.define("clients-page", ClientsPage);
export default ClientsPage;