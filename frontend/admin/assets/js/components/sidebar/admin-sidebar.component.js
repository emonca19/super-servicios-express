import { adminSidebarTemplate } from "./admin-sidebar.template.js";
import { adminSidebarStyles } from "./admin-sidebar.styles.js";
import { injectStyles } from "../../utils/shadow-style-loader.js";
import { AdminSidebarLogic } from "./logic.js";

class AdminSidebar extends HTMLElement {

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });

    this.fullWidth = 260;   // modo extendido
    this.slimWidth = 60;    // iconos
    this.threshold = 150;   // punto donde cambia a slim

    this.isSlim = false;
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
  }

 
enableDragging() {
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
    if (!dragging) return;

    const cursorX = e.clientX;
    const threshold = this.fullWidth - 40;

    if (cursorX < threshold && !this.isSlim) {
      this.sidebar.classList.add("slim");
      this.sidebar.style.width = this.slimWidth + "px";
      this.isSlim = true;
      
      this.dispatchEvent(new CustomEvent('sidebar:modechange', {
        detail: { slim: true },
        bubbles: true
      }));
      return;
    }

    if (cursorX >= threshold && this.isSlim) {
      this.sidebar.classList.remove("slim");
      this.sidebar.style.width = this.fullWidth + "px";
      this.isSlim = false;
      
      this.dispatchEvent(new CustomEvent('sidebar:modechange', {
        detail: { slim: false },
        bubbles: true
      }));
      return;
    }
  });
}

}

customElements.define("admin-sidebar", AdminSidebar);
export default AdminSidebar;
