import { AppointmentsService } from '../../services/appointments.service.js';
import ServicesService from '../../services/services.service.js';
import { appointmentFormTemplate } from './appointment-form.template.js';
import { appointmentFormStyles } from './appointment-form.styles.js';
import apiClient from '../../services/api-client.js';

const templateCache = document.createElement('template');

class AppointmentForm extends HTMLElement {
  constructor() {
    super();
    this.appointmentsService = new AppointmentsService();
    this.servicesService = new ServicesService();
    this.root = this.attachShadow({ mode: 'open' });
    this.vehiclesLoaded = false; // Bandera para evitar duplicación
  }

  async connectedCallback() {
    await this.render();
    this.populateYearOptions();
    this.loadServiceOptions();
    this.registerEvents();
    this.prefillFromPending();

    // If not authenticated, lock form inputs and show small overlay inviting to login
    try {
      const token = apiClient.getToken();
      if (!token) this.lockForUnauth();
      else {
        // Load saved vehicles for authenticated users so they can pick one
        try { await this.loadSavedVehicles(); } catch (e) { /* ignore */ }
      }
    } catch (e) {}

    // Listen for login events: remove overlay and fill+lock client fields.
    window.addEventListener('user-logged-in', async (ev) => {
      try {
        // Remove overlay if present
        this.hideAuthOverlay();
        const profile = ev?.detail;
        if (profile) {
          this.fillAndLockClient(profile);
        } else {
          // Best-effort: fetch profile from API
          try {
            const p = await apiClient.get('/clientes/me');
            const prof = p?.data || p;
            if (prof) this.fillAndLockClient(prof);
          } catch (e) {
            // ignore
          }
        }
        // Solo cargar vehículos si no se han cargado antes
        if (!this.vehiclesLoaded) {
          try { await this.loadSavedVehicles(true); } catch (e) {}
        }
      } catch (e) { /* ignore */ }
    });

    // Refresh saved vehicles when a new auto is created elsewhere in the app
    window.addEventListener('auto-saved', async (ev) => {
      try { await this.loadSavedVehicles(true); } catch (e) { /* ignore */ }
    });
  }

  async _loadTailwindCss() {
    if (this.constructor._tailwindCss) return this.constructor._tailwindCss;
    try {
      const res = await fetch('/assets/css/tailwind.css');
      if (!res.ok) throw new Error('tailwind.css not found');
      const txt = await res.text();
      this.constructor._tailwindCss = txt;
      return txt;
    } catch (e) {
      console.warn('[appointment-form] Could not load compiled tailwind.css:', e);
      this.constructor._tailwindCss = '';
      return '';
    }
  }

  async render() {
    if (!templateCache.innerHTML) {
      templateCache.innerHTML = `
        <style>${appointmentFormStyles}</style>
        ${appointmentFormTemplate()}
      `;
    }

    // Clear shadow
    this.root.innerHTML = '';

    // Load compiled Tailwind CSS (if available) and inject into shadow
    const tw = await this._loadTailwindCss();
    const content = templateCache.content.cloneNode(true);
    const styleEl = document.createElement('style');
    styleEl.textContent = `${tw}\n${appointmentFormStyles}`;
    this.root.appendChild(styleEl);
    this.root.appendChild(content);
  }

  populateYearOptions() {
    const yearSelect = this.root.querySelector('#ano-select');
    if (!yearSelect) return;

    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = '<option value=\"\">Selecciona anio</option>';
    for (let year = currentYear; year >= currentYear - 30; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }
  }

