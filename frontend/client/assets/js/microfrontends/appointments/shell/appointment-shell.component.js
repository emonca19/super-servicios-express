import '../../../components/appointment-form/index.js';
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
    // Ensure base template loaded
    if (!templateCache.innerHTML) {
      templateCache.innerHTML = `${appointmentShellTemplate()}`;
    }

    // Decide view depending on authentication
    const token = apiClient.getToken();

    this.root.innerHTML = '';
    await injectStyles(this.root, appointmentShellStyles);

    if (token) {
      // Authenticated — show appointment form
      this.root.appendChild(templateCache.content.cloneNode(true));
    } else {
      // Not authenticated — render an auth gate with login/register
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow">
          <h2 class="text-2xl font-bold mb-2">Antes de agendar</h2>
          <p class="text-sm text-gray-600 mb-6">Por favor inicia sesión o regístrate antes de continuar con el registro de tu cita.</p>
          <div class="flex gap-4">
            <button id="open-login" class="px-4 py-2 bg-blue-600 text-white rounded">Iniciar sesión</button>
            <button id="open-register" class="px-4 py-2 bg-gray-200 text-gray-800 rounded">Registrarse</button>
          </div>
        </div>

        <!-- Modal -->
        <div id="auth-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
          <div class="bg-white rounded-lg w-full max-w-xl p-6">
            <div id="auth-forms"></div>
            <div class="mt-4 text-right">
              <button id="auth-close" class="px-4 py-2 bg-gray-300 rounded">Cerrar</button>
            </div>
          </div>
        </div>
      `;

      this.root.appendChild(wrapper);

      // Attach event listeners
      const openLogin = wrapper.querySelector('#open-login');
      const openRegister = wrapper.querySelector('#open-register');
      const modal = wrapper.querySelector('#auth-modal');
      const authForms = wrapper.querySelector('#auth-forms');
      const authClose = wrapper.querySelector('#auth-close');

      const showModal = (html) => {
        authForms.innerHTML = `
          <div class="relative">
            <button id="auth-close-top" class="absolute right-0 top-0 text-gray-500 hover:text-gray-800">✕</button>
            <div id="auth-status" class="mb-4"></div>
            ${html}
          </div>
        `;
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        // attach internal listeners
        const loginForm = authForms.querySelector('#login-form');
        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        const registerForm = authForms.querySelector('#register-form');
        if (registerForm) registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        const closeTop = authForms.querySelector('#auth-close-top');
        if (closeTop) closeTop.addEventListener('click', () => { modal.classList.add('hidden'); modal.style.display='none'; });
      };

      openLogin.addEventListener('click', () => {
        showModal(`
          <h3 class="text-lg font-semibold mb-4">Iniciar sesión</h3>
          <form id="login-form" class="space-y-3">
            <div>
              <label class="block text-sm">Email</label>
              <input name="email" type="email" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm">Contraseña</label>
              <input name="password" type="password" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div class="pt-3">
              <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Ingresar</button>
            </div>
          </form>
        `);
      });

      openRegister.addEventListener('click', () => {
        showModal(`
          <h3 class="text-lg font-semibold mb-4">Registrarse</h3>
          <form id="register-form" class="space-y-3">
            <div>
              <label class="block text-sm">Nombre</label>
              <input name="nombre" type="text" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm">Email</label>
              <input name="email" type="email" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm">Teléfono</label>
              <input name="telefono" type="tel" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm">Dirección</label>
              <input name="direccion" type="text" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm">Contraseña</label>
              <input name="password" type="password" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div class="pt-3">
              <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Crear cuenta</button>
            </div>
          </form>
        `);
      });

      // close when clicking backdrop
      modal.addEventListener('click', (ev) => {
        if (ev.target === modal) {
          modal.classList.add('hidden');
          modal.style.display = 'none';
        }
      });
      authClose.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
      });
    }
  }

  async handleLogin(event) {
    try {
      event.preventDefault();
      const form = event.currentTarget;
      const fd = new FormData(form);
      const body = Object.fromEntries(fd.entries());
      const statusEl = this.root.querySelector('#auth-status');
      if (statusEl) { statusEl.className = 'text-sm text-gray-600'; statusEl.textContent = 'Iniciando sesión...'; }
      const res = await apiClient.post('/auth/login', body);
      const token = res?.data?.token || res?.token || (res && res.token) || (res && res.data && res.data.token);
      if (!token) throw new Error('Token no recibido');
      localStorage.setItem('token', token);
      if (statusEl) { statusEl.className = 'text-sm text-green-600'; statusEl.textContent = 'Inicio de sesión exitoso'; }
      // re-render to show appointment form
      await this.render();
    } catch (e) {
      const statusEl = this.root.querySelector('#auth-status');
      const message = e?.body?.message || e?.message || JSON.stringify(e?.body) || String(e);
      if (statusEl) { statusEl.className = 'text-sm text-red-600'; statusEl.textContent = 'Error: ' + message; }
    }
  }

  async handleRegister(event) {
    try {
      event.preventDefault();
      const form = event.currentTarget;
      const fd = new FormData(form);
      const body = Object.fromEntries(fd.entries());
      const statusEl = this.root.querySelector('#auth-status');
      if (statusEl) { statusEl.className = 'text-sm text-gray-600'; statusEl.textContent = 'Creando cuenta...'; }
      // Create cliente via API
      const res = await apiClient.post('/clientes', body);
      const cliente = res?.data || res;
      // If the user provided a password, attempt to login automatically
      if (body.password && body.email) {
        try {
          const loginRes = await apiClient.post('/auth/login', { email: body.email, password: body.password });
          const token = loginRes?.data?.token || loginRes?.token || (loginRes && loginRes.token) || (loginRes && loginRes.data && loginRes.data.token);
          if (token) {
            localStorage.setItem('token', token);
          }
        } catch (le) {
          // ignore login error — user can still continue with prefilled form
          console.warn('Auto-login fallido', le);
        }
      }
      // store temporarily to prefill appointment form
      try { sessionStorage.setItem('pendingCliente', JSON.stringify(cliente)); } catch (e) {}
      if (statusEl) { statusEl.className = 'text-sm text-green-600'; statusEl.textContent = 'Registro exitoso'; }
      // re-render to show appointment form
      await this.render();
    } catch (e) {
      const statusEl = this.root.querySelector('#auth-status');
      const message = e?.body?.message || e?.message || JSON.stringify(e?.body) || String(e);
      if (statusEl) { statusEl.className = 'text-sm text-red-600'; statusEl.textContent = 'Error: ' + message; }
    }
  }
}

customElements.define('appointment-shell', AppointmentShell);

export default AppointmentShell;
export { AppointmentShell };
