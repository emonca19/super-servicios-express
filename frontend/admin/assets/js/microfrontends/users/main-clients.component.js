// assets/js/microfrontends/users/main-clients.component.js
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

    // modo del modal principal (create/edit)
    this.currentMode = "create";

    // para delete
    this.deleteClientId = null;
    this.deleteClientName = "";
  }

  async connectedCallback() {
    console.log("[clients-page] connectedCallback");

    // Inyectar estilos
    let css = "";
    try {
      css = await injectStyles(clientsStyles);
      console.log("[clients-page] CSS length from injectStyles:", css?.length);
    } catch (err) {
      console.error("[clients-page] Error usando injectStyles:", err);
    }

    const style = document.createElement("style");
    style.textContent = css || clientsStyles || "";

    const wrapper = document.createElement("div");
    wrapper.innerHTML = clientsTemplate();

    this.root.appendChild(style);
    this.root.appendChild(wrapper);

    // Esperar a que admin-search y admin-table existan
    await Promise.all([
      customElements.whenDefined("admin-search"),
      customElements.whenDefined("admin-table"),
    ]);

    // Cache de elementos
    this.table = this.root.querySelector("#clientsTable");
    this.searchEl = this.root.querySelector("#search");
    this.newClientBtn = this.root.querySelector("#newClientBtn");

    // Modal CREATE / EDIT
    this.clientModal = this.root.querySelector("#clientModal");
    this.clientForm = this.root.querySelector("#clientForm");
    this.inputId = this.root.querySelector("#clientId");
    this.inputNombre = this.root.querySelector("#clientNombre");
    this.inputEmail = this.root.querySelector("#clientEmail");
    this.inputTelefono = this.root.querySelector("#clientTelefono");
    this.inputDireccion = this.root.querySelector("#clientDireccion");
    this.modalTitle = this.root.querySelector("#modalTitle");
    this.saveBtn = this.root.querySelector("#saveBtn");
    this.saveBtnText = this.root.querySelector("#saveBtnText");

    // Modal VIEW
    this.viewModal = this.root.querySelector("#viewModal");
    this.viewNombre = this.root.querySelector("#viewNombre");
    this.viewEmail = this.root.querySelector("#viewEmail");
    this.viewTelefono = this.root.querySelector("#viewTelefono");
    this.viewDireccion = this.root.querySelector("#viewDireccion");
    this.closeViewBtn = this.root.querySelector("#closeViewBtn");
    this.okViewBtn = this.root.querySelector("#okViewBtn");

    // Modal DELETE
    this.deleteModal = this.root.querySelector("#deleteModal");
    this.deleteMessage = this.root.querySelector("#deleteMessage");
    this.deleteClientNameEl = this.root.querySelector("#deleteClientName");
    this.closeDeleteBtn = this.root.querySelector("#closeDeleteBtn");
    this.cancelDeleteBtn = this.root.querySelector("#cancelDeleteBtn");
    this.confirmDeleteBtn = this.root.querySelector("#confirmDeleteBtn");

    // Inicializar
    await this.loadData();
    this.setupSearchListener();
    this.setupTableEvents();
    this.setupCreateEditModalEvents();
    this.setupViewModalEvents();
    this.setupDeleteModalEvents();
    this.setupNewClientButton();
  }

  // ======================
  //   DATA
  // ======================
  async loadData() {
    this.allClients = await ClientsLogic.fetchClients();
    this.filteredClients = [...this.allClients];
    this.renderTable();
  }

  // ======================
  //   BUSCADOR
  // ======================
  setupSearchListener() {
    if (!this.searchEl) {
      console.warn("[clients-page] admin-search no encontrado");
      return;
    }

    this.searchEl.addEventListener("search:change", (e) => {
      const q = e.detail.value;
      this.applySearch(q);
    });
  }

  applySearch(q) {
    if (!q || q.trim() === "") {
      this.filteredClients = [...this.allClients];
    } else {
      this.filteredClients = ClientsLogic.filter(this.allClients, q);
    }
    this.renderTable();
  }

  // ======================
  //   TABLA
  // ======================
  setupTableEvents() {
    if (!this.table) {
      console.warn("[clients-page] #clientsTable no encontrado");
      return;
    }

    this.table.addEventListener("table:action", (e) => {
      const { action, row } = e.detail || {};
      if (!row) return;

      if (action === "ver") {
        this.openViewModal(row.id);
      }

      if (action === "editar") {
        this.openEditModal(row.id);
      }

      if (action === "eliminar") {
        this.openDeleteModal(row.id, row.nombre);
      }
    });
  }

  renderTable() {
    if (!this.table) return;

    this.table.columns = [
      { key: "nombre",      label: "Cliente" },
      { key: "telefono",    label: "Teléfono" },
      { key: "email",       label: "Correo" },
      { key: "vehiculos",   label: "Vehículos" },
      { key: "ultimasCitas",label: "Última cita" },
      {
        key: "acciones",
        label: "Acciones",
        type: "actions",
        actions: [
          { key: "ver",      label: "Ver",      variant: "dark" },
          { key: "editar",   label: "Editar",   variant: "primary" },
          { key: "eliminar", label: "Eliminar", variant: "danger" },
        ],
      },
    ];

    this.table.data = this.filteredClients.map((client) => ({
      id:            client.id,
      nombre:        client.nombre,
      telefono:      client.telefono,
      email:         client.email,
      vehiculos:     client.vehiculos,
      ultimasCitas:  client.ultimasCitas ?? "--",
      acciones:      true,
    }));
  }

  // ======================
  //   MODAL NUEVO / EDITAR
  // ======================
  setupNewClientButton() {
    if (!this.newClientBtn) return;
    this.newClientBtn.addEventListener("click", () => {
      this.openCreateModal();
    });
  }

  openCreateModal() {
    this.currentMode = "create";
    this.modalTitle.textContent = "Nuevo Cliente";
    this.saveBtnText.textContent = "Guardar cliente";

    this.clientForm.reset();
    this.inputId.value = "";

    this.showClientModal();
  }

  async openEditModal(id) {
    console.log("[clients-page] openEditModal id:", id);
    if (!id) {
      alert("ID de cliente inválido");
      return;
    }

    this.currentMode = "edit";
    this.modalTitle.textContent = "Editar Cliente";
    this.saveBtnText.textContent = "Guardar cambios";

    try {
      const client = await ClientsLogic.getClientById(id);
      if (!client) throw new Error("Cliente no encontrado");

      this.inputId.value = client.id_cliente || client.id || "";
      this.inputNombre.value = client.nombre || "";
      this.inputEmail.value = client.email || "";
      this.inputTelefono.value = client.telefono || "";
      this.inputDireccion.value = client.direccion || "";

      this.showClientModal();
    } catch (err) {
      console.error("[clients-page] Error openEditModal:", err);
      alert("No se pudo cargar el cliente: " + err.message);
    }
  }

  setupCreateEditModalEvents() {
    if (!this.clientModal || !this.clientForm) {
      console.warn("[clients-page] clientModal o clientForm no encontrados");
      return;
    }

    const close = () => this.closeClientModal();

    this.root.querySelector("#closeModalBtn")?.addEventListener("click", close);
    this.root.querySelector("#cancelBtn")?.addEventListener("click", close);

    this.clientModal.addEventListener("click", (e) => {
      if (e.target === this.clientModal) close();
    });

    this.clientForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        nombre: this.inputNombre.value.trim(),
        email: this.inputEmail.value.trim(),
        telefono: this.inputTelefono.value.trim(),
        direccion: this.inputDireccion.value.trim(),
      };

      const id = this.inputId.value || null;

      const originalText = this.saveBtnText.textContent;
      this.saveBtn.disabled = true;
      this.saveBtnText.textContent = "Guardando...";

      try {
        if (id) {
          await ClientsLogic.updateClient(id, payload);
        } else {
          await ClientsLogic.createClient(payload);
        }

        await this.loadData();
        this.closeClientModal();
      } catch (err) {
        console.error("[clients-page] Error al guardar:", err);
        alert("Error al guardar el cliente: " + err.message);
      } finally {
        this.saveBtn.disabled = false;
        this.saveBtnText.textContent = originalText;
      }
    });
  }

  showClientModal() {
    if (!this.clientModal) return;
    this.clientModal.classList.add("is-open");
  }

  closeClientModal() {
    if (!this.clientModal || !this.clientForm) return;
    this.clientModal.classList.remove("is-open");
    this.clientForm.reset();
    if (this.inputId) this.inputId.value = "";
  }

  // ======================
  //   MODAL VER (solo lectura)
  // ======================
  async openViewModal(id) {
    console.log("[clients-page] openViewModal id:", id);
    if (!id) return;

    try {
      const client = await ClientsLogic.getClientById(id);
      if (!client) throw new Error("Cliente no encontrado");

      this.viewNombre.value = client.nombre || "";
      this.viewEmail.value = client.email || "";
      this.viewTelefono.value = client.telefono || "";
      this.viewDireccion.value = client.direccion || "";

      this.showViewModal();
    } catch (err) {
      console.error("[clients-page] Error openViewModal:", err);
      alert("No se pudieron cargar los detalles: " + err.message);
    }
  }

  setupViewModalEvents() {
    if (!this.viewModal) return;

    const close = () => this.closeViewModal();

    this.closeViewBtn?.addEventListener("click", close);
    this.okViewBtn?.addEventListener("click", close);

    this.viewModal.addEventListener("click", (e) => {
      if (e.target === this.viewModal) close();
    });
  }

  showViewModal() {
    if (!this.viewModal) return;
    this.viewModal.classList.add("is-open");
  }

  closeViewModal() {
    if (!this.viewModal) return;
    this.viewModal.classList.remove("is-open");
  }

  // ======================
  //   MODAL DELETE
  // ======================
  openDeleteModal(id, nombre) {
    if (!id) return;

    this.deleteClientId = id;
    this.deleteClientName = nombre || "";

    if (this.deleteClientNameEl) {
      this.deleteClientNameEl.textContent = this.deleteClientName
        ? this.deleteClientName
        : "";
    }

    this.showDeleteModal();
  }

  setupDeleteModalEvents() {
    if (!this.deleteModal) return;

    const close = () => this.closeDeleteModal();

    this.closeDeleteBtn?.addEventListener("click", close);
    this.cancelDeleteBtn?.addEventListener("click", close);

    this.deleteModal.addEventListener("click", (e) => {
      if (e.target === this.deleteModal) close();
    });

    this.confirmDeleteBtn?.addEventListener("click", async () => {
      if (!this.deleteClientId) return;

      this.confirmDeleteBtn.disabled = true;
      this.confirmDeleteBtn.textContent = "Eliminando...";

      try {
        await ClientsLogic.deleteClient(this.deleteClientId);
        await this.loadData();
        this.closeDeleteModal();
      } catch (err) {
        console.error("[clients-page] Error al eliminar:", err);
        alert("Error al eliminar el cliente: " + err.message);
      } finally {
        this.confirmDeleteBtn.disabled = false;
        this.confirmDeleteBtn.textContent = "Eliminar";
      }
    });
  }

  showDeleteModal() {
    if (!this.deleteModal) return;
    this.deleteModal.classList.add("is-open");
  }

  closeDeleteModal() {
    if (!this.deleteModal) return;
    this.deleteModal.classList.remove("is-open");
    this.deleteClientId = null;
    this.deleteClientName = "";
    if (this.deleteClientNameEl) this.deleteClientNameEl.textContent = "";
  }
}

customElements.define("clients-page", ClientsPage);
export default ClientsPage;
