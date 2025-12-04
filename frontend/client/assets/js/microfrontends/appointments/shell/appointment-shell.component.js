import '../components/form/index.js';
import { appointmentShellTemplate } from './appointment-shell.template.js';
import { appointmentShellStyles } from './appointment-shell.styles.js';
import { injectStyles } from '../../../utils/shadow-style-loader.js';
import apiClient from '../../../services/api-client.js';

const templateCache = document.createElement('template');

class AppointmentShell extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    await this.render();
  }

  async render() {
    if (!templateCache.innerHTML) {
      templateCache.innerHTML = `${appointmentShellTemplate()}`;
    }

    const token = apiClient.getToken();

    this.root.innerHTML = '';
    await injectStyles(this.root, appointmentShellStyles);

    if (token) {
      this.root.appendChild(templateCache.content.cloneNode(true));
    } else {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
          <h2 class="text-2xl font-bold mb-2">Antes de agendar</h2>
          <p class="text-sm text-gray-600 mb-6">Por favor inicia sesión o regístrate antes de continuar con el registro de tu cita.</p>
          <div class="flex gap-4">
            <button id="open-login" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Iniciar sesión</button>
            <button id="open-register" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Registrarse</button>
          </div>
        </div>
      `;

      this.root.appendChild(wrapper);

      const openLogin = wrapper.querySelector('#open-login');
      const openRegister = wrapper.querySelector('#open-register');

      if (openLogin) {
        openLogin.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('open-auth', { detail: 'login' }));
        });
      }

      if (openRegister) {
        openRegister.addEventListener('click', () => {
          window.dispatchEvent(new CustomEvent('open-auth', { detail: 'register' }));
        });
      }

      const loginHandler = () => {
        this.render();
        window.removeEventListener('user-logged-in', loginHandler);
      };
      window.addEventListener('user-logged-in', loginHandler);
    }
  }
}

customElements.define('appointment-shell', AppointmentShell);

export default AppointmentShell;
export { AppointmentShell };
