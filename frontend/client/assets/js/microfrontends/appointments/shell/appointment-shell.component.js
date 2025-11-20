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
            <button id="open-login" class="px-4 py-2 bg-blue-600 text-white rounded">Iniciar sesión</button>
            <button id="open-register" class="px-4 py-2 bg-gray-200 text-gray-800 rounded">Registrarse</button>
          </div>
        </div>

        <!-- Modal -->
        <div id="auth-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
          <div class="w-full max-w-sm mx-auto p-4">
            <div class="bg-white rounded-2xl shadow-lg p-6 relative">
              <div id="auth-forms"></div>
              <div class="mt-4 text-right">
                <button id="auth-close" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md border">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      `;

      this.root.appendChild(wrapper);

      const openLogin = wrapper.querySelector('#open-login');
      const openRegister = wrapper.querySelector('#open-register');
      const modal = wrapper.querySelector('#auth-modal');
      const authForms = wrapper.querySelector('#auth-forms');
      const authClose = wrapper.querySelector('#auth-close');

      const showModal = (html) => {
        authForms.innerHTML = `
          <div class="relative">
            <button id="auth-close-top" class="absolute right-4 top-4 text-gray-400 hover:text-gray-700">✕</button>
            <div id="auth-status" class="mb-4 text-sm text-gray-600"></div>
            <div class="space-y-4">
              ${html}
            </div>
          </div>
        `;
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        const loginForm = authForms.querySelector('#login-form');
        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        const registerForm = authForms.querySelector('#register-form');
        if (registerForm) registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        const closeTop = authForms.querySelector('#auth-close-top');
        if (closeTop) closeTop.addEventListener('click', () => { modal.classList.add('hidden'); modal.style.display='none'; });
      };

      openLogin.addEventListener('click', () => {
        showModal(`
            <div class="text-center">
              <h3 class="text-2xl font-semibold mb-1">Iniciar sesión</h3>
              <p class="text-sm text-gray-500 mb-4">Accede para continuar</p>
            </div>
            <form id="login-form" class="space-y-4">
              <div>
                <label for="login-email" class="block text-sm mb-1 text-gray-600">Email</label>
                <input id="login-email" name="email" type="email" autocomplete="email" required class="w-full block px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <label for="login-password" class="block text-sm mb-1 text-gray-600">Contraseña</label>
                <input id="login-password" name="password" type="password" autocomplete="current-password" required class="w-full block px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <button type="submit" style="display:block;width:100%;padding:12px 16px;box-shadow:0 6px 18px rgba(2,6,23,0.12);" class="w-full block px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg">Ingresar</button>
              </div>
              <div class="text-center mt-1">
                <a href="#" class="text-sm text-teal-600 hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
            </form>
          `);
      });

      openRegister.addEventListener('click', () => {
        showModal(`
            <div class="text-center">
              <h3 class="text-2xl font-semibold mb-1">Crear cuenta</h3>
              <p class="text-sm text-gray-500 mb-4">Regístrate en unos segundos</p>
            </div>
            <form id="register-form" class="space-y-4">
              <div>
                <label for="register-nombre" class="block text-sm mb-1 text-gray-600">Nombre</label>
                <input id="register-nombre" name="nombre" type="text" autocomplete="name" required class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <label for="register-email" class="block text-sm mb-1 text-gray-600">Email</label>
                <input id="register-email" name="email" type="email" autocomplete="email" required class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <label for="register-telefono" class="block text-sm mb-1 text-gray-600">Teléfono</label>
                <input id="register-telefono" name="telefono" type="tel" autocomplete="tel" required class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <label for="register-direccion" class="block text-sm mb-1 text-gray-600">Dirección</label>
                <input id="register-direccion" name="direccion" type="text" autocomplete="street-address" class="w-full px-4 py-3 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label for="register-password" class="block text-sm mb-1 text-gray-600">Contraseña</label>
                <input id="register-password" name="password" type="password" autocomplete="new-password" required class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-100" />
              </div>
              <div>
                <button type="submit" class="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg">Crear cuenta</button>
              </div>
            </form>
          `);
      });

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
      const res = await apiClient.post('/clientes', body);
      const cliente = res?.data || res;
      if (body.password && body.email) {
        try {
          const loginRes = await apiClient.post('/auth/login', { email: body.email, password: body.password });
          const token = loginRes?.data?.token || loginRes?.token || (loginRes && loginRes.token) || (loginRes && loginRes.data && loginRes.data.token);
          if (token) {
            localStorage.setItem('token', token);
          }
        } catch (le) {
          console.warn('Auto-login fallido', le);
        }
      }
      try { sessionStorage.setItem('pendingCliente', JSON.stringify(cliente)); } catch (e) {}
      if (statusEl) { statusEl.className = 'text-sm text-green-600'; statusEl.textContent = 'Registro exitoso'; }
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
