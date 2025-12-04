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
    this.currentMode = "create";
    this.deleteVehicleId = null;
  }

  async connectedCallback() {
    const css = await injectStyles(vehiclesStyles);
    const style = document.createElement("style");
    style.textContent = css || vehiclesStyles;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = vehiclesTemplate();

    this.root.appendChild(style);
    this.root.appendChild(wrapper);

    await Promise.all([
      customElements.whenDefined("admin-search"),
      customElements.whenDefined("admin-table")
    ]);

    // Cache DOM
    this.table = this.root.querySelector("#vehiclesTable");
    this.searchEl = this.root.querySelector("#search");
    
    // Modal Create/Edit
    this.modal = this.root.querySelector("#vehicleModal");
    this.form = this.root.querySelector("#vehicleForm");
    this.inputId = this.root.querySelector("#vehicleId");
    this.inputCliente = this.root.querySelector("#vehicleCliente"); // <SELECT>
    this.inputMarca = this.root.querySelector("#vehicleMarca");
    this.inputModelo = this.root.querySelector("#vehicleModelo");
    this.inputAnio = this.root.querySelector("#vehicleAnio");
    this.inputColor = this.root.querySelector("#vehicleColor");
    this.inputPlacas = this.root.querySelector("#vehiclePlacas");
    this.inputSerie = this.root.querySelector("#vehicleSerie");
    this.modalTitle = this.root.querySelector("#modalTitle");
    this.saveBtn = this.root.querySelector("#saveBtn");
    this.saveBtnText = this.root.querySelector("#saveBtnText");

    // Modal Delete
    this.deleteModal = this.root.querySelector("#deleteModal");
    this.deleteNameEl = this.root.querySelector("#deleteVehicleName");
    this.confirmDeleteBtn = this.root.querySelector("#confirmDeleteBtn");

    // Modal View
    this.viewModal = this.root.querySelector("#viewModal");

    // Init
    await this.loadData();
    await this.loadClientsForSelect(); // Cargar lista de clientes
    this.setupListeners();
  }

  async loadData() {
    this.allVehicles = await VehiclesLogic.fetchVehicles();
    this.filteredVehicles = [...this.allVehicles];
    this.renderTable();
  }

  // Cargar clientes en el <select>
  async loadClientsForSelect() {
    try {
      const clients = await VehiclesLogic.fetchClientsOptions();
      const select = this.inputCliente;
      if (!select) return;
      
      // Limpiar excepto el primero
      select.innerHTML = '<option value="">-- Seleccione un cliente --</option>';
      
      clients.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.nombre;
        select.appendChild(opt);
      });
    } catch (e) {
      console.error("Error cargando clientes para select:", e);
    }
  }

  setupListeners() {
    // Search
    this.searchEl?.addEventListener("search:change", (e) => {
      const q = e.detail.value;
      if (!q || q.trim() === "") {
        this.filteredVehicles = [...this.allVehicles];
      } else {
        this.filteredVehicles = VehiclesLogic.filter(this.allVehicles, q);
      }
      this.renderTable();
    });

    // Table Actions
    this.table?.addEventListener("table:action", (e) => {
      const { action, row } = e.detail || {};
      if (!row) return;
      if (action === "editar") this.openEditModal(row.id);
      if (action === "eliminar") this.openDeleteModal(row.id, `${row.marca} ${row.modelo} (${row.placas})`);
      if (action === "ver") this.openViewModal(row.id);
    });

    // New Button
    this.root.querySelector("#newVehicleBtn")?.addEventListener("click", () => this.openCreateModal());

    // Modal Close
    const closeModals = () => {
      this.modal.classList.remove("is-open");
      this.deleteModal.classList.remove("is-open");
      this.viewModal.classList.remove("is-open");
    };
    this.root.querySelectorAll(".modal-close, .btn-secondary, .btn-delete-cancel, #okViewBtn").forEach(btn => 
      btn.addEventListener("click", closeModals)
    );

    // Form Submit
    this.form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleSave();
    });

    // Delete Confirm
    this.confirmDeleteBtn?.addEventListener("click", async () => {
      if(!this.deleteVehicleId) return;
      try {
        this.confirmDeleteBtn.textContent = "Eliminando...";
        await VehiclesLogic.deleteVehicle(this.deleteVehicleId);
        await this.loadData();
        closeModals();
      } catch(e) {
        alert("Error al eliminar: " + e.message);
      } finally {
        this.confirmDeleteBtn.textContent = "Eliminar";
      }
    });
  }

  renderTable() {
    if (!this.table) return;
    this.table.columns = [
      { key: "marca", label: "Marca" },
      { key: "modelo", label: "Modelo" },
      { key: "placas", label: "Placas" },
      { key: "propietario", label: "Dueño" },
      { key: "anio", label: "Año" },
      { key: "acciones", label: "Acciones", type: "actions", actions: [
          { key: "ver", label: "Ver", variant: "dark" },
      ]}
    ];
    this.table.data = this.filteredVehicles.map(v => ({
      ...v, acciones: true
    }));
  }

  // --- MODAL LOGIC ---

  openCreateModal() {
    this.currentMode = "create";
    this.modalTitle.textContent = "Nuevo Vehículo";
    this.saveBtnText.textContent = "Guardar vehículo";
    this.form.reset();
    this.inputId.value = "";
    this.modal.classList.add("is-open");
  }

  async openEditModal(id) {
    try {
      const auto = await VehiclesLogic.getVehicleById(id);
      this.currentMode = "edit";
      this.modalTitle.textContent = "Editar Vehículo";
      this.saveBtnText.textContent = "Guardar cambios";
      
      this.inputId.value = auto.id_auto || auto.id;
      this.inputMarca.value = auto.marca;
      this.inputModelo.value = auto.modelo;
      this.inputAnio.value = auto.anio;
      this.inputColor.value = auto.color;
      this.inputPlacas.value = auto.placas;
      this.inputSerie.value = auto.numero_serie;
      this.inputCliente.value = auto.id_cliente; // Selecciona el dueño en el dropdown

      this.modal.classList.add("is-open");
    } catch(e) {
      alert("Error cargando auto: " + e.message);
    }
  }

  async openViewModal(id) {
    try {
        const auto = await VehiclesLogic.getVehicleById(id);
        // Necesitamos buscar el nombre del dueño porque getById solo trae el ID
        // (Podríamos optimizar esto, pero por ahora busquemos en la lista cargada)
        const clients = await VehiclesLogic.fetchClientsOptions();
        const owner = clients.find(c => c.id == auto.id_cliente);

        this.root.querySelector("#viewPropietario").value = owner ? owner.nombre : `ID: ${auto.id_cliente}`;
        this.root.querySelector("#viewAuto").value = `${auto.marca} ${auto.modelo} (${auto.anio})`;
        this.root.querySelector("#viewPlacas").value = auto.placas;
        this.root.querySelector("#viewSerie").value = auto.numero_serie;
        
        this.viewModal.classList.add("is-open");
    } catch(e) {
        alert("Error al ver detalles");
    }
  }

  openDeleteModal(id, name) {
    this.deleteVehicleId = id;
    this.deleteNameEl.textContent = name;
    this.deleteModal.classList.add("is-open");
  }

  async handleSave() {
    const data = {
      id_cliente: this.inputCliente.value,
      marca: this.inputMarca.value,
      modelo: this.inputModelo.value,
      anio: this.inputAnio.value,
      color: this.inputColor.value,
      placas: this.inputPlacas.value,
      numero_serie: this.inputSerie.value
    };

    try {
      this.saveBtn.disabled = true;
      this.saveBtnText.textContent = "Guardando...";
      
      if(this.currentMode === "create") {
        await VehiclesLogic.createVehicle(data);
      } else {
        await VehiclesLogic.updateVehicle(this.inputId.value, data);
      }

      await this.loadData();
      this.modal.classList.remove("is-open");
    } catch(e) {
      alert("Error al guardar: " + e.message);
    } finally {
      this.saveBtn.disabled = false;
      this.saveBtnText.textContent = this.currentMode === "create" ? "Guardar vehículo" : "Guardar cambios";
    }
  }
}

customElements.define("vehicles-page", VehiclesPage);
export default VehiclesPage;