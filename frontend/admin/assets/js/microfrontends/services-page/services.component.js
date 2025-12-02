// Importa funciones y modulos necesarios
import { injectStyles } from "../../utils/shadow-style-loader.js";
import { servicesTemplate } from "./services.template.js";
import { servicesStyles } from "./services.styles.js";
import { ServicesLogic } from "./logic.js";

import "../../components/search-bar/index.js";


// Define el componente de pagina de servicios
class ServicesPage extends HTMLElement {

  constructor() {
    super();
    // Crea el shadow DOM
    this.root = this.attachShadow({ mode: "open" });
    // Lista completa de servicios
    this.allServices = [];
    // Lista filtrada de servicios (para busqueda)
    this.filteredServices = [];
  }

  // Se ejecuta cuando el componente se agrega al DOM
  async connectedCallback() {
    // Carga estilos como texto css
    const css = await injectStyles(servicesStyles);

    // Crea etiqueta style y agrega el css
    const style = document.createElement("style");
    style.textContent = css;

    // Crea el contenedor principal y agrega el template HTML
    const wrapper = document.createElement("div");
    wrapper.innerHTML = servicesTemplate();

    // Agrega estilos y contenido al shadow DOM
    this.root.appendChild(style);
    this.root.appendChild(wrapper);

    // Espera a que los web components usados esten listos
    await Promise.all([
      customElements.whenDefined("admin-search"),
      customElements.whenDefined("admin-table")
    ]);

    // Carga datos iniciales y configura eventos
    await this.loadData();
    this.setupSearchListener();
    this.setupNewServiceButton();
  }

  // Carga todos los servicios desde la logica
  async loadData() {
    // Trae todos los servicios desde ServicesLogic
    this.allServices = await ServicesLogic.fetchServices();
    // Copia la lista para la vista filtrada
    this.filteredServices = [...this.allServices];
    // Renderiza la tabla con los datos
    this.renderTable();
  }

  // Configura el escuchador del componente de busqueda
  setupSearchListener() {
    const search = this.root.querySelector("admin-search");
    if (!search) return;

    // Escucha el evento personalizado de cambio de busqueda
    search.addEventListener("search:change", (e) => {
      const q = e.detail.value;
      this.applySearch(q);
    });
  }

  // Configura el boton para crear un nuevo servicio
  setupNewServiceButton() {
    const btn = this.root.querySelector("#newServiceBtn");
    if (btn) {
      btn.addEventListener("click", () => {
        // Lanza un evento al exterior para indicar que se quiere crear un nuevo servicio
        this.dispatchEvent(new CustomEvent("service:new", {
          bubbles: true,
          composed: true
        }));
      });
    }
  }

  // Aplica filtro de busqueda a la lista de servicios
  applySearch(q) {
    // Si no hay texto, muestra todos los servicios
    if (!q.trim()) {
      this.filteredServices = [...this.allServices];
    } else {
      // Si hay texto, usa la logica de filtro
      this.filteredServices = ServicesLogic.filter(this.allServices, q);
    }
    // Actualiza la tabla con los resultados
    this.renderTable();
  }

  // Renderiza la tabla con columnas y datos
  renderTable() {
    const table = this.root.querySelector("#servicesTable");
    if (!table) return;

    // Define columnas que usara admin-table
    table.columns = [
      { key: "nombre", label: "Nombre" },
      { key: "descripcion", label: "Descripcion" },
      { key: "duracion", label: "Duracion" },
      { key: "precio", label: "Precio" },
      { key: "disponible", label: "Disponible", type: "switch" },
      { key: "acciones", label: "Acciones", type: "actions" }
    ];

    // Asigna datos de la tabla, agregando campo de acciones
    table.data = this.filteredServices.map(s => ({
      ...s,
      acciones: true
    }));
  }

}

// Registra el web component en el navegador
customElements.define("services-page", ServicesPage);

// Exporta la clase para usarla en otros modulos
export default ServicesPage;
