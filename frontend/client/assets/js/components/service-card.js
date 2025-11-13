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
    const image = this.getAttribute('image') || './assets/images/default-service.jpg';

    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
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

    this.attachEventListeners();
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

    // Remove previous listener if any (defensive)
    bookBtn.replaceWith(bookBtn.cloneNode(true));
    const freshBtn = this.shadowRoot.querySelector('.btn-book');

    freshBtn.addEventListener('click', () => {
      const serviceId = this.getAttribute('id');
      this.dispatchEvent(new CustomEvent('service-selected', {
        detail: { serviceId },
        bubbles: true,
        composed: true
      }));
      // Navegar a la página de agendar
      window.location.href = `agendar-cita.html?service=${serviceId}`;
    });
  }

  styles() {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .service-card {
        background: white;
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
      }

      .service-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      }

      .service-image {
        width: 100%;
        height: 200px;
        overflow: hidden;
      }

      .service-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      .service-card:hover .service-image img {
        transform: scale(1.1);
      }

      .service-content {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      .service-name {
        font-size: 1.25rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.75rem;
      }

      .service-description {
        font-size: 0.875rem;
        color: #64748b;
        line-height: 1.6;
        margin-bottom: 1.5rem;
        flex: 1;
      }

      .service-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
      }

      .service-price {
        font-size: 1.5rem;
        font-weight: 700;
        color: #10b981;
      }

      .btn-book {
        padding: 0.5rem 1.25rem;
        background-color: #4169e1;
        color: white;
        border: none;
        border-radius: 0.375rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-book:hover {
        background-color: #2c54c7;
        transform: translateY(-2px);
      }
    `;
  }
}

customElements.define('service-card', ServiceCard);
