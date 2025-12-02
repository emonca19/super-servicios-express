import { injectStyles } from "../../utils/shadow-style-loader.js";
import { servicesTemplate } from "./services.template.js";
import { servicesStyles } from "./services.styles.js";
import { ServicesLogic } from "./logic.js";
import "../../components/search-bar/index.js";

class ServicesPage extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.allServices = [];
    this.filteredServices = [];
    this.currentMode = "create";
    this.deleteServiceId = null;
  }

  async connectedCallback() {
    console.log("🚀 [ServicesPage] Componente montado");

    // 1. Estilos
    const style = document.createElement("style");
    try {
        const css = await injectStyles(servicesStyles);
        style.textContent = css || servicesStyles;
    } catch(e) {
        style.textContent = servicesStyles;
    }

    // 2. HTML
    const wrapper = document.createElement("div");
    wrapper.innerHTML = servicesTemplate();

    this.root.appendChild(style);
    this.root.appendChild(wrapper);

    // 3. Esperar componentes
    await Promise.all([
      customElements.whenDefined("admin-search"),
      customElements.whenDefined("admin-table")
    ]);

    // 4. Cachear elementos
    this.table = this.root.querySelector("#servicesTable");
    this.searchEl = this.root.querySelector("#search");
    
    // Botones Principales
    this.newServiceBtn = this.root.querySelector("#newServiceBtn");

    // Modal Create/Edit
    this.modal = this.root.querySelector("#serviceModal");
    this.form = this.root.querySelector("#serviceForm");
    this.inputId = this.root.querySelector("#serviceId");
    this.inputNombre = this.root.querySelector("#serviceNombre");
    this.inputDescripcion = this.root.querySelector("#serviceDescripcion");
    this.inputDuracion = this.root.querySelector("#serviceDuracion");
    this.inputPrecio = this.root.querySelector("#servicePrecio");
    this.modalTitle = this.root.querySelector("#modalTitle");
    this.saveBtn = this.root.querySelector("#saveBtn");
    this.saveBtnText = this.root.querySelector("#saveBtnText");

    // Otros Modales
    this.viewModal = this.root.querySelector("#viewModal");
    this.deleteModal = this.root.querySelector("#deleteModal");
    this.deleteNameEl = this.root.querySelector("#deleteServiceName");
    this.confirmDeleteBtn = this.root.querySelector("#confirmDeleteBtn");

    // 5. Cargar datos
    await this.loadData();
    
    // 6. Configurar eventos (Aquí está la corrección)
    this.setupListeners();
  }

  async loadData() {
    console.log("🔄 [ServicesPage] Cargando datos...");
    this.allServices = await ServicesLogic.fetchServices();
    this.filteredServices = [...this.allServices];
    this.renderTable();
  }

  setupListeners() {
    // --- A. Botón Nuevo Servicio ---
    if (this.newServiceBtn) {
        this.newServiceBtn.addEventListener("click", (e) => {
            console.log("👉 Click en Nuevo Servicio");
            this.openCreateModal();
        });
    } else {
        console.error("❌ No se encontró el botón #newServiceBtn");
    }

    // --- B. Eventos de la Tabla (DOBLE ESTRATEGIA) ---
    
    if (this.table) {
        // Estrategia 1: Evento Custom (Si tu admin-table lo soporta)
        this.table.addEventListener("table:action", (e) => {
            console.log("⚡ Evento table:action detectado:", e.detail);
            const { action, row } = e.detail || {};
            this.handleTableAction(action, row);
        });

        // Estrategia 2: Click Nativo (Fallback por si admin-table no dispara el evento)
        this.table.addEventListener("click", (e) => {
            // Buscamos si el click fue en un botón dentro de la tabla
            // Asumiendo que admin-table renderiza botones o iconos
            const btn = e.composedPath().find(el => el.tagName === "BUTTON" && el.dataset.action); // Busca botones con data-action
            
            if (btn) {
                console.log("🖱️ Click nativo detectado en botón de tabla:", btn.dataset);
                // Necesitamos encontrar el ID. Si admin-table no pone data-id en el botón, esto fallará.
                // Pero intentaremos leerlo del dataset.
                const action = btn.dataset.action; // 'editar', 'eliminar', 'ver'
                // Para obtener la fila completa, necesitamos buscar en los datos usando el ID si está disponible
                const id = btn.dataset.id; 
                
                if (action && id) {
                    const row = this.allServices.find(s => String(s.id) === String(id));
                    this.handleTableAction(action, row);
                }
            }
        });
    }

    // --- C. Buscador ---
    this.searchEl?.addEventListener("search:change", (e) => {
      this.applySearch(e.detail.value);
    });

    // --- D. Cerrar Modales ---
    const closeModals = () => {
      this.modal.classList.remove("is-open");
      this.deleteModal.classList.remove("is-open");
      this.viewModal.classList.remove("is-open");
    };
    
    this.root.querySelectorAll(".modal-close, #cancelBtn, #cancelDeleteBtn, #okViewBtn").forEach(btn => 
      btn.addEventListener("click", closeModals)
    );

    // Cerrar al click fuera (Backdrop)
    [this.modal, this.deleteModal, this.viewModal].forEach(m => {
        if(m) m.addEventListener("click", (e) => {
            if(e.target === m) closeModals();
        });
    });

    // --- E. Submit Formulario ---
    this.form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleSave();
    });

    // --- F. Confirmar Eliminar ---
    this.confirmDeleteBtn?.addEventListener("click", async () => {
      await this.handleDelete();
    });
  }

  // Helper para manejar las acciones
  handleTableAction(action, row) {
    if (!row) {
        console.warn("⚠️ Acción recibida sin datos de fila");
        return;
    }
    console.log(`✅ Ejecutando acción: ${action} para ID: ${row.id}`);

    if (action === "editar") this.openEditModal(row.id);
    if (action === "eliminar") this.openDeleteModal(row.id, row.nombre);
    if (action === "ver") this.openViewModal(row.id);
  }

  applySearch(q) {
    if (!q || q.trim() === "") {
      this.filteredServices = [...this.allServices];
    } else {
      this.filteredServices = ServicesLogic.filter(this.allServices, q);
    }
    this.renderTable();
  }

  renderTable() {
    if (!this.table) return;
    
    this.table.columns = [
      { key: "nombre", label: "Nombre" },
      { key: "descripcion", label: "Descripción" },
      { key: "duracion", label: "Duración" },
      { key: "precio", label: "Precio" },
      { 
        key: "acciones", 
        label: "Acciones", 
        type: "actions", 
        actions: [
          { key: "ver", label: "Ver", variant: "dark" },
          { key: "editar", label: "Editar", variant: "primary" },
          { key: "eliminar", label: "Eliminar", variant: "danger" }
      ]}
    ];

    // IMPORTANTE: Aseguramos que los datos tengan lo necesario
    this.table.data = this.filteredServices.map(s => ({ 
        ...s, 
        acciones: true // Esto le dice a admin-table que pinte los botones
    }));
  }

  // --- LOGICA MODALES ---

  openCreateModal() {
    this.currentMode = "create";
    this.modalTitle.textContent = "Nuevo Servicio";
    this.saveBtnText.textContent = "Guardar servicio";
    this.form.reset();
    this.inputId.value = "";
    this.modal.classList.add("is-open");
  }

  async openEditModal(id) {
    try {
      const service = await ServicesLogic.getServiceById(id);
      this.currentMode = "edit";
      this.modalTitle.textContent = "Editar Servicio";
      this.saveBtnText.textContent = "Guardar cambios";
      
      this.inputId.value = service.id_servicio || service.id;
      this.inputNombre.value = service.nombre;
      this.inputDescripcion.value = service.descripcion;
      
      // Manejo seguro de valores numéricos
      this.inputDuracion.value = service.rawDuration || service.duracion_estimada || "";
      this.inputPrecio.value = service.rawPrice || service.precio_con_utilidad || "";

      this.modal.classList.add("is-open");
    } catch(e) {
      alert("Error: " + e.message);
    }
  }

  async openViewModal(id) {
    try {
      const service = await ServicesLogic.getServiceById(id);
      this.root.querySelector("#viewNombre").value = service.nombre;
      this.root.querySelector("#viewDescripcion").value = service.descripcion;
      this.root.querySelector("#viewDetalles").value = `$${service.precio_con_utilidad} • ${service.duracion_estimada} min`;
      this.viewModal.classList.add("is-open");
    } catch(e) {
      alert("Error al cargar detalles");
    }
  }

  openDeleteModal(id, name) {
    this.deleteServiceId = id;
    this.deleteNameEl.textContent = name;
    this.deleteModal.classList.add("is-open");
  }

  async handleSave() {
    const data = {
      nombre: this.inputNombre.value,
      descripcion: this.inputDescripcion.value,
      duracion_estimada: this.inputDuracion.value,
      precio_con_utilidad: this.inputPrecio.value
    };

    try {
      this.saveBtn.disabled = true;
      this.saveBtnText.textContent = "Guardando...";
      
      if(this.currentMode === "create") {
        await ServicesLogic.createService(data);
      } else {
        await ServicesLogic.updateService(this.inputId.value, data);
      }

      await this.loadData();
      this.modal.classList.remove("is-open");
    } catch(e) {
      alert("Error al guardar: " + e.message);
    } finally {
      this.saveBtn.disabled = false;
      this.saveBtnText.textContent = this.currentMode === "create" ? "Guardar servicio" : "Guardar cambios";
    }
  }

  async handleDelete() {
    if(!this.deleteServiceId) return;
    try {
        this.confirmDeleteBtn.textContent = "Eliminando...";
        this.confirmDeleteBtn.disabled = true;
        await ServicesLogic.deleteService(this.deleteServiceId);
        await this.loadData();
        this.deleteModal.classList.remove("is-open");
    } catch(e) {
        alert("Error al eliminar: " + e.message);
    } finally {
        this.confirmDeleteBtn.textContent = "Eliminar";
        this.confirmDeleteBtn.disabled = false;
    }
  }
}

customElements.define("services-page", ServicesPage);
export default ServicesPage;