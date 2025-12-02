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
    console.log("[clients-page] connectedCallback");

    let css = "";
    try {
      css = await injectStyles(clientsStyles);
      console.log("[clients-page] CSS length from injectStyles:", css?.length);
    } catch (err) {
      console.error("[clients-page] Error usando injectStyles:", err);
    }

    const style = document.createElement("style");
    // fallback por si css viene vacío pero clientsStyles tiene algo
    style.textContent = css || clientsStyles || "";
    if (!style.textContent) {
      console.warn("[clients-page] WARNING: style.textContent está vacío");
    }

    const wrapper = document.createElement("div");
    // si tu template acepta (rows = []), puedes pasar [] o nada
    wrapper.innerHTML = clientsTemplate([]);

    this.root.appendChild(style);
    this.root.appendChild(wrapper);

    await Promise.all([
      customElements.whenDefined("admin-search"),
      customElements.whenDefined("admin-table")
    ]);

    // Referencias al DOM (Caché de elementos)
    this.modal = this.root.querySelector("#editModal");
    this.form = this.root.querySelector("#editClientForm");
    this.table = this.root.querySelector("#clientsTable");

    await this.loadData();
    this.setupSearchListener();
    this.setupTableEvents();
    this.setupModalEvents();
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
    } else {
      console.warn("[clients-page] admin-search no encontrado en el shadow");
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

  setupTableEvents() {
    if (!this.table) {
      console.warn("[clients-page] #clientsTable no encontrado");
      return;
    }

    // Opción A: evento custom de admin-table
    this.table.addEventListener("table:action", (e) => {
      const { action, row } = e.detail || {};
      if (action === "editar" && row?.id) {
        this.openEditModal(row.id);
      }
    });

    // Opción B: delegación nativa, por si usas data-action en botones internos
    this.table.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action='editar']");
      if (!btn) return;

      const id = btn.dataset.id;
      this.openEditModal(id);
    });
  }

  async openEditModal(id) {
    console.log("[clients-page] openEditModal id:", id);

    if (!id || id === "undefined") {
      console.error("Error: El ID del cliente es indefinido o nulo.");
      alert("No se pudo identificar el cliente (ID incorrecto).");
      return;
    }

    try {
      const client = await ClientsLogic.getClientById(id);
      console.log("[clients-page] datos cliente:", client);

      if (!client) throw new Error("La API devolvió datos vacíos");

      this.root.querySelector("#editId").value = client.id_cliente || client.id || "";
      this.root.querySelector("#editNombre").value = client.nombre || "";
      this.root.querySelector("#editEmail").value = client.email || "";
      this.root.querySelector("#editTelefono").value = client.telefono || "";
      this.root.querySelector("#editDireccion").value = client.direccion || "";

      this.modal.classList.remove("hidden");
      this.modal.classList.add("flex");

    } catch (error) {
      console.error("Error CRÍTICO en openEditModal:", error);
      alert(`Error: ${error.message}`);
    }
  }

  setupModalEvents() {
    if (!this.modal || !this.form) {
      console.warn("[clients-page] modal o form no encontrados");
      return;
    }

    const closeModal = () => {
      this.modal.classList.add("hidden");
      this.modal.classList.remove("flex");
      this.form.reset();
    };

    this.root.querySelector("#closeModalBtn")?.addEventListener("click", closeModal);
    this.root.querySelector("#cancelBtn")?.addEventListener("click", closeModal);

    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) closeModal();
    });

    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const saveBtn = this.root.querySelector("#saveBtn");
      const originalText = saveBtn.innerHTML;
      saveBtn.innerHTML = "Guardando...";
      saveBtn.disabled = true;

      try {
        const formData = new FormData(this.form);
        const id = formData.get("id");
        
        const dataToUpdate = {
          nombre: formData.get("nombre"),
          email: formData.get("email"),
          telefono: formData.get("telefono"),
          direccion: formData.get("direccion")
        };

        await ClientsLogic.updateClient(id, dataToUpdate);
        closeModal();
        await this.loadData();
        alert("Cliente actualizado correctamente");

      } catch (error) {
        alert("Error al actualizar: " + error.message);
      } finally {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
      }
    });
  }

  renderTable() {
    if (!this.table) {
      console.warn("[clients-page] renderTable: table no encontrada");
      return;
    }

    this.table.columns = [
      { key: "nombre",   label: "Nombre" },
      { key: "telefono", label: "Teléfono" },
      { key: "email",    label: "Correo" },
      { key: "vehiculos",label: "Vehículos" },
      { 
        key: "acciones", 
        label: "Acciones", 
        type: "actions",
        actions: [
          { key: "editar",   label: "Editar",   variant: "primary", icon: "pencil" },
          { key: "eliminar", label: "Eliminar", variant: "danger",  icon: "trash" }
        ]
      }
    ];

    this.table.data = this.filteredClients.map(client => ({
      id:        client.id,
      nombre:    client.nombre,
      telefono:  client.telefono,
      email:     client.email,
      vehiculos: client.vehiculos,
      acciones:  true
    }));
  }
}

customElements.define("clients-page", ClientsPage);
export default ClientsPage;
