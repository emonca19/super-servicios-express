import { headerTemplate } from './header-component.template.js';

class HeaderComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = headerTemplate();
    }
}

customElements.define('header-component', HeaderComponent);
