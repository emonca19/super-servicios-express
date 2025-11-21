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
    this.vehiclesLoaded = false; 
  }

  async connectedCallback() {
    await this.render();
    this.populateYearOptions();
    this.loadServiceOptions();
    this.registerEvents();
    this.prefillFromPending();

    try {
      const token = apiClient.getToken();
      if (!token) this.lockForUnauth();
      else {
        try { await this.loadSavedVehicles(); } catch (e) {}
      }
    } catch (e) {}

    window.addEventListener('user-logged-in', async (ev) => {
      try {
        this.hideAuthOverlay();
        const profile = ev?.detail;
        if (profile) {
          this.fillAndLockClient(profile);
        } else {
          try {
            const p = await apiClient.get('/clientes/me');
            const prof = p?.data || p;
            if (prof) this.fillAndLockClient(prof);
          } catch (e) {
          }
        }
        if (!this.vehiclesLoaded) {
          try { await this.loadSavedVehicles(true); } catch (e) {}
        }
      } catch (e) { }
    });

    window.addEventListener('auto-saved', async (ev) => {
      try { await this.loadSavedVehicles(true); } catch (e) { }
    });

    try {
      const dateEl = this.root.querySelector('#appointment-fecha');
      const serviceEl = this.root.querySelector('#servicio-select');
      if (dateEl) {
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        try { dateEl.setAttribute('min', `${y}-${m}-${d}`); } catch (e) {}
        dateEl.addEventListener('change', () => { this.updateAvailableSlots(); });
      }
      if (serviceEl) serviceEl.addEventListener('change', () => { this.updateAvailableSlots(); });
      setTimeout(() => { try { this.updateAvailableSlots(); } catch (e) {} }, 50);
    } catch (e) {}
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

    this.root.innerHTML = '';

    const tw = await this._loadTailwindCss();
    const content = templateCache.content.cloneNode(true);
    const styleEl = document.createElement('style');
    styleEl.textContent = `${tw}\n${appointmentFormStyles}`;
    this.root.appendChild(styleEl);
    this.root.appendChild(content);

    try {
      this.setAttribute('data-style-version', 'section-heading-v1');
      console.debug('[appointment-form] injected styles version=section-heading-v1');
    } catch (e) {}
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
    const serviceSelect = this.root.querySelector('#servicio-select') || this.root.querySelector('#appointment-servicio');
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
        option.value = (service.id_servicio !== undefined ? service.id_servicio : undefined) || service.id || service._id || service.codigo || service.slug || service.nombre || service.name || `svc-${index}`;
        option.textContent = service.nombre || service.name || `Servicio ${index + 1}`;
        fragment.appendChild(option);
      });

      serviceSelect.innerHTML = '';
      serviceSelect.appendChild(fragment);
      try {
        const params = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
        const pre = params.get('service') || params.get('servicio');
        if (pre) {
          const match = Array.from(serviceSelect.options).find((o) => o.value === pre);
          if (match) serviceSelect.value = pre;
        }
      } catch (e) {
      }
    } catch (error) {
      console.error('[appointment-form] Error al cargar servicios:', error);
      const serviceSelectFallback = this.root.querySelector('#servicio-select');
      if (serviceSelectFallback) serviceSelectFallback.innerHTML = '<option value="">No se pudieron cargar los servicios</option>';
    }
  }

  /**
   * Load available time slots for selected date and service and populate the time select.
   */
  async updateAvailableSlots() {
    try {
      const dateEl = this.root.querySelector('#appointment-fecha');
      const horaEl = this.root.querySelector('#appointment-hora');
      const serviceEl = this.root.querySelector('#servicio-select');
      if (!horaEl) return;
      const date = dateEl ? dateEl.value : null;
      const serviceId = serviceEl ? serviceEl.value : null;

      horaEl.innerHTML = '';
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.textContent = 'Selecciona hora';
      horaEl.appendChild(defaultOpt);

      if (!date) {
        const info = document.createElement('option');
        info.value = '';
        info.textContent = 'Selecciona una fecha primero';
        info.disabled = true;
        horaEl.appendChild(info);
        return;
      }

      try {
        const dateObj = new Date(`${date}T00:00:00`);
        const dow = dateObj.getDay(); 
        if (dow === 0) {
          try {
            dateEl.value = '';
            dateEl.classList.add('border-red-500');
            setTimeout(() => { try { dateEl.classList.remove('border-red-500'); } catch (e) {} }, 2500);
          } catch (e) {}

          horaEl.innerHTML = '';
          const none = document.createElement('option');
          none.value = '';
          none.textContent = 'No se pueden agendar citas los domingos';
          none.disabled = true;
          horaEl.appendChild(none);
          return;
        }
      } catch (e) {
      }

      let slots = [];
      try {
        slots = await this.appointmentsService.getAvailableSlots(date, serviceId);
      } catch (err) {
        console.warn('[appointment-form] getAvailableSlots failed, falling back to default slots', err);
        slots = this.appointmentsService.getDefaultSlots();
      }

      try {
        const dateObj2 = new Date(`${date}T00:00:00`);
        if (dateObj2.getDay() === 6) {
          slots = (Array.isArray(slots) ? slots : []).filter((s) => {
            try {
              const [hh, mm] = String(s).split(':').map(Number);
              if (Number.isNaN(hh)) return false;
              const minutes = hh * 60 + (Number(mm) || 0);
              return minutes >= (8 * 60) && minutes < (14 * 60);
            } catch (e) { return false; }
          });
        }
      } catch (e) {}

      const now = new Date();
      const marginMinutes = 30; 
      const marginMs = marginMinutes * 60000;
      const isToday = (() => {
        try {
          const [y, m, d] = (date || '').split('-').map(Number);
          return y === now.getFullYear() && m === (now.getMonth() + 1) && d === now.getDate();
        } catch (e) { return false; }
      })();

      let existingCitas = [];
      try {
        const resp = await apiClient.get('/citas/mine');
        const raw = resp?.data || resp || [];
        existingCitas = Array.isArray(raw) ? raw : (Array.isArray(resp) ? resp : (Array.isArray(resp?.data) ? resp.data : []));
        try {
          existingCitas = existingCitas.filter((c) => {
            const st = (c.estado || '').toString().toUpperCase();
            return st !== 'CANCELADA' && st !== 'CANCELLED';
          });
        } catch (e) { }
      } catch (err) {
        existingCitas = [];
      }

      const durationMin = Number(this.root.querySelector('#appointment-duracion')?.value) || 60;

      let added = 0;
      slots.forEach((slot) => {
        try {
          const slotDate = new Date(`${date}T${slot}:00`);
          const slotEnd = new Date(slotDate.getTime() + durationMin * 60000);
          const option = document.createElement('option');
          option.value = slot;
          const [hh, mm] = slot.split(':');
          const hourNum = Number(hh);
          const ampm = hourNum >= 12 ? 'PM' : 'AM';
          const displayHour = ((hourNum + 11) % 12) + 1;
          option.textContent = `${String(displayHour).padStart(2,'0')}:${mm} ${ampm}`;

          if (isToday && slotDate.getTime() <= (now.getTime() + marginMs)) {
            option.disabled = true;
            option.className = 'opacity-50';
            option.title = option.title ? option.title + ' (Demasiado cercano)' : 'Demasiado cercano';
          }

          for (let i = 0; i < existingCitas.length; i += 1) {
            try {
              const c = existingCitas[i];
              const cInicio = c.inicio ? new Date(c.inicio) : null;
              const cFin = c.fin ? new Date(c.fin) : null;
              if (!cInicio || !cFin || Number.isNaN(cInicio.getTime()) || Number.isNaN(cFin.getTime())) continue;
              if (slotDate.getTime() < cFin.getTime() && slotEnd.getTime() > cInicio.getTime()) {
                option.disabled = true;
                option.className = 'opacity-50';
                option.title = `Ocupado: ${c.motivo || c.id_cita}`;
                break;
              }
            } catch (e) {}
          }

          horaEl.appendChild(option);
          added += 1;
        } catch (e) {}
      });

      if (!added) {
        const none = document.createElement('option');
        none.value = '';
        none.textContent = 'No hay horas disponibles para esta fecha';
        none.disabled = true;
        horaEl.appendChild(none);
      }
    } catch (e) {
      console.error('[appointment-form] updateAvailableSlots error', e);
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

      try {
        const token = apiClient.getToken();
        if (token) this.fillAndLockClient(cliente);
      } catch (e) {}
      sessionStorage.removeItem('pendingCliente');
    } catch (e) {
    }
  }

  fillAndLockClient(cliente) {
    try {
      console.debug('[appointment-form] fillAndLockClient received cliente:', cliente);
      const map = {
        nombre: cliente.nombre || cliente.name,
        telefono: cliente.telefono || cliente.phone,
        email: cliente.email || cliente.email_address || cliente.mail,
        direccion: cliente.direccion || cliente.address || cliente.domicilio || cliente.direccion_completa || cliente.address_line1 || '',
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
      try {
        const id = cliente.id_cliente || cliente.id || cliente._id || cliente.idCliente;
        if (id) this.setHiddenClienteId(id);
      } catch (e) {}

      try { this.setHiddenClientFields(cliente); } catch (e) {}
    } catch (e) {
     
    }
  }

  async loadSavedVehicles(force = false) {
    try {
      if (this.vehiclesLoaded && !force) {
        console.debug('[appointment-form] Vehicles already loaded, skipping...');
        return;
      }
      
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
          if (el.textContent && el.textContent.includes('vehículo')) {
            el.remove();
            totalRemoved++;
          }
        });
      });
      
      console.debug(`[appointment-form] Removed ${totalRemoved} vehicle containers`);
      
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
      const possibleArrays = list && (list.data || list.result || list.rows || list.vehicles || list.autos);
      const raw = Array.isArray(possibleArrays) ? possibleArrays : (Array.isArray(list) ? list : (Array.isArray(list?.data) ? list.data : []));
      const autos = (raw || []).slice().sort((a, b) => {
        const aId = Number(a.id_auto || a.id || 0);
        const bId = Number(b.id_auto || b.id || 0);
        return bId - aId;
      });
      
      if (!Array.isArray(autos) || autos.length === 0) {
        this.vehiclesLoaded = true;
        return;
      }
      
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
        } catch (e) {  }
      });

      container.appendChild(label);
      container.appendChild(sel);

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
      if (auto.id_auto || auto.id) this.setHiddenAutoId(auto.id_auto || auto.id);
    } catch (e) {
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
      Array.from(form.elements).forEach((el) => {
        if (!el.name) return;
        el.setAttribute('disabled', 'disabled');
        el.classList.add('bg-gray-100', 'cursor-not-allowed');
      });

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
    }
  }

  unlockAfterAuth() {
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
    try { statusDiv.style.marginBottom = ''; } catch (e) {}

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const validation = this.appointmentsService.validateAppointmentData(data);
      if (!validation.isValid) {
        this.renderErrorStatus(statusDiv, 'Por favor corrige los siguientes campos:', validation.errors);
        statusDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      try {
        const constraint = await this.appointmentsService.validateAppointmentConstraints(data);
        if (!constraint.isValid) {
          this.renderErrorStatus(statusDiv, 'No se puede agendar esta cita por:', constraint.errors);
          try { statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { try { statusDiv.scrollIntoView(); } catch (e) {} }
          try {
            const dateEl = this.root.querySelector('#appointment-fecha');
            const horaEl = this.root.querySelector('#appointment-hora');
            if (dateEl) dateEl.classList.add('border-red-500');
            if (horaEl) horaEl.classList.add('border-red-500');
            const firstErr = (constraint.errors && constraint.errors[0]) || '';
            if (/fecha|anterior|pasado/i.test(firstErr) && dateEl) { try { dateEl.focus(); } catch (e) {} }
            else if (/hora|franja|solap/i.test(firstErr) && horaEl) { try { horaEl.focus(); } catch (e) {} }
            else if (dateEl) { try { dateEl.focus(); } catch (e) {} }
          } catch (e) {}
          return;
        }
      } catch (err) {
        console.warn('[appointment-form] constraints validation error', err);
      }

      const response = await this.appointmentsService.create(data);
      this.renderSuccessStatus(
        statusDiv,
        'Cita agendada con exito',
        'Te contactaremos pronto para confirmar los detalles.',
      );
      try {
        const token = apiClient.getToken();
        if (token) {
          const keep = ['nombre','telefono','email','direccion'];
          Array.from(form.elements).forEach((el) => {
            if (!el.name) return;
            if (keep.includes(el.name)) return;
            if (el.tagName === 'SELECT' || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
              try { el.value = ''; } catch (e) {}
              if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
            }
          });
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

  resetVehiclesState() {
    this.vehiclesLoaded = false;
    
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
    try { target.style.marginBottom = '20px'; } catch (e) {}
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
    try { target.style.marginBottom = '20px'; } catch (e) {}
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
