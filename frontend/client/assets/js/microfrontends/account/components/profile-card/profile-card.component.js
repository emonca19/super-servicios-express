import { injectStyles } from '../../../../utils/shadow-style-loader.js';
import { profileCardTemplate } from './profile-card.template.js';
import { profileCardStyles } from './profile-card.styles.js';

class ProfileCard extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this._profile = null;
    }

    static get observedAttributes() {
        return ['profile-data'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'profile-data' && oldValue !== newValue) {
            try {
                this._profile = JSON.parse(newValue);
                this.render();
            } catch (e) {
                console.warn('[profile-card] Invalid profile data', e);
            }
        }
    }

    set profile(data) {
        this._profile = data;
        this.render();
    }

    get profile() {
        return this._profile;
    }

    async connectedCallback() {
        await this.render();
    }

    async render() {
        this.root.innerHTML = '';
        await injectStyles(this.root, profileCardStyles);

        const container = document.createElement('div');
        container.innerHTML = profileCardTemplate(this._profile);
        this.root.appendChild(container);

        this.setupEventListeners();
    }

    setupEventListeners() {
        const editBtns = this.root.querySelectorAll('[data-action="edit"]');
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const field = e.currentTarget.dataset.field;
                this.dispatchEvent(new CustomEvent('edit-profile', {
                    detail: { field },
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }
}

customElements.define('profile-card', ProfileCard);
export { ProfileCard };
