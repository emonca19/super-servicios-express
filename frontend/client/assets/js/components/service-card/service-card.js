import { serviceCardStyles } from './service-card.styles.js';
import { injectStyles } from '../../utils/shadow-style-loader.js';

class ServiceCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['id', 'name', 'description', 'price', 'image'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const id = this.getAttribute('id') || '';
    const name = this.getAttribute('name') || 'Servicio';
    const description = this.getAttribute('description') || '';
    const price = this.getAttribute('price') || '0';
    const image = this.getAttribute('image') || './assets/images/default-service.svg';

    // Build content first, then inject styles (including compiled Tailwind)
    const content = `
      <article class="service-card">
        <div class="service-image">
          <img src="${image}" alt="${name}" loading="lazy">
        </div>
        <div class="service-content">
          <h3 class="service-name">${name}</h3>
          <p class="service-description">${description}</p>
          <div class="service-footer">
            <span class="service-price">$${this.formatPrice(price)}</span>
            <button class="btn-book" data-service-id="${id}">
              Ver más
            </button>
          </div>
        </div>
      </article>
    `;

    // Inject styles (tailwind + component styles) and content
    this.shadowRoot.innerHTML = '';
    injectStyles(this.shadowRoot, serviceCardStyles).then(() => {
      this.shadowRoot.innerHTML += content;
      this.attachEventListeners();
    });
  }

  formatPrice(price) {
    const n = Number(price) || 0;
    return n.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  attachEventListeners() {
    const bookBtn = this.shadowRoot.querySelector('.btn-book');
    if (!bookBtn) return;

    bookBtn.replaceWith(bookBtn.cloneNode(true));
    const freshBtn = this.shadowRoot.querySelector('.btn-book');

    freshBtn.addEventListener('click', () => {
      const serviceId = this.getAttribute('id');
      this.dispatchEvent(new CustomEvent('service-selected', {
        detail: { serviceId },
        bubbles: true,
        composed: true
      }));
      // El componente solo notifica la selección; el host decide la navegación.
    });
  }

}

customElements.define('service-card', ServiceCard);
