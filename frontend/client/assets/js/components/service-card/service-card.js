import { serviceCardStyles } from './service-card.styles.js';
import { getTailwindCss } from '../../utils/shadow-style-loader.js';
import apiClient from '../../services/api-client.js';

class ServiceCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  _stripHtml(html) {
    try {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    } catch (e) {
      return String(html).replace(/<[^>]*>/g, '');
    }
  }

  _escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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

  async render() {
    const id = this.getAttribute('id') || '';
    const name = this.getAttribute('name') || 'Servicio';
    const description = this.getAttribute('description') || '';
    const price = this.getAttribute('price') || '0';
    const image = this.getAttribute('image') || './assets/images/default-service.svg';
    // Resolve image to absolute URL if needed (backend may serve at /uploads)
    const resolvedImage = (() => {
      if (!image) return './assets/images/default-service.svg';
      if (/^https?:\/\//i.test(image)) return image;
      if (image.startsWith('/')) {
        try {
          const base = (apiClient && apiClient.baseURL) ? apiClient.baseURL.replace(/\/api\/?$/i, '').replace(/\/$/, '') : '';
          if (base) return base + image;
        } catch (e) {}
        return image;
      }
      return image;
    })();
    try { console.debug('[service-card] resolvedImage', { id, image, resolvedImage, apiBase: (apiClient && apiClient.baseURL) || null }); } catch (e) {}
    const duration = this.getAttribute('duration') || this.getAttribute('duracion') || '';
    const includes = this.getAttribute('includes') || this.getAttribute('incluye') || '';

    const plainDesc = this._stripHtml(String(description || ''));
    const safeCardDesc = this._escapeHtml(plainDesc);
    const maxCardChars = 260;
    const truncatedCardDesc = (safeCardDesc.length > maxCardChars) ? (safeCardDesc.slice(0, maxCardChars).trim() + '…') : safeCardDesc;

    const content = `
      <article class="service-card">
          <div class="service-image">
          <img src="${resolvedImage}" alt="${name}" loading="lazy" onerror="this.onerror=null;this.src='./assets/images/default-service.svg'">
        </div>
        <div class="service-content">
          <h3 class="service-name">${name}</h3>
          <p class="service-description">${truncatedCardDesc}</p>
          <div class="service-footer">
            <span class="service-price">$${this.formatPrice(price)}</span>
            <button class="btn-book" data-service-id="${id}">
              Ver más
            </button>
          </div>
        </div>
      </article>
      <!-- Modal popup injected inside shadow DOM -->
      <div class="service-modal" id="service-modal" aria-hidden="true">
        <div class="modal-backdrop" data-role="backdrop"></div>
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title-${id}">
          <div class="modal-image"><img src="${resolvedImage}" alt="${name}" onerror="this.onerror=null;this.src='./assets/images/default-service.svg'"></div>
          <div class="modal-content">
            <div>
              <div class="modal-title" id="modal-title-${id}">${name}</div>
              <div class="modal-sub">${includes ? includes : 'Descripción del servicio'}</div>
            </div>
            <div class="modal-desc">${this._escapeHtml(String(description || ''))}</div>
            <div class="meta-row">
              ${duration ? `<div class="meta-duration">⏱ Duración: ${duration}</div>` : ''}
              <div class="modal-price">$${this.formatPrice(price)}</div>
            </div>
            <div class="modal-actions">
              <button class="btn-primary btn-book-now" data-service-id="${id}">Agendar cita</button>
              <button class="btn-ghost modal-close-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    `;

    try {
      const tw = await getTailwindCss();
      this.shadowRoot.innerHTML = `<style>${tw}\n${serviceCardStyles}</style>${content}`;
      this.attachEventListeners();
    } catch (e) {
      this.shadowRoot.innerHTML = `<style>${serviceCardStyles}</style>${content}`;
      this.attachEventListeners();
    }
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

    freshBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      try { this.openModal(); } catch (e) { console.warn('[service-card] openModal failed', e); }
    });

    const modal = this.shadowRoot.querySelector('#service-modal');
    if (modal) {
      const closeBtns = modal.querySelectorAll('.modal-close-secondary');
      closeBtns.forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); this.closeModal(); }));
      const backdrop = modal.querySelector('[data-role="backdrop"]');
      if (backdrop) backdrop.addEventListener('click', () => this.closeModal());

      const bookNow = modal.querySelector('.btn-book-now');
      if (bookNow) bookNow.addEventListener('click', (e) => {
        e.preventDefault();
        const sid = this.getAttribute('id');
        try {
          const token = (apiClient && apiClient.getToken) ? apiClient.getToken() : null;
          if (token) {
            window.location.href = `agendar-cita.html?service=${encodeURIComponent(sid)}`;
            return;
          }
        } catch (err) {}

        try {
          try { sessionStorage.setItem('pendingService', String(sid)); } catch (e) {}
          // If user is not authenticated, open the global auth modal immediately
          try { window.dispatchEvent(new CustomEvent('open-auth', { detail: 'login' })); } catch (e) {}
        } catch (e) {
          try { window.dispatchEvent(new Event('open-auth')); } catch (e) {}
        }
        this.closeModal();
      });

      this._escHandler = (ev) => { if (ev.key === 'Escape') this.closeModal(); };
      document.addEventListener('keydown', this._escHandler);
      this._docClickHandler = (ev) => {
        try {
          const modal = this.shadowRoot.querySelector('#service-modal');
          if (!modal) return;
          const path = ev.composedPath ? ev.composedPath() : (ev.path || []);
          if (!path.includes(modal) && !path.includes(this.shadowRoot)) {
            this.closeModal();
          }
        } catch (e) {}
      };


      this._focusInHandler = (ev) => {
        try {
          const modal = this.shadowRoot.querySelector('#service-modal');
          if (!modal) return;
          const path = ev.composedPath ? ev.composedPath() : (ev.path || []);
          if (!path.includes(modal) && !path.includes(this.shadowRoot)) {
            this.closeModal();
          }
        } catch (e) {}
      };
    }
  }

  openModal() {
    try {
      const modal = this.shadowRoot.querySelector('#service-modal');
      if (!modal) return;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      const btn = modal.querySelector('.btn-book-now, .modal-close-secondary');
      if (btn) btn.focus();
      try {
        document.addEventListener('click', this._docClickHandler);
        document.addEventListener('focusin', this._focusInHandler);
      } catch (e) {}
    } catch (e) { console.warn('[service-card] openModal error', e); }
  }

  closeModal() {
    try {
      const modal = this.shadowRoot.querySelector('#service-modal');
      if (!modal) return;
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      try {
        if (this._docClickHandler) document.removeEventListener('click', this._docClickHandler);
        if (this._focusInHandler) document.removeEventListener('focusin', this._focusInHandler);
      } catch (e) {}
    } catch (e) { console.warn('[service-card] closeModal error', e); }
  }

  disconnectedCallback() {
    try {
      if (this._escHandler) document.removeEventListener('keydown', this._escHandler);
      if (this._docClickHandler) document.removeEventListener('click', this._docClickHandler);
      if (this._focusInHandler) document.removeEventListener('focusin', this._focusInHandler);
    } catch (e) {}
  }

}

customElements.define('service-card', ServiceCard);