  async loadServiceOptions() {
    const serviceSelect = this.root.querySelector('#servicio-select');
    if (!serviceSelect) return;

    serviceSelect.innerHTML = '<option value="">Cargando servicios...</option>';

    try {
      const services = await this.servicesService.getAll();
      if (!Array.isArray(services) || services.length === 0) {
        serviceSelect.innerHTML = '<option value="">No hay servicios disponibles</option>';
        return;
      }

        const fragment = document.createDocumentFragment();
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Selecciona servicio';
      fragment.appendChild(defaultOption);

      services.forEach((service, index) => {
        const option = document.createElement('option');
        // Prefer backend numeric id_servicio when available
        option.value = (service.id_servicio !== undefined ? service.id_servicio : undefined) || service.id || service._id || service.codigo || service.slug || service.nombre || service.name || `svc-${index}`;
        option.textContent = service.nombre || service.name || `Servicio ${index + 1}`;
        fragment.appendChild(option);
      });

      serviceSelect.innerHTML = '';
      serviceSelect.appendChild(fragment);
      // Preselect service if provided in URL query param (?service=...)
      try {
        const params = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
        const pre = params.get('service') || params.get('servicio');
        if (pre) {
          const match = Array.from(serviceSelect.options).find((o) => o.value === pre);
          if (match) serviceSelect.value = pre;
        }
      } catch (e) {
        // ignore
      }
    } catch (error) {
      console.error('[appointment-form] Error al cargar servicios:', error);
      const serviceSelectFallback = this.root.querySelector('#servicio-select');
      if (serviceSelectFallback) serviceSelectFallback.innerHTML = '<option value="">No se pudieron cargar los servicios</option>';
    }
  }

