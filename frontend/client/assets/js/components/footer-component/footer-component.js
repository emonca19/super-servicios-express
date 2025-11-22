import { footerTemplate } from './footer-component.template.js';
import { footerComponentStyles } from './footer-component.styles.js';
import { injectStyles } from '../../utils/shadow-style-loader.js';

const templateCache = document.createElement('template');

class FooterComponent extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const yearAttr = this.getAttribute('year');
        const year = yearAttr ? Number(yearAttr) : undefined;

        if (!templateCache.innerHTML) {
            templateCache.innerHTML = footerTemplate(year);
        }

        this.root.innerHTML = '';
        await injectStyles(this.root, footerComponentStyles);
        this.root.appendChild(templateCache.content.cloneNode(true));
    }
}

customElements.define('footer-component', FooterComponent);
