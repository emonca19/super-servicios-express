import '../../../components/service-card/service-card.js';
import ServicesService from '../../../services/services.service.js';
import { popularServicesTemplate, loadingState, emptyState, errorState } from './popular-services.template.js';
import { POPULAR_SERVICE_IMAGES } from './popular-services.defaults.js';
import { popularServicesStyles } from './popular-services.styles.js';

const templateCache = document.createElement('template');

class HomePopularServices extends HTMLElement {
  constructor() {
    super();
    this.servicesService = new ServicesService();
    this.limit = Number(this.getAttribute('limit')) || 3;
  }

  static get observedAttributes() {
    return ['limit'];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === 'limit') {
      const parsed = Number(newValue);
      if (!Number.isNaN(parsed)) {
        this.limit = parsed;
        if (this.isConnected) {
          this.loadServices();
        }
      }
    }
  }

  connectedCallback() {
    this.render();
    this.loadServices();
  }

  render() {
    if (!templateCache.innerHTML) {
      templateCache.innerHTML = `
        <style>${popularServicesStyles}</style>
        ${popularServicesTemplate()}
      `;
    }

    this.innerHTML = '';
    this.appendChild(templateCache.content.cloneNode(true));
    this.servicesContainer = this.querySelector('[data-services-container]');
  }

  async loadServices() {
    if (!this.servicesContainer) return;

    this.servicesContainer.innerHTML = loadingState();

    try {
      const services = await this.servicesService.getPopular(this.limit);

      if (!services || services.length === 0) {
        this.servicesContainer.innerHTML = emptyState();
        return;
      }

      this.renderServices(services);
    } catch (error) {
      console.error('[home-popular-services] error loading services:', error);
      this.servicesContainer.innerHTML = errorState(error?.message || 'No se pudieron cargar los servicios.');
      this.attachRetryHandler();
    }
  }

  renderServices(services) {
    if (!this.servicesContainer) return;
    this.servicesContainer.innerHTML = '';

    services.forEach((service, index) => {
      const card = document.createElement('service-card');
      card.setAttribute('id', service.id || service._id || `svc-${index}`);
      card.setAttribute('name', service.name || service.nombre || 'Servicio');
      card.setAttribute('description', service.description || service.descripcion || 'Descripción del servicio');
      card.setAttribute('price', this.extractPrice(service));
      card.setAttribute('image', this.resolveImage(service, index));
      this.servicesContainer.appendChild(card);
    });
  }

  extractPrice(service) {
    if (typeof service.price !== 'undefined') return service.price;
    if (typeof service.precio !== 'undefined') return service.precio;
    return 0;
  }

  resolveImage(service, index) {
    return (
      service.image ||
      service.imageUrl ||
      service.imagen ||
      POPULAR_SERVICE_IMAGES[index % POPULAR_SERVICE_IMAGES.length]
    );
  }

  attachRetryHandler() {
    const retryBtn = this.querySelector('[data-retry]');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => this.loadServices(), { once: true });
    }
  }
}

customElements.define('home-popular-services', HomePopularServices);

export default HomePopularServices;
export { HomePopularServices };
