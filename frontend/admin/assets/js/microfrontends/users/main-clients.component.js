import { injectStyles } from "../../utils/shadow-style-loader.js";
import { clientsTemplate } from "./main-clients.template.js";
import { clientsStyles } from "./main-clients.styles.js";
import { ClientsLogic } from "./logic.js";

class ClientsPage extends HTMLElement {

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.allClients = [];
  }

  async connectedCallback() {
  const css = await injectStyles(clientsStyles);

  const style = document.createElement("style");
  style.textContent = css;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = clientsTemplate([]);

  this.root.appendChild(style);
  this.root.appendChild(wrapper);

  await customElements.whenDefined("admin-table");

  await this.loadData();
  this.setupSearchListener();
}


  async loadData() {
    this.allClients = await ClientsLogic.fetchClients();
    this.render(this.allClients);
  }

  setupSearchListener() {
    this.root.addEventListener("search:change", (e) => {
      const q = e.detail.value;
      this.applySearch(q);
    });
  }

  applySearch(q) {
    const filtered = ClientsLogic.filter(this.allClients, q);
    this.render(filtered);
  }

  render(rows) {
    const table = this.root.querySelector("#clientsTable");
    if (!table) return;

    table.columns = [
      { key: "nombre", label: "Nombre" },
      { key: "telefono", label: "Teléfono" },
      { key: "email", label: "Correo" },
      { key: "vehiculos", label: "Vehículos" },
      { key: "ultimasCitas", label: "Última Cita" },
      { key: "acciones", label: "Acciones", type: "actions" }
    ];

table.data = rows.map(r => ({
  ...r,
  acciones: true   
}));
  }
}

customElements.define("clients-page", ClientsPage);
export default ClientsPage;
