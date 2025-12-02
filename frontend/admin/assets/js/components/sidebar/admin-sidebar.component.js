import { adminSidebarTemplate } from "./admin-sidebar.template.js";
import { adminSidebarStyles } from "./admin-sidebar.styles.js";
import { injectStyles } from "../../utils/shadow-style-loader.js";
import { AdminSidebarLogic } from "./logic.js";

const STORAGE_KEY = "admin:sidebar:slim";

class AdminSidebar extends HTMLElement {

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });

    this.fullWidth = 260;   // modo extendido
    this.slimWidth = 60;    // iconos
    this.threshold = 150;   // (ya no lo usamos directo, pero lo dejamos por si lo reusas)

    this.isSlim = false;

    // por si luego quieres limpiar listeners, pero de momento no es crítico
    this._dragging = false;
  }

  async connectedCallback() {
    const css = await injectStyles(adminSidebarStyles);

    const style = document.createElement("style");
    style.textContent = css;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = adminSidebarTemplate();

    this.root.appendChild(style);
    this.root.appendChild(wrapper);

    this.sidebar = this.root.querySelector("#sidebar");
    this.handle = this.root.querySelector("#resize-handle");

    this.enableDragging();
    AdminSidebarLogic.highlightCurrentPage(this.root);

    this._restoreSlimMode();
  }

  /**
   * Lee localStorage y aplica el modo slim si estaba activado.
   */
  _restoreSlimMode() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const shouldBeSlim = saved === "1";
      this._applySlimMode(shouldBeSlim, { emit: false });
    } catch (e) {
      console.warn("[sidebar] no se pudo leer localStorage", e);
    }
  }

  /**
   * Aplica el modo slim/normal al sidebar, guarda en localStorage
   * y emite el evento sidebar:modechange si corresponde.
   */
  _applySlimMode(isSlim, { emit = true } = {}) {
    this.isSlim = isSlim;

    if (!this.sidebar) return;

    if (isSlim) {
      this.sidebar.classList.add("slim");
      this.sidebar.style.width = this.slimWidth + "px";
    } else {
      this.sidebar.classList.remove("slim");
      this.sidebar.style.width = this.fullWidth + "px";
    }

    try {
      localStorage.setItem(STORAGE_KEY, isSlim ? "1" : "0");
    } catch (e) {
      console.warn("[sidebar] no se pudo guardar localStorage", e);
    }

    if (emit) {
      this.dispatchEvent(new CustomEvent("sidebar:modechange", {
        detail: { slim: isSlim },
        bubbles: true,
        composed: true,   
      }));
    }
  }

  enableDragging() {
    if (!this.handle) return;

    let dragging = false;

    this.handle.addEventListener("mousedown", () => {
      dragging = true;
      document.body.style.userSelect = "none";
    });

    window.addEventListener("mouseup", () => {
      dragging = false;
      document.body.style.userSelect = "";
    });

    window.addEventListener("mousemove", (e) => {
      if (!dragging || !this.sidebar) return;

      const cursorX = e.clientX;
      const threshold = this.fullWidth - 40; 

      if (cursorX < threshold && !this.isSlim) {
        this._applySlimMode(true);
        return;
      }

      if (cursorX >= threshold && this.isSlim) {
        this._applySlimMode(false);
        return;
      }
    });
  }
}

customElements.define("admin-sidebar", AdminSidebar);
export default AdminSidebar;
