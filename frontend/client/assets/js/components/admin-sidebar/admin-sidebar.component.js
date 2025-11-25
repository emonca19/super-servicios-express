// assets/js/components/admin-sidebar/admin-sidebar.component.js

import { adminSidebarTemplate } from "./admin-sidebar.template.js";
import { adminSidebarStyles } from "./admin-sidebar.styles.js";
import { injectStyles } from "../../utils/shadow-style-loader.js";

class AdminSidebar extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    await this.render();
  }

  async render() {
    const template = document.createElement("template");
    template.innerHTML = adminSidebarTemplate();

    this.root.innerHTML = "";
    await injectStyles(this.root, adminSidebarStyles);
    this.root.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("admin-sidebar", AdminSidebar);

export { AdminSidebar };
export default AdminSidebar;
