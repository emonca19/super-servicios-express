import { injectStyles } from "../../utils/shadow-style-loader.js";
import { adminSearchStyles } from "./admin-search.styles.js";
import { adminSearchTemplate } from "./admin-search.template.js";
import { AdminSearchLogic } from "./logic.js";

class AdminSearch extends HTMLElement {

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });

    this.debounceTimer = null;
    this.debounce = Number(this.getAttribute("debounce")) || 300;
  }

  async connectedCallback() {
    const css = await injectStyles(adminSearchStyles);

    const style = document.createElement("style");
    style.textContent = css;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = adminSearchTemplate();

    this.root.appendChild(style);
    this.root.appendChild(wrapper);

    this.setupListener();
    
    // Configurar placeholder si existe el atributo
    const placeholder = this.getAttribute("placeholder");
    if (placeholder) {
      this.root.querySelector("input").placeholder = placeholder;
    }
  }

  setupListener() {
    const input = this.root.querySelector("input");

    input.addEventListener("input", (e) => {
      clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        
        let raw = input.value;
        let processed = AdminSearchLogic.normalize(raw);

        this.dispatchEvent(
          new CustomEvent("search:change", {
            detail: { 
              raw,
              value: processed 
            },
            bubbles: true,
            composed: true,
          })
        );

      }, this.debounce);
    });
  }

  set value(v) {
    this.root.querySelector("input").value = v;
  }

  get value() {
    return this.root.querySelector("input").value;
  }

  // Método para limpiar el search
  clear() {
    this.value = "";
    this.dispatchEvent(new CustomEvent("search:change", {
      detail: { raw: "", value: "" },
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define("admin-search", AdminSearch);
export default AdminSearch;