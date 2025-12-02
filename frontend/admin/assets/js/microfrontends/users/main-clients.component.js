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
    wrapper.innerHTML = clientsTemplate();

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

    // Inicialización
    await this.loadData();
    this.setupSearchListener();
    this.setupTableEvents(); // <--- IMPORTANTE: Escuchar clicks en la tabla
    this.setupModalEvents(); // <--- IMPORTANTE: Cerrar y Guardar modal
  }

  // ... (loadData y setupSearchListener se mantienen igual) ...
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

  applySearch(q) {
    if (!q || q.trim() === "") {
      this.filteredClients = [...this.allClients];
    } else {
      this.filteredClients = ClientsLogic.filter(this.allClients, q);
    }
    this.renderTable();
  }

  // --- 1. CONFIGURAR TABLA Y DETECTAR CLICK EN EDITAR ---
  setupTableEvents() {
    // Escuchamos el evento personalizado que dispara tu componente <admin-table>
    // Si tu tabla dispara un evento 'action', úsalo. Si no, usamos 'click' nativo.
    
    // OPCIÓN A: Si tu admin-table dispara CustomEvents (Recomendado)
    this.table.addEventListener("table:action", (e) => {
      const { action, row } = e.detail; // row debe tener el ID o el objeto cliente
      if (action === "editar") {
        this.openEditModal(row.id);
      }
    });

    // OPCIÓN B: Delegación de eventos nativa (si tu tabla renderiza botones HTML plano)
    // Esto funciona aunque la tabla se re-renderice
    this.table.addEventListener("click", (e) => {
      // Buscamos si el click fue dentro de un botón con acción 'editar'
      // Esto depende de cómo tu <admin-table> renderiza las acciones.
      // Asumiremos que el botón tiene un atributo data-id y una clase o atributo de acción.
      const btn = e.target.closest("button[data-action='editar']");
      if (btn) {
        const id = btn.dataset.id; // Asegúrate que tu tabla ponga el ID aquí
        this.openEditModal(id);
      }
    });
  }

  // --- 2. ABRIR Y LLENAR MODAL ---
 // assets/js/microfrontends/users/index.js

  async openEditModal(id) {
    // 1. VERIFICAR EL ID
    console.log("--> Intentando editar cliente con ID:", id);

    if (!id || id === "undefined") {
      console.error("❌ Error: El ID del cliente es indefinido o nulo.");
      alert("No se pudo identificar el cliente (ID incorrecto).");
      return;
    }

    try {
      // 2. VERIFICAR LA RESPUESTA DE LA API
      const client = await ClientsLogic.getClientById(id);
      console.log("--> Datos recibidos de la API:", client);

      if (!client) throw new Error("La API devolvió datos vacíos");

      // Llenamos el formulario
      // OJO: Asegúrate de usar las propiedades correctas (nombre, email, etc.)
      this.root.querySelector("#editId").value = client.id_cliente || client.id;
      this.root.querySelector("#editNombre").value = client.nombre || "";
      this.root.querySelector("#editEmail").value = client.email || "";
      this.root.querySelector("#editTelefono").value = client.telefono || "";
      this.root.querySelector("#editDireccion").value = client.direccion || "";

      this.modal.classList.remove("hidden");
      this.modal.classList.add("flex");

    } catch (error) {
      // 3. VER EL ERROR REAL
      console.error("❌ Error CRÍTICO en openEditModal:", error);
      alert(`Error: ${error.message}`);
    }
  }
  // --- 3. CERRAR Y GUARDAR ---
  setupModalEvents() {
    const closeModal = () => {
      this.modal.classList.add("hidden");
      this.modal.classList.remove("flex");
      this.form.reset();
    };

    this.root.querySelector("#closeModalBtn").addEventListener("click", closeModal);
    this.root.querySelector("#cancelBtn").addEventListener("click", closeModal);

    // Cerrar al dar click fuera del modal (backdrop)
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) closeModal();
    });

    // GUARDAR
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

        // Llamamos a la lógica
        await ClientsLogic.updateClient(id, dataToUpdate);

        // Éxito
        closeModal();
        await this.loadData(); // Recargar tabla
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
    if (!this.table) return;

    this.table.columns = [
      { key: "nombre", label: "Nombre" },
      { key: "telefono", label: "Teléfono" },
      { key: "email", label: "Correo" },
      { key: "vehiculos", label: "Vehículos" },
      { 
        key: "acciones", 
        label: "Acciones", 
        type: "actions",
        actions: [
          // IMPORTANTE: data-action y data-id son necesarios si usas la Opción B de eventos
          { key: "editar", label: "Editar", variant: "primary", icon: "pencil" },
          { key: "eliminar", label: "Eliminar", variant: "danger", icon: "trash" }
        ]
      }
    ];

    // Aseguramos pasar el ID real en cada fila
    this.table.data = this.filteredClients.map(client => ({
      id: client.id, // NECESARIO para que el botón sepa qué editar
      nombre: client.nombre,
      telefono: client.telefono,
      email: client.email,
      vehiculos: client.vehiculos,
      acciones: true // Activa la columna de acciones
    }));
  }
}

customElements.define("clients-page", ClientsPage);
export default ClientsPage;