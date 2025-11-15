import { headerTemplate } from './header-component.template.js';
import { injectStyles } from '../../utils/shadow-style-loader.js';

const templateCache = document.createElement('template');

class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        if (!templateCache.innerHTML) {
            templateCache.innerHTML = headerTemplate();
        }

        this.root.innerHTML = '';
        // Inject compiled Tailwind + (no local styles for header currently)
        await injectStyles(this.root, '');
        this.root.appendChild(templateCache.content.cloneNode(true));
    }
}

customElements.define('header-component', HeaderComponent);
