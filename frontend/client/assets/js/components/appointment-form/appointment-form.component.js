import { AppointmentsService } from '../../services/appointments.service.js';
import ServicesService from '../../services/services.service.js';
import { appointmentFormTemplate } from './appointment-form.template.js';
import { appointmentFormStyles } from './appointment-form.styles.js';

const templateCache = document.createElement('template');

class AppointmentForm extends HTMLElement {
  constructor() {
    super();
    this.appointmentsService = new AppointmentsService();
    this.servicesService = new ServicesService();
  }

  connectedCallback() {
    this.render();
    this.populateYearOptions();
    this.loadServiceOptions();
    this.registerEvents();
  }

  render() {
    if (!templateCache.innerHTML) {
      templateCache.innerHTML = `
        <style>${appointmentFormStyles}</style>
        ${appointmentFormTemplate()}
      `;
    }

    this.innerHTML = '';
    const content = templateCache.content.cloneNode(true);
    this.appendChild(content);
  }

  populateYearOptions() {
    const yearSelect = this.querySelector('#ano-select');
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
    const serviceSelect = this.querySelector('#servicio-select');
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
        option.value =
          service.id ||
          service._id ||
          service.codigo ||
          service.slug ||
          service.nombre ||
          service.name ||
          `svc-${index}`;
        option.textContent = service.name || service.nombre || 'Servicio';
        fragment.appendChild(option);
      });

      serviceSelect.innerHTML = '';
      serviceSelect.appendChild(fragment);
    } catch (error) {
      console.error('[appointment-form] Error al cargar servicios:', error);
      serviceSelect.innerHTML = '<option value=\"\">No se pudieron cargar los servicios</option>';
    }
  }

  registerEvents() {
    const form = this.querySelector('#appointment-form');
    if (form) {
      form.addEventListener('submit', (event) => this.handleSubmit(event));
    }

    const cancelBtn = this.querySelector('#cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (confirm('Estas seguro que deseas cancelar el registro de la cita?')) {
          window.location.href = 'index.html';
        }
      });
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const submitBtn = this.querySelector('#submit-btn');
    const statusDiv = this.querySelector('#form-status');

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

      await this.appointmentsService.create(data);
      this.renderSuccessStatus(
        statusDiv,
        'Cita agendada con exito',
        'Te contactaremos pronto para confirmar los detalles.',
      );
      form.reset();
      statusDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } catch (error) {
      console.error('[appointment-form] Error al agendar cita:', error);
      this.renderErrorStatus(statusDiv, error.message || 'No se pudo agendar la cita. Intenta nuevamente.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Agendar Cita';
    }
  }

  renderSuccessStatus(target, title, message) {
    if (!target) return;
    target.className = 'p-4 bg-green-100 border-2 border-green-500 text-green-700 rounded-lg';
    target.innerHTML = `
      <div class="flex items-center font-semibold mb-2">
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
      <p class="font-semibold mb-2">${message}</p>
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
