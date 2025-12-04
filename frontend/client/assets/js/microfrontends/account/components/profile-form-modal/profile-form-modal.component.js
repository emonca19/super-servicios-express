import { injectStyles } from '../../../../utils/shadow-style-loader.js';
import { profileFormModalTemplate } from './profile-form-modal.template.js';
import { profileFormModalStyles } from './profile-form-modal.styles.js';

class ProfileFormModal extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this._isOpen = false;
        this._data = {};
    }

    static get observedAttributes() {
        return ['open', 'profile-data'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'open') {
            this._isOpen = newValue !== null && newValue !== 'false';
            this.render();
        }
        if (name === 'profile-data' && oldValue !== newValue) {
            try {
                this._data = JSON.parse(newValue) || {};
                this.render();
            } catch (e) {
                console.warn('[profile-form-modal] Invalid data', e);
            }
        }
    }

    get open() {
        return this._isOpen;
    }

    set open(val) {
        if (val) this.setAttribute('open', '');
        else this.removeAttribute('open');
    }

    set data(val) {
        this._data = val || {};
        this.setAttribute('profile-data', JSON.stringify(this._data));
    }

    async connectedCallback() {
        await this.render();
    }

    async render() {
        this.root.innerHTML = '';
        await injectStyles(this.root, profileFormModalStyles);

        const container = document.createElement('div');
        container.innerHTML = profileFormModalTemplate(this._isOpen, this._data);
        this.root.appendChild(container);

        if (this._isOpen) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        const form = this.root.querySelector('#profile-form');
        const cancelBtns = this.root.querySelectorAll('[data-action="cancel"]');
        const modalOverlay = this.root.querySelector('#profile-modal');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                this.dispatchEvent(new CustomEvent('save-profile', {
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

customElements.define('profile-form-modal', ProfileFormModal);
export { ProfileFormModal };
