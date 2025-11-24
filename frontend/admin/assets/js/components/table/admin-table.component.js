import { injectStyles } from "../../utils/shadow-style-loader.js";
import { adminTableStyles } from "./admin-table.styles.js";
import { adminTableTemplate } from "./admin-table.template.js";

class AdminTable extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });

    this._columns = [];
    this._data = [];

    this._handleClick = this._handleClick.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  set columns(value) {
    this._columns = Array.isArray(value) ? value : [];
    this.render();
  }

  get columns() {
    return this._columns;
  }

  set data(value) {
    this._data = Array.isArray(value) ? value : [];
    this.render();
  }

  get data() {
    return this._data;
  }

  set rows(value) {
    this.data = value;
  }

  get rows() {
    return this.data;
  }

  async connectedCallback() {
    const css = await injectStyles(adminTableStyles);

    const style = document.createElement("style");
    style.textContent = css;

    this.wrapper = document.createElement("div");
    this.wrapper.innerHTML = adminTableTemplate(this._columns, this._data);

    this.root.appendChild(style);
    this.root.appendChild(this.wrapper);

    this.root.addEventListener("click", this._handleClick);
    this.root.addEventListener("change", this._handleChange);
  }

  disconnectedCallback() {
    this.root.removeEventListener("click", this._handleClick);
    this.root.removeEventListener("change", this._handleChange);
  }

  render() {
    if (!this.wrapper) return;
    this.wrapper.innerHTML = adminTableTemplate(this._columns, this._data);
  }

  _handleClick(e) {
    const btn = e.target.closest("button[data-type='action']");
    if (!btn) return;

    const rowIndex = parseInt(btn.dataset.row, 10);
    const actionKey = btn.dataset.action;
    const row = this._data[rowIndex];

    this.dispatchEvent(
      new CustomEvent("table:action", {
        detail: {
          rowIndex,
          action: actionKey,
          row,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  _handleChange(e) {
    const input = e.target;
    if (!input.matches("input[type='checkbox'][data-type='switch']")) return;

    const rowIndex = parseInt(input.dataset.row, 10);
    const key = input.dataset.key;
    const value = input.checked;
    const row = this._data[rowIndex];

    this.dispatchEvent(
      new CustomEvent("table:switch-change", {
        detail: {
          rowIndex,
          key,
          value,
          row,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("admin-table", AdminTable);
export default AdminTable;
