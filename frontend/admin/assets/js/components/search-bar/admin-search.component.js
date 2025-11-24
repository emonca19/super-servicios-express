import { injectStyles } from "../../utils/shadow-style-loader.js";
import { adminSearchStyles } from "./admin-search.styles.js";
import { adminSearchTemplate } from "./admin-search.template.js";
import { AdminSearchLogic } from "./logic.js";

class AdminSearch extends HTMLElement {

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });

    this.debounceTimer = null;
    this.debounce = Number(this.getAttribute("debounce")) || 200;
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
  }

  setupListener() {
    const input = this.root.querySelector("input");

    input.addEventListener("input", (e) => {
      clearTimeout(this.debounceTimer);

      this.debounceTimer = setTimeout(() => {
        
        let raw = e.target.value;
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
}

customElements.define("admin-search", AdminSearch);
export default AdminSearch;
