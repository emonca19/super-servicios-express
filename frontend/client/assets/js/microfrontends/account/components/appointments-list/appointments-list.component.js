import { injectStyles } from '../../../../utils/shadow-style-loader.js';
import { appointmentsListTemplate } from './appointments-list.template.js';
import { appointmentsListStyles } from './appointments-list.styles.js';

class AppointmentsList extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this._appointments = [];
    }

    static get observedAttributes() {
        return ['appointments-data'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'appointments-data' && oldValue !== newValue) {
            try {
                this._appointments = JSON.parse(newValue) || [];
                this.render();
            } catch (e) {
                console.warn('[appointments-list] Invalid appointments data', e);
            }
        }
    }

    set appointments(data) {
        this._appointments = data || [];
        this.render();
    }

    get appointments() {
        return this._appointments;
    }

    async connectedCallback() {
        await this.render();
    }

    async render() {
        this.root.innerHTML = '';
        await injectStyles(this.root, appointmentsListStyles);

        const container = document.createElement('div');
        container.innerHTML = appointmentsListTemplate(this._appointments);
        this.root.appendChild(container);

        this.setupEventListeners();
    }

    setupEventListeners() {
        const cancelBtns = this.root.querySelectorAll('[data-action="cancel"]');
        cancelBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm('¿Deseas cancelar esta cita?')) {
                    this.dispatchEvent(new CustomEvent('cancel-appointment', {
                        detail: { id },
                        bubbles: true,
                        composed: true
                    }));
                }
            });
        });
    }
}

customElements.define('appointments-list', AppointmentsList);
export { AppointmentsList };
