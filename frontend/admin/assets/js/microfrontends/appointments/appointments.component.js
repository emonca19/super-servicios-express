import { injectStyles } from "../../utils/shadow-style-loader.js";
import { appointmentsTemplate } from "./appointments.template.js";
import { appointmentsStyles } from "./appointments.styles.js";
import { AppointmentsLogic } from "./logic.js";
import "../../components/search-bar/index.js";

class AppointmentsPage extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.allAppointments = [];
    this.currentFilter = AppointmentsLogic.FILTERS.ALL;
    this.options = { clients: [], vehicles: [], services: [] };
    this.currentMode = "create";
    this.deleteId = null;
  }

  async connectedCallback() {
    const style = document.createElement("style");
    try {
        const css = await injectStyles(appointmentsStyles);
        style.textContent = css || appointmentsStyles;
    } catch(e) { style.textContent = appointmentsStyles; }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = appointmentsTemplate(this.currentFilter);
    this.root.appendChild(style);
    this.root.appendChild(wrapper);

    await customElements.whenDefined("admin-table");

    this.table = this.root.querySelector("#tabla-appointments");
    this.filterBar = this.root.querySelector(".filters");
    this.modal = this.root.querySelector("#appModal");
    this.viewModal = this.root.querySelector("#viewModal");
    this.deleteModal = this.root.querySelector("#deleteModal");
    this.form = this.root.querySelector("#appForm");
    this.inpId = this.root.querySelector("#appId");
    this.inpFecha = this.root.querySelector("#appFecha");
    this.inpHora = this.root.querySelector("#appHora");
    this.selCliente = this.root.querySelector("#appCliente");
    this.selAuto = this.root.querySelector("#appAuto");
    this.selServicio = this.root.querySelector("#appServicio");
    this.selEstado = this.root.querySelector("#appEstado");
    this.inpMotivo = this.root.querySelector("#appMotivo");
    this.inpObs = this.root.querySelector("#appObservaciones");
    this.modalTitle = this.root.querySelector("#modalTitle");
    this.saveBtn = this.root.querySelector("#saveBtn");

    this.loadOptions();
    this.loadData();
    this.setupListeners();
  }

  async loadOptions() {
    this.options = await AppointmentsLogic.fetchOptions();
    this.fillSelects();
  }

  async loadData() {
    this.allAppointments = await AppointmentsLogic.fetchAppointments();
    this.render();
  }

  fillSelects() {
    this.selCliente.innerHTML = '<option value="">-- Seleccione Cliente --</option>';
    this.options.clients.forEach(c => {
        this.selCliente.innerHTML += `<option value="${c.id_cliente || c.id}">${c.nombre}</option>`;
    });

    this.selServicio.innerHTML = '<option value="">-- Seleccione Servicio --</option>';
    this.options.services.forEach(s => {
        this.selServicio.innerHTML += `<option value="${s.id_servicio || s.id}">${s.nombre} ($${s.precio_con_utilidad})</option>`;
    });
  }

  filterAutosByClient(clientId) {
    this.selAuto.innerHTML = '<option value="">-- Seleccione Auto --</option>';
    if(!clientId) return;

    const autos = this.options.vehicles.filter(v => String(v.id_cliente) === String(clientId));
    autos.forEach(a => {
        this.selAuto.innerHTML += `<option value="${a.id_auto || a.id}">${a.marca} ${a.modelo} (${a.placas})</option>`;
    });
  }

  setupListeners() {
    this.filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-pill");
      if (!btn) return;
      this.currentFilter = btn.dataset.filter;
      this.render();
    });

    this.selCliente.addEventListener("change", (e) => {
        this.filterAutosByClient(e.target.value);
    });

    this.table.addEventListener("table:action", (e) => {
        const { action, row } = e.detail || {};
        if(!row) return;
        if(action === "editar") this.openEdit(row.id);
        if(action === "ver") this.openView(row.id);
        if(action === "eliminar") this.openDelete(row.id, row.service);
    });

    this.root.querySelector("#newAppointmentBtn").addEventListener("click", () => this.openCreate());

    const closeAll = () => {
        this.modal.classList.remove("is-open");
        this.viewModal.classList.remove("is-open");
        this.deleteModal.classList.remove("is-open");
    };
    this.root.querySelectorAll(".closeModal, .closeView, .closeDelete, .btn-secondary").forEach(b => 
        b.addEventListener("click", closeAll)
    );

    this.form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleSave();
    });

    this.root.querySelector("#confirmDeleteBtn").addEventListener("click", async () => {
        await this.handleDelete();
    });
  }

  render() {
    const filtered = AppointmentsLogic.filterAppointments(this.allAppointments, this.currentFilter);
    
    this.filterBar.querySelectorAll(".filter-pill").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.filter === this.currentFilter);
    });

    this.table.columns = [
        { key: "displayTime", label: "Hora" },
        { key: "client", label: "Cliente" },
        { key: "vehicle", label: "Vehículo" },
        { key: "service", label: "Servicio" },
        { key: "statusLabel", label: "Estado", type: "badge" },
        { key: "acciones", label: "Acciones", type: "actions", actions: [
            { key: "ver", label: "Ver", variant: "dark" },
            { key: "editar", label: "Editar", variant: "primary" },
            { key: "eliminar", label: "Eliminar", variant: "danger" }
        ]}
    ];
    this.table.data = filtered.map(a => ({ ...a, acciones: true }));
  }

  openCreate() {
    this.currentMode = "create";
    this.modalTitle.textContent = "Agendar Cita";
    this.form.reset();
    this.inpId.value = "";
    this.selAuto.innerHTML = '<option value="">Seleccione Cliente primero</option>';
    this.modal.classList.add("is-open");
  }

  async openEdit(id) {
    try {
        const cita = await AppointmentsLogic.getAppointmentById(id);
        this.currentMode = "edit";
        this.modalTitle.textContent = "Editar Cita";
        
        this.inpId.value = cita.id_cita || cita.id;
        
        const d = new Date(cita.inicio);
        this.inpFecha.value = d.toISOString().split('T')[0];
        this.inpHora.value = d.toTimeString().slice(0,5);

        this.selCliente.value = cita.id_cliente;
        this.filterAutosByClient(cita.id_cliente);
        this.selAuto.value = cita.id_auto;

        this.selEstado.value = cita.estado ? cita.estado.toUpperCase() : "PENDIENTE";
        this.inpMotivo.value = cita.motivo;
        this.inpObs.value = cita.observaciones;

        if (cita.detalles && cita.detalles.length > 0) {
             this.selServicio.value = cita.detalles[0].id_servicio;
        }

        this.modal.classList.add("is-open");
    } catch(e) { alert(e.message); }
  }

  async openView(id) {
    try {
        const cita = await AppointmentsLogic.getAppointmentById(id);
        const d = new Date(cita.inicio);
        const fecha = d.toLocaleDateString();
        const hora = d.toLocaleTimeString();
        
        const cliente = this.options.clients.find(c => c.id_cliente == cita.id_cliente);
        const auto = this.options.vehicles.find(a => a.id_auto == cita.id_auto);

        this.root.querySelector("#viewCliente").value = cliente ? cliente.nombre : cita.id_cliente;
        this.root.querySelector("#viewAuto").value = auto ? `${auto.marca} ${auto.modelo}` : cita.id_auto;
        this.root.querySelector("#viewFecha").value = fecha;
        this.root.querySelector("#viewHora").value = hora;
        this.root.querySelector("#viewServicio").value = cita.motivo;
        this.root.querySelector("#viewNotas").value = cita.observaciones || "Ninguna";

        this.viewModal.classList.add("is-open");
    } catch(e) { alert("Error cargando detalles"); }
  }

  openDelete(id, name) {
    this.deleteId = id;
    this.root.querySelector("#deleteName").textContent = name;
    this.deleteModal.classList.add("is-open");
  }

  async handleSave() {
    const data = {
        id_cliente: this.selCliente.value,
        id_auto: this.selAuto.value,
        id_servicio: this.selServicio.value,
        fecha: this.inpFecha.value,
        hora: this.inpHora.value,
        estado: this.selEstado.value,
        motivo: this.inpMotivo.value,
        observaciones: this.inpObs.value,
        precio: this.options.services.find(s => s.id_servicio == this.selServicio.value)?.precio_con_utilidad
    };

    try {
        this.saveBtn.disabled = true;
        this.saveBtn.textContent = "Guardando...";

        if(this.currentMode === "create") {
            await AppointmentsLogic.createAppointment(data);
        } else {
            await AppointmentsLogic.updateAppointment(this.inpId.value, data);
        }
        
        await this.loadData();
        this.modal.classList.remove("is-open");
    } catch(e) {
        alert("Error: " + e.message);
    } finally {
        this.saveBtn.disabled = false;
        this.saveBtn.textContent = "Guardar Cita";
    }
  }

  async handleDelete() {
    if(!this.deleteId) return;
    try {
        const btn = this.root.querySelector("#confirmDeleteBtn");
        btn.textContent = "Eliminando...";
        await AppointmentsLogic.deleteAppointment(this.deleteId);
        await this.loadData();
        this.deleteModal.classList.remove("is-open");
    } catch(e) { alert(e.message); }
    finally { this.root.querySelector("#confirmDeleteBtn").textContent = "Eliminar"; }
  }
}

customElements.define("appointments-page", AppointmentsPage);
export default AppointmentsPage;