  registerEvents() {
    const form = this.root.querySelector('#appointment-form');
    if (form) {
      form.addEventListener('submit', (event) => this.handleSubmit(event));
    }

    const cancelBtn = this.root.querySelector('#cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (confirm('Estas seguro que deseas cancelar el registro de la cita?')) {
          window.location.href = 'index.html';
        }
      });
    }
  }

  prefillFromPending() {
    try {
      const raw = sessionStorage.getItem('pendingCliente');
      if (!raw) return;
      const cliente = JSON.parse(raw);
      // Map known fields to inputs if present
      const map = {
        nombre: cliente.nombre || cliente.name,
        telefono: cliente.telefono || cliente.phone,
        email: cliente.email,
        direccion: cliente.direccion || cliente.address,
        placas: cliente.placas || '',
      };

      Object.entries(map).forEach(([k, v]) => {
        if (!v) return;
        const el = this.root.querySelector(`[name="${k}"]`);
        if (el) el.value = v;
      });

      // Clean up to avoid reusing on next load
      // If user is authenticated, lock client inputs
      try {
        const token = apiClient.getToken();
        if (token) this.fillAndLockClient(cliente);
      } catch (e) {}
      sessionStorage.removeItem('pendingCliente');
    } catch (e) {
      // ignore
    }
  }

  fillAndLockClient(cliente) {
    try {
      const map = {
        nombre: cliente.nombre || cliente.name,
        telefono: cliente.telefono || cliente.phone,
        email: cliente.email,
        direccion: cliente.direccion || cliente.address,
      };
      Object.entries(map).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        const el = this.root.querySelector(`[name="${k}"]`);
        if (el) {
          el.value = v;
          el.setAttribute('disabled', 'disabled');
          el.classList.add('bg-gray-100', 'cursor-not-allowed');
        }
      });
      // Ensure we send the cliente id to the server when user is authenticated
      try {
        const id = cliente.id_cliente || cliente.id || cliente._id || cliente.idCliente;
        if (id) this.setHiddenClienteId(id);
      } catch (e) {}

      // Also add hidden client fields so FormData includes them even when inputs are disabled
      try { this.setHiddenClientFields(cliente); } catch (e) {}
      // NO cargar vehículos aquí para evitar duplicación - ya se cargan en connectedCallback
    } catch (e) {
      // ignore
    }
  }

  async loadSavedVehicles(force = false) {
    try {
      // Verificación más estricta para evitar cargar múltiples veces
      if (this.vehiclesLoaded && !force) {
        console.debug('[appointment-form] Vehicles already loaded, skipping...');
        return;
      }
      
      // LIMPIEZA SUPER AGRESIVA - eliminar TODO lo que pueda ser un contenedor de vehículos
      const allPossibleSelectors = [
        '#saved-vehicles-container',
        '[id*="saved-vehicles"]',
        '[id*="vehicles-container"]',
        '.mb-4.p-4.bg-blue-50',
        '[class*="saved-vehicles"]'
      ];
      
      let totalRemoved = 0;
      allPossibleSelectors.forEach(selector => {
        const elements = this.root.querySelectorAll(selector);
        elements.forEach(el => {
          // Verificar que realmente sea un contenedor de vehículos
          if (el.textContent && el.textContent.includes('vehículo')) {
            el.remove();
            totalRemoved++;
          }
        });
      });
      
      console.debug(`[appointment-form] Removed ${totalRemoved} vehicle containers`);
      
      // Verificación final - buscar cualquier select que tenga "vehículo" en su contenido
      const allSelects = this.root.querySelectorAll('select');
      allSelects.forEach(select => {
        const firstOption = select.querySelector('option');
        if (firstOption && firstOption.textContent && firstOption.textContent.toLowerCase().includes('vehículo')) {
          const container = select.closest('div');
          if (container && container.id !== 'ano-select' && container.id !== 'servicio-select') {
            container.remove();
            console.debug('[appointment-form] Removed orphaned vehicle select');
          }
        }
      });

      const list = await apiClient.get('/automoviles/mine');
      const autos = (list?.data || list || []).slice().sort((a, b) => {
        const aId = Number(a.id_auto || a.id || 0);
        const bId = Number(b.id_auto || b.id || 0);
        return bId - aId;
      });
      
      if (!Array.isArray(autos) || autos.length === 0) {
        console.debug('[appointment-form] No vehicles found');
        this.vehiclesLoaded = true;
        return;
      }
      
      // Crear contenedor con ID único para evitar duplicados
      const uniqueId = 'saved-vehicles-container';
      const container = document.createElement('div');
      container.id = uniqueId;
      container.className = 'mb-1 vehicle-selector-unique';
      container.dataset.vehicleContainer = 'true';
      
      const label = document.createElement('label');
      label.className = 'block text-sm font-semibold text-blue-800 mb-1';
      label.textContent = 'Mis vehículos guardados';
      
      const sel = document.createElement('select');
      sel.className = 'w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white';
      sel.innerHTML = `<option value="">Selecciona un vehículo guardado</option>`;
      
      autos.forEach((a) => {
        const opt = document.createElement('option');
        opt.value = a.id_auto || a.id || a._id;
        opt.textContent = `${(a.placas||'--').toUpperCase()} — ${a.marca||''} ${a.modelo||''} ${a.anio||''}`;
        opt.dataset.auto = JSON.stringify(a);
        sel.appendChild(opt);
      });

      sel.addEventListener('change', (ev) => {
        const v = ev.target.value;
        if (!v) return;
        const opt = ev.target.options[ev.target.selectedIndex];
        try {
          const auto = JSON.parse(opt.dataset.auto || null);
          if (auto) this.applyVehicleToForm(auto);
        } catch (e) { /* ignore */ }
      });

      container.appendChild(label);
      container.appendChild(sel);

      // Insertar contenedor al inicio de la sección de vehículos
      const vehicleSection = this.root.querySelector('fieldset:nth-of-type(2)');
      if (vehicleSection) {
        const legend = vehicleSection.querySelector('legend');
        if (legend) {
          legend.insertAdjacentElement('afterend', container);
        } else {
          vehicleSection.insertBefore(container, vehicleSection.firstChild);
        }
        console.debug('[appointment-form] Vehicle container added successfully with ID:', uniqueId);
      } else {
        console.warn('[appointment-form] Vehicle section not found');
      }
      
      // Marcar como cargado SOLO después de insertar exitosamente
      this.vehiclesLoaded = true;
      console.debug('[appointment-form] Vehicles loading completed');
    } catch (e) {
      console.error('[appointment-form] Error loading saved vehicles:', e);
    }
  }

  applyVehicleToForm(auto) {
    try {
      const mapping = {
        marca: auto.marca,
        modelo: auto.modelo,
        ano: auto.anio || auto.anio,
        color: auto.color,
        placas: auto.placas,
      };
      Object.entries(mapping).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        const el = this.root.querySelector(`[name="${k}"]`);
        if (el) {
          try { el.value = String(v); } catch (e) {}
        }
      });
      // set hidden id_auto so backend uses existing auto
      if (auto.id_auto || auto.id) this.setHiddenAutoId(auto.id_auto || auto.id);
    } catch (e) {
      // ignore
    }
  }

  setHiddenAutoId(id) {
    try {
      const form = this.root.querySelector('#appointment-form');
      if (!form) return;
      let hid = form.querySelector('input[name="id_auto"][type="hidden"]');
      if (!hid) {
        hid = document.createElement('input');
        hid.type = 'hidden';
        hid.name = 'id_auto';
        form.appendChild(hid);
      }
      hid.value = String(id);
    } catch (e) {}
  }

  setHiddenClienteId(id) {
    try {
      const form = this.root.querySelector('#appointment-form');
      if (!form) return;
      let hid = form.querySelector('input[name="id_cliente"][type="hidden"]');
      if (!hid) {
        hid = document.createElement('input');
        hid.type = 'hidden';
        hid.name = 'id_cliente';
        form.appendChild(hid);
      }
      hid.value = String(id);
    } catch (e) {}
  }

  setHiddenClientFields(cliente) {
    try {
      const form = this.root.querySelector('#appointment-form');
      if (!form) return;
      const fields = ['nombre','telefono','email','direccion'];
      fields.forEach((name) => {
        const value = cliente[name] || cliente[name === 'telefono' ? 'phone' : name] || '';
        let hid = form.querySelector(`input[name="${name}"][type="hidden"]`);
        if (!hid) {
          hid = document.createElement('input');
          hid.type = 'hidden';
          hid.name = name;
          form.appendChild(hid);
        }
        hid.value = value || '';
      });
    } catch (e) {}
  }

  removeHiddenClienteId() {
    try {
      const form = this.root.querySelector('#appointment-form');
      if (!form) return;
      const hid = form.querySelector('input[name="id_cliente"][type="hidden"]');
      if (hid) hid.remove();
    } catch (e) {}
  }

  removeHiddenClientFields() {
    try {
      const form = this.root.querySelector('#appointment-form');
      if (!form) return;
      ['nombre','telefono','email','direccion'].forEach((name) => {
        const hid = form.querySelector(`input[name="${name}"][type="hidden"]`);
        if (hid) hid.remove();
      });
    } catch (e) {}
  }

  removeHiddenClienteId() {
    try {
      const form = this.root.querySelector('#appointment-form');
      if (!form) return;
      const hid = form.querySelector('input[name="id_cliente"][type="hidden"]');
      if (hid) hid.remove();
    } catch (e) {}
  }

  lockForUnauth() {
    try {
      const form = this.root.querySelector('#appointment-form');
      if (!form) return;
      // Disable all inputs/selects/textareas
      Array.from(form.elements).forEach((el) => {
        if (!el.name) return;
        el.setAttribute('disabled', 'disabled');
        el.classList.add('bg-gray-100', 'cursor-not-allowed');
      });

      // Show overlay with login button
      let overlay = this.root.querySelector('#auth-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'auth-overlay';
        overlay.className = 'absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-40';
        overlay.innerHTML = `
          <div class="text-center">
            <p class="mb-4 font-semibold">Inicia sesión para agendar una cita</p>
            <div class="flex justify-center gap-3">
              <button id="overlay-login-btn" class="px-4 py-2 bg-blue-600 text-white rounded">Iniciar sesión</button>
            </div>
          </div>
        `;
        const container = this.root.querySelector('.max-w-4xl');
        if (container) {
          container.style.position = 'relative';
          container.appendChild(overlay);
          const btn = overlay.querySelector('#overlay-login-btn');
          if (btn) btn.addEventListener('click', () => { window.dispatchEvent(new Event('open-auth')); });
        }
      }
    } catch (e) {
      // ignore
    }
  }

  unlockAfterAuth() {
    // Deprecated: kept for compatibility but not used; prefer hideAuthOverlay() + fillAndLockClient()
  }

  hideAuthOverlay() {
    try {
      const overlay = this.root.querySelector('#auth-overlay');
      if (overlay) overlay.remove();
      const container = this.root.querySelector('.max-w-4xl');
      if (container) container.style.position = '';
    } catch (e) {}
  }

  async handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const submitBtn = this.root.querySelector('#submit-btn');
    const statusDiv = this.root.querySelector('#form-status');

    if (!form || !submitBtn || !statusDiv) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    statusDiv.classList.add('hidden');
    statusDiv.innerHTML = '';

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const validation = this.appointmentsService.validateAppointmentData(data);

      if (!validation.isValid) {
        this.renderErrorStatus(statusDiv, 'Por favor corrige los siguientes campos:', validation.errors);
        statusDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      const response = await this.appointmentsService.create(data);
      this.renderSuccessStatus(
        statusDiv,
        'Cita agendada con exito',
        'Te contactaremos pronto para confirmar los detalles.',
      );
      // If user is authenticated, keep client fields filled and locked; otherwise clear whole form
      try {
        const token = apiClient.getToken();
        if (token) {
          // reset non-client fields: vehicle, cita details and observaciones
          const keep = ['nombre','telefono','email','direccion'];
          Array.from(form.elements).forEach((el) => {
            if (!el.name) return;
            if (keep.includes(el.name)) return;
            if (el.tagName === 'SELECT' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
              try { el.value = ''; } catch (e) {}
              if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
            }
          });
          // Reset vehicle state para que se puedan cargar de nuevo si es necesario
          this.resetVehiclesState();
        } else {
          form.reset();
          this.resetVehiclesState();
        }
      } catch (e) { 
        form.reset(); 
        this.resetVehiclesState();
      }
      statusDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Emitir evento para que el host gestione la navegación o el siguiente paso
      this.dispatchEvent(new CustomEvent('appointment-saved', {
        detail: { appointment: response },
        bubbles: true,
        composed: true
      }));
    } catch (error) {
      console.error('[appointment-form] Error al agendar cita:', error);
      this.renderErrorStatus(statusDiv, error.message || 'No se pudo agendar la cita. Intenta nuevamente.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Agendar Cita';
    }
  }

  // Reset del estado de vehículos cuando sea necesario
  resetVehiclesState() {
    this.vehiclesLoaded = false;
    
    // Limpieza super agresiva de TODOS los posibles contenedores
    const selectors = [
      '[data-vehicle-container]',
      '[id*="saved-vehicles"]', 
      '[id*="vehicles-container"]',
      '.vehicle-selector-unique',
      '[class*="bg-blue-50"]'
    ];
    
    let totalRemoved = 0;
    selectors.forEach(selector => {
      const elements = this.root.querySelectorAll(selector);
      elements.forEach(el => {
        if (el.textContent && (el.textContent.includes('vehículo') || el.textContent.includes('guardados'))) {
          el.remove();
          totalRemoved++;
        }
      });
    });
    
    console.debug(`[appointment-form] Vehicle state reset - removed ${totalRemoved} containers`);
  }

  renderSuccessStatus(target, title, message) {
    if (!target) return;
    target.className = 'p-4 bg-green-100 border-2 border-green-500 text-green-700 rounded-lg';
    target.innerHTML = `
      <div class="flex items-center font-semibold mb-1">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>${title}</span>
      </div>
      <p class="text-sm">${message}</p>
    `;
    target.classList.remove('hidden');
  }

  renderErrorStatus(target, message, details = []) {
    if (!target) return;
    target.className = 'p-4 bg-red-100 border-2 border-red-500 text-red-700 rounded-lg';
    target.innerHTML = `
      <p class="font-semibold mb-1">${message}</p>
      ${
        Array.isArray(details) && details.length
          ? `<ul class="text-sm list-disc list-inside space-y-1">${details.map((item) => `<li>${item}</li>`).join('')}</ul>`
          : ''
      }
    `;
    target.classList.remove('hidden');
  }
}

customElements.define('appointment-form', AppointmentForm);

export default AppointmentForm;
export { AppointmentForm };
