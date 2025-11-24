import { injectStyles } from '../../../../utils/shadow-style-loader.js';
import { autoFormModalTemplate } from './auto-form-modal.template.js';
import { autoFormModalStyles } from './auto-form-modal.styles.js';

class AutoFormModal extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this._isOpen = false;
    }

    static get observedAttributes() {
        return ['open'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'open') {
            this._isOpen = newValue !== null && newValue !== 'false';
            this.render();
        }
    }

    get open() {
        return this._isOpen;
    }

    set open(val) {
        if (val) this.setAttribute('open', '');
        else this.removeAttribute('open');
    }

    async connectedCallback() {
        await this.render();
    }

    async render() {
        this.root.innerHTML = '';
        await injectStyles(this.root, autoFormModalStyles);

        const container = document.createElement('div');
        container.innerHTML = autoFormModalTemplate(this._isOpen);
        this.root.appendChild(container);

        if (this._isOpen) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        const form = this.root.querySelector('#auto-form');
        const cancelBtns = this.root.querySelectorAll('[data-action="cancel"]');
        const modalOverlay = this.root.querySelector('#auto-modal');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                this.dispatchEvent(new CustomEvent('save-auto', {
                    detail: data,
                    bubbles: true,
                    composed: true
                }));
            });
        }

        cancelBtns.forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) this.close();
            });
        }
    }

    close() {
        this.open = false;
        this.dispatchEvent(new CustomEvent('close-modal', {
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('auto-form-modal', AutoFormModal);
export { AutoFormModal };
