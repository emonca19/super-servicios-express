import { adminNavbarTemplate } from "./admin-navbar.template.js";
import { adminNavbarStyles } from "./admin-navbar.styles.js";
import { injectStyles } from "../../utils/shadow-style-loader.js";
import { AdminNavbarLogic } from "./logic.js";

class AdminNavbar extends HTMLElement {

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const css = await injectStyles(adminNavbarStyles);

    const style = document.createElement("style");
    style.textContent = css;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = adminNavbarTemplate();

    this.root.appendChild(style);
    this.root.appendChild(wrapper);

    this.setupListeners();
  }

  setupListeners() {
    const bell = this.root.querySelector(".notification-btn");

    bell.addEventListener("click", () => {
      AdminNavbarLogic.onNotificationClick(() => {
        console.log("Notificaciones abiertas...");
      });
    });
  }
}

customElements.define("admin-navbar", AdminNavbar);
export default AdminNavbar;
