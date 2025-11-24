import { AppointmentsService } from '../../../../services/appointments.service.js';
import ServicesService from '../../../../services/services.service.js';
import { appointmentFormTemplate } from './appointment-form.template.js';
import { appointmentFormStyles } from './appointment-form.styles.js';
import apiClient from '../../../../services/api-client.js';
import { VehicleManager } from './vehicle-manager.js';
import { SlotManager } from './slot-manager.js';

const templateCache = document.createElement('template');

class AppointmentForm extends HTMLElement {
  constructor() {
    super();
    this.appointmentsService = new AppointmentsService();
    this.servicesService = new ServicesService();
    this.root = this.attachShadow({ mode: 'open' });

    // Managers
    this.vehicleManager = new VehicleManager(this.root, apiClient);
    this.slotManager = new SlotManager(this.root, this.appointmentsService, apiClient);
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
        try { await this.vehicleManager.loadSavedVehicles(); } catch (e) { }
        try { await this.prefillClientData(); } catch (e) { }
      }
    } catch (e) { }

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
          } catch (e) { }
        }
        await this.vehicleManager.loadSavedVehicles(true);
      } catch (e) { }
    });

    window.addEventListener('auto-saved', async (ev) => {
      try { await this.vehicleManager.loadSavedVehicles(true); } catch (e) { }
    });
  }

  async _loadTailwindCss() {
    if (this.constructor._tailwindCss) return this.constructor._tailwindCss;
    try {
      const res = await fetch('/assets/css/tailwind.css');
      const css = await res.text();
      this.constructor._tailwindCss = css;
      return css;
    } catch (e) {
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
    if (tw) {
      const s = document.createElement('style');
      s.textContent = tw;
      this.root.appendChild(s);
    }
    this.root.appendChild(templateCache.content.cloneNode(true));
  }

  populateYearOptions() {
    const yearSelect = this.root.querySelector('#ano-select');
    if (!yearSelect) return;
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 30; i--) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      yearSelect.appendChild(option);
    }
  }

  async loadServiceOptions() {
    const serviceSelect = this.root.querySelector('#servicio-select') || this.root.querySelector('#appointment-servicio');
    if (!serviceSelect) return;

    try {
      const services = await this.servicesService.getAll();
      const fragment = document.createDocumentFragment();

      services.forEach((service, index) => {
        const option = document.createElement('option');
        option.value = service.id_servicio || service.id || index;
        option.textContent = service.nombre || service.name || `Servicio ${index + 1}`;
        fragment.appendChild(option);
      });

      serviceSelect.innerHTML = '';
      serviceSelect.appendChild(fragment);

      // Pre-select from query param
      const params = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
      const pre = params.get('service') || params.get('servicio');
      if (pre) {
        const match = Array.from(serviceSelect.options).find((o) => o.value === pre);
        if (match) serviceSelect.value = pre;
      }
    } catch (error) {
      console.error('[appointment-form] Error loading services:', error);
      serviceSelect.innerHTML = '<option value="">No se pudieron cargar los servicios</option>';
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
        if (confirm('¿Estás seguro de cancelar? Se perderán los datos ingresados.')) {
          form.reset();
          if (typeof window !== 'undefined') window.location.href = '/';
        }
      });
    }

    // Delegate slot updates to SlotManager
    const dateInput = this.root.querySelector('#appointment-fecha');
    const serviceSelect = this.root.querySelector('#servicio-select') || this.root.querySelector('#appointment-servicio');

    const updateSlots = () => this.slotManager.updateAvailableSlots();

    if (dateInput) dateInput.addEventListener('change', updateSlots);
    if (serviceSelect) serviceSelect.addEventListener('change', updateSlots);
  }

  prefillFromPending() {
    try {
      const pending = sessionStorage.getItem('pendingCliente');
      if (pending) {
        const cliente = JSON.parse(pending);
        const token = apiClient.getToken();
        if (token) this.fillAndLockClient(cliente);
      }
      sessionStorage.removeItem('pendingCliente');
    } catch (e) { }
  }

  async prefillClientData() {
    try {
      const p = await apiClient.get('/clientes/me');
      const prof = p?.data || p;
      if (prof) this.fillAndLockClient(prof);
    } catch (e) { }
  }

  fillAndLockClient(cliente) {
    try {
      const mapping = {
        'appointment-nombre': cliente.nombre,
        'appointment-telefono': cliente.telefono || cliente.phone,
        'appointment-email': cliente.email,
        'appointment-direccion': cliente.direccion,
      };

      Object.entries(mapping).forEach(([id, val]) => {
        const el = this.root.querySelector(`#${id}`);
        if (el && val) {
          el.value = val;
          el.readOnly = true;
          el.classList.add('bg-gray-100', 'cursor-not-allowed');
        }
      });

      const id = cliente.id_cliente || cliente.id || cliente._id || cliente.idCliente;
      if (id) this.setHiddenClienteId(id);
    } catch (e) { }
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
    } catch (e) { }
  }

  lockForUnauth() {
    try {
      const form = this.root.querySelector('#appointment-form');
      if (!form) return;

      // Create overlay
      const overlay = document.createElement('div');
      overlay.id = 'auth-overlay';
      overlay.className = 'absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6';
      overlay.innerHTML = `
        <div class="bg-white p-8 rounded-2xl shadow-2xl max-w-md border border-gray-100">
          <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Inicia sesión para continuar</h3>
          <p class="text-gray-600 mb-6">Para agendar una cita necesitamos identificar tu cuenta.</p>
          <button id="trigger-login" class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Iniciar Sesión / Registrarse
          </button>
        </div>
      `;

      form.style.position = 'relative';
      form.appendChild(overlay);

      const btn = overlay.querySelector('#trigger-login');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('open-auth', { detail: 'login' }));
        });
      }
    } catch (e) { }
  }

  hideAuthOverlay() {
    try {
      const overlay = this.root.querySelector('#auth-overlay');
      if (overlay) overlay.remove();
    } catch (e) { }
  }

  renderErrorStatus(container, title, errors = []) {
    if (!container) return;
    container.classList.remove('hidden');
    container.className = 'mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg';

    let html = `<p class="font-bold text-red-700">${title}</p>`;
    if (errors.length > 0) {
      html += `<ul class="mt-2 list-disc list-inside text-sm text-red-600">`;
      errors.forEach(err => html += `<li>${err}</li>`);
      html += `</ul>`;
    }
    container.innerHTML = html;
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  renderSuccessStatus(container, title, message) {
    if (!container) return;
    container.classList.remove('hidden');
    container.className = 'mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg';
    container.innerHTML = `
      <p class="font-bold text-green-700">${title}</p>
      <p class="text-sm text-green-600 mt-1">${message}</p>
    `;
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const statusDiv = this.root.querySelector('#form-status');

    if (statusDiv) statusDiv.classList.add('hidden');

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="inline-block animate-spin mr-2">↻</span> Procesando...`;
      }

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const validation = this.appointmentsService.validateAppointmentData(data);
      if (!validation.isValid) {
        this.renderErrorStatus(statusDiv, 'Por favor corrige los siguientes campos:', validation.errors);
        return;
      }

      const response = await this.appointmentsService.create(data);
      this.renderSuccessStatus(
        statusDiv,
        '¡Cita agendada con éxito!',
        `Tu cita ha sido registrada para el ${data.fecha} a las ${data.hora}.`
      );

      window.dispatchEvent(new CustomEvent('appointment-saved', {
        detail: { appointment: response },
        bubbles: true,
        composed: true
      }));

      form.reset();
      setTimeout(() => {
        if (typeof window !== 'undefined') window.location.href = '/mi-cuenta.html#citas';
      }, 2000);

    } catch (error) {
      console.error('[appointment-form] Submit error:', error);
      const msg = error.message || 'Ocurrió un error al procesar tu solicitud.';
      this.renderErrorStatus(statusDiv, 'Error al agendar cita', [msg]);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Agendar Cita';
      }
    }
  }
}

customElements.define('appointment-form', AppointmentForm);
export { AppointmentForm };
export default AppointmentForm;
