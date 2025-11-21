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
    this.limit = Number(this.getAttribute('limit')) || 12;
    this.mode = this.getAttribute('mode') || 'carousel';
    this.pageSizeAttr = Number(this.getAttribute('page-size')) || null;
    this.root = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['limit', 'mode', 'page-size', 'hide-cta'];
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
    } else if (name === 'mode') {
      this.mode = newValue || 'carousel';
      if (this.isConnected) this.loadServices();
    } else if (name === 'page-size') {
      this.pageSizeAttr = Number(newValue) || null;
      if (this.isConnected) this.loadServices();
    } else if (name === 'hide-cta') {
      if (this.isConnected) this.applyCtaVisibility();
    }
  }

  connectedCallback() {
    console.log('[home-popular-services] connected');
    this.render();
  }

  render() {
    if (!templateCache.innerHTML) {
      templateCache.innerHTML = `${popularServicesTemplate()}`;
    }

    console.log('[home-popular-services] render start');
    this.root.innerHTML = '';
    import('../../../utils/shadow-style-loader.js').then(({ injectStyles }) => {
      injectStyles(this.root, popularServicesStyles).then(() => {
        this.root.appendChild(templateCache.content.cloneNode(true));
        try {
          const sectionEl = this.root.querySelector('#servicios-populares');
          if (sectionEl) {
            if (this.mode === 'list' || this.hasAttribute('compact') || this.getAttribute('compact') === 'true') {
              sectionEl.style.padding = '1.5rem 0';
            } else {
              sectionEl.style.padding = '';
            }
          }
        } catch (e) {
          
        }
        this.servicesContainer = this.root.querySelector('[data-services-container]');
        console.log('[home-popular-services] servicesContainer found?', !!this.servicesContainer, this.servicesContainer);
        this.loadServices().catch((err) => {
          console.error('[home-popular-services] loadServices error after render:', err);
        });
      }).catch(err => {
        console.error('[home-popular-services] injectStyles error:', err);
      });
    });
  }

  async loadServices() {
    if (!this.servicesContainer) return;

    this.servicesContainer.innerHTML = loadingState();

    try {
      const services = await this.servicesService.getPopular(this.limit);
      console.debug('[home-popular-services] fetched services:', services);

      if (!services || services.length === 0) {
        this.servicesContainer.innerHTML = emptyState();
        return;
      }

      this.renderServices(services);
      this.applyCtaVisibility();
    } catch (error) {
      console.error('[home-popular-services] error loading services:', error);
      this.servicesContainer.innerHTML = errorState(error?.message || 'No se pudieron cargar los servicios.');
      this.attachRetryHandler();
    }
  }

  applyCtaVisibility() {
    const showAllLink = this.root.querySelector('[data-show-all]');
    if (!showAllLink) return;
    if (this.hasAttribute('hide-cta') || this.getAttribute('hide-cta') === 'true') {
      showAllLink.style.display = 'none';
    } else {
      showAllLink.style.display = '';
    }
    try {
      if (this._showAllHandler) showAllLink.removeEventListener('click', this._showAllHandler);
      this._showAllHandler = (ev) => {
        if (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;
        ev.preventDefault();
        try {
          const base = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
          window.location.href = base + 'servicios.html';
        } catch (e) {
          window.location.href = 'servicios.html';
        }
      };
      showAllLink.addEventListener('click', this._showAllHandler);
    } catch (e) {}
  }

  renderServices(services) {
    if (!this.servicesContainer) return;
    this.servicesContainer.innerHTML = '';
    const seen = new Set();
    const unique = [];
    services.forEach((svc) => {
      const candidateId = svc.id_servicio || svc.id || svc._id || svc.codigo || svc.slug || svc.name;
      if (!candidateId) return;
      if (!seen.has(String(candidateId))) {
        seen.add(String(candidateId));
        unique.push(svc);
      }
    });

    try {
      this.servicesContainer.style.display = 'flex';
      this.servicesContainer.style.flexWrap = 'nowrap';
      this.servicesContainer.style.overflowX = 'auto';
      this.servicesContainer.style.scrollSnapType = 'x mandatory';
      this.servicesContainer.style.gap = '1.5rem';
      this.servicesContainer.style.paddingBottom = '4px';
      this.servicesContainer.style.alignItems = 'stretch';
    } catch (e) {
    }

    const basisPercent = (() => {
      const ps = this.computePageSize();
      if (ps <= 1) return '100%';
      if (ps === 2) return '50%';
      return '33.3333%';
    })();

    unique.forEach((service, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'carousel-item';
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.alignItems = 'stretch';
      wrapper.style.height = '100%';
      wrapper.style.flex = `0 0 ${basisPercent}`;
      wrapper.style.minWidth = basisPercent;
      wrapper.style.boxSizing = 'border-box';
      wrapper.style.overflow = 'hidden';

      const card = document.createElement('service-card');
      const idAttr = service.id_servicio || service.id || service._id || `svc-${index}`;
      card.setAttribute('id', idAttr);
      card.setAttribute('name', service.name || service.nombre || 'Servicio');
      card.setAttribute('description', service.description || service.descripcion || 'Descripción del servicio');
      const price = service.precio_con_utilidad || service.price || service.precio || service.precio_con_iva || 0;
      card.setAttribute('price', price);
      const resolved = this.resolveImage(service, index);
      // Debug: log service image fields and resolved URL
      try { console.debug('[popular-services] service image raw:', { id: idAttr, imagen: service.imagen, image: service.image, imageUrl: service.imageUrl, resolved }); } catch (e) {}
      card.setAttribute('image', resolved);

      try { card.style.height = '100%'; card.style.display = 'flex'; card.style.flexDirection = 'column'; card.style.boxSizing = 'border-box'; } catch (e) {}
      wrapper.appendChild(card);
      this.servicesContainer.appendChild(wrapper);
    });

    console.debug('[home-popular-services] renderServices: total=', services.length, 'unique=', unique.length, 'basis=', basisPercent);

    
    if (this.mode === 'list') {
      this._allServices = unique;
      this.totalItems = unique.length;
        this.pageSize = this.pageSizeAttr || 9;
      this.pagesCount = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
      this.currentPage = 0;

      try {
        this.track = this.servicesContainer;
        this.track.style.display = 'grid';
        if (this.pageSize === 9) {
          this.track.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else {
          this.track.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
        }
        this.track.style.gap = '1.5rem';
      } catch (e) {}

      this.prevBtn = this.root.querySelector('.carousel-prev');
      this.nextBtn = this.root.querySelector('.carousel-next');
      this.dotsContainer = this.root.querySelector('[data-carousel-dots]');

      if (this.prevBtn) this.prevBtn.style.display = 'none';
      if (this.nextBtn) this.nextBtn.style.display = 'none';
      if (this.dotsContainer) this.dotsContainer.style.display = '';

      this.renderPage(0);
      this.buildPageButtons();
      return;
    }

    this.track = this.servicesContainer; 
    this.prevBtn = this.root.querySelector('.carousel-prev');
    this.nextBtn = this.root.querySelector('.carousel-next');
    this.dotsContainer = this.root.querySelector('[data-carousel-dots]');

    this.totalItems = unique.length;
    this.pageSize = this.computePageSize();
    this.pagesCount = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    this.currentPage = 0;

    try {
      this.track.style.display = 'flex';
      this.track.style.flexWrap = 'nowrap';
      this.track.style.overflowX = 'auto';
      this.track.style.scrollSnapType = 'x mandatory';
      this.track.style.gap = '1.5rem';
      this.track.style.alignItems = 'stretch';
    } catch (e) {}

    if (this.prevBtn) this.prevBtn.style.display = '';
    if (this.nextBtn) this.nextBtn.style.display = '';
    if (this.dotsContainer) this.dotsContainer.style.display = 'none';

    this.updateItemWidths();
    this.updateControls();
    this.attachCarouselEvents();
    this.scrollToPage(0);
  }

  computePageSize() {
    try {
      const w = this.root.host ? this.root.host.clientWidth : window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 640) return 2;
      return 1;
    } catch (e) {
      return 1;
    }
  }

  renderPage(pageIndex) {
    if (!this._allServices || !Array.isArray(this._allServices)) return;
    const page = Math.max(0, Math.min(pageIndex, Math.max(0, this.pagesCount - 1)));
    const start = page * this.pageSize;
    const end = start + this.pageSize;
    const items = this._allServices.slice(start, end);
    this.servicesContainer.innerHTML = '';
    items.forEach((service, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'list-item';
      wrapper.style.display = 'flex';
      wrapper.style.flexDirection = 'column';
      wrapper.style.height = '100%';
      wrapper.style.boxSizing = 'border-box';
      wrapper.style.overflow = 'hidden';

      const card = document.createElement('service-card');
      const idAttr = service.id_servicio || service.id || service._id || `svc-${start + index}`;
      card.setAttribute('id', idAttr);
      card.setAttribute('name', service.name || service.nombre || 'Servicio');
      card.setAttribute('description', service.description || service.descripcion || 'Descripción del servicio');
      const price = service.precio_con_utilidad || service.price || service.precio || service.precio_con_iva || 0;
      card.setAttribute('price', price);
      card.setAttribute('image', this.resolveImage(service, start + index));

      try { card.style.height = '100%'; card.style.display = 'flex'; card.style.flexDirection = 'column'; card.style.boxSizing = 'border-box'; } catch (e) {}
      wrapper.appendChild(card);
      this.servicesContainer.appendChild(wrapper);
    });

    this.currentPage = page;
    this.refreshActiveDot();
  }

  buildPageButtons() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'px-3 py-2 mr-2 bg-gray-100 rounded';
    prev.textContent = 'Anterior';
    prev.addEventListener('click', () => {
      this.renderPage(Math.max(0, this.currentPage - 1));
    });
    this.dotsContainer.appendChild(prev);

    for (let i = 0; i < this.pagesCount; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'px-3 py-2 mx-1 bg-white border rounded';
      btn.dataset.page = i;
      btn.textContent = String(i + 1);
      btn.addEventListener('click', () => this.renderPage(i));
      this.dotsContainer.appendChild(btn);
    }

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'px-3 py-2 ml-2 bg-gray-100 rounded';
    next.textContent = 'Siguiente';
    next.addEventListener('click', () => {
      this.renderPage(Math.min(this.pagesCount - 1, this.currentPage + 1));
    });
    this.dotsContainer.appendChild(next);

    this.refreshActiveDot();
  }

  buildDots() {
    if (!this.dotsContainer) return;
    if (this.mode === 'list') return;
    this.dotsContainer.innerHTML = '';
    for (let i = 0; i < this.pagesCount; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.page = i;
      btn.addEventListener('click', () => {
        this.scrollToPage(i);
      });
      this.dotsContainer.appendChild(btn);
    }
    this.refreshActiveDot();
  }

  refreshActiveDot() {
    if (!this.dotsContainer) return;
    const buttons = Array.from(this.dotsContainer.children);
    if (this.mode === 'list') {
      buttons.forEach((b) => {
        const p = b.dataset && typeof b.dataset.page !== 'undefined' ? Number(b.dataset.page) : null;
        if (p === null) return;
        b.classList.toggle('active', p === this.currentPage);
      });
      return;
    }
    buttons.forEach((b, idx) => {
      b.classList.toggle('active', idx === this.currentPage);
    });
  }

  updateControls() {
    if (!this.prevBtn || !this.nextBtn) return;
    this.prevBtn.disabled = this.currentPage <= 0;
    this.nextBtn.disabled = this.currentPage >= this.pagesCount - 1;
  }

  attachCarouselEvents() {
    if (!this.track) return;
    if (this._prevHandler && this.prevBtn) this.prevBtn.removeEventListener('click', this._prevHandler);
    if (this._nextHandler && this.nextBtn) this.nextBtn.removeEventListener('click', this._nextHandler);

    this._prevHandler = () => { this.scrollByPage(-1); };
    this._nextHandler = () => { this.scrollByPage(1); };
    if (this.prevBtn) this.prevBtn.addEventListener('click', this._prevHandler);
    if (this.nextBtn) this.nextBtn.addEventListener('click', this._nextHandler);
    try {
      this.track.style.overflowX = 'hidden';
      this.track.style.touchAction = 'none';
      this.track.style.transition = 'transform 400ms ease';
      this.track.style.willChange = 'transform';
    } catch (e) {}

    if (this._ro) this._ro.disconnect();
    this._ro = new ResizeObserver(() => {
      this.pageSize = this.computePageSize();
      this.pagesCount = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
      this.updateItemWidths();
      this.scrollToPage(Math.min(this.currentPage, this.pagesCount - 1));
    });
    this._ro.observe(this.track);
  }

  scrollByPage(delta) {
    const target = Math.min(Math.max(this.currentPage + delta, 0), this.pagesCount - 1);
    this.scrollToPage(target);
  }

  scrollToPage(pageIndex) {
    if (!this.track) return;
    const viewportWidth = (this.track.parentElement && this.track.parentElement.clientWidth) || (this.root.host && this.root.host.clientWidth) || window.innerWidth;
    const left = Math.round(pageIndex * viewportWidth);
    try {
      this.track.scrollTo({ left, behavior: 'smooth' });
    } catch (e) {
      this.track.scrollLeft = left;
    }
    this.currentPage = pageIndex;
    this.refreshActiveDot();
    this.updateControls();
  }

  updateItemWidths() {
    if (!this.track) return;
    const viewportWidth = (this.track.parentElement && this.track.parentElement.clientWidth) || (this.root.host && this.root.host.clientWidth) || window.innerWidth;
    const gapPx = parseFloat(getComputedStyle(this.track).gap) || 16;
    const visibleWidth = Math.max(0, viewportWidth - 1);
    const perItemWidth = Math.floor((visibleWidth - gapPx * (this.pageSize - 1)) / this.pageSize);

    const items = Array.from(this.track.querySelectorAll('.carousel-item'));
    items.forEach((wrapper) => {
      wrapper.style.flex = `0 0 ${perItemWidth}px`;
      wrapper.style.minWidth = `${perItemWidth}px`;
      wrapper.style.boxSizing = 'border-box';
    });

    this._perItemWidth = perItemWidth;
    this._gapPx = gapPx;

    const cappedPage = Math.min(this.currentPage || 0, Math.max(0, Math.ceil(this.totalItems / this.pageSize) - 1));
    this.currentPage = cappedPage;
  }

  extractPrice(service) {
    if (typeof service.price !== 'undefined') return service.price;
    if (typeof service.precio !== 'undefined') return service.precio;
    return 0;
  }

  resolveImage(service, index) {
    const candidate = service.image || service.imageUrl || service.imagen || POPULAR_SERVICE_IMAGES[index % POPULAR_SERVICE_IMAGES.length];
    if (!candidate) return candidate;
    // If candidate is already absolute URL, return as-is
    if (/^https?:\/\//i.test(candidate)) return candidate;
    // If candidate is root-relative (starts with /), prefix with API origin derived from apiClient.baseURL
    if (candidate.startsWith('/')) {
      try {
        const base = (this.servicesService && this.servicesService.apiClient && this.servicesService.apiClient.baseURL) || null;
        if (base) {
          // remove trailing /api if present
          const origin = base.replace(/\/api\/?$/i, '').replace(/\/$/, '');
          return origin + candidate;
        }
      } catch (e) {}
      // fallback to candidate as-is
      return candidate;
    }
    // Otherwise return candidate (could be relative to client assets)
    return candidate;
  }

  attachRetryHandler() {
    const retryBtn = this.root.querySelector('[data-retry]');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => this.loadServices(), { once: true });
    }
  }
}

customElements.define('home-popular-services', HomePopularServices);

export default HomePopularServices;
export { HomePopularServices };
