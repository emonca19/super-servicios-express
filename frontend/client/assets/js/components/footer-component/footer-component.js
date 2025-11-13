import { footerTemplate } from './footer-component.template.js';
import { footerComponentStyles } from './footer-component.styles.js';

class FooterComponent extends HTMLElement {
    connectedCallback() {
        const yearAttr = this.getAttribute('year');
        const year = yearAttr ? Number(yearAttr) : undefined;
        this.innerHTML = `<style>${footerComponentStyles}</style>` + footerTemplate(year);
    }
}

customElements.define('footer-component', FooterComponent);
