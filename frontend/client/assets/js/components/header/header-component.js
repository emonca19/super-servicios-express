import { headerTemplate } from './header-component.template.js';
import { injectStyles } from '../../utils/shadow-style-loader.js';
import apiClient from '../../services/api-client.js';

const templateCache = document.createElement('template');

class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.afterAuthRedirect = null;
        this._profile = null;
    }

    // Prefer a globally exposed apiClient but fall back to the imported one
    getClient() {
        return (typeof window !== 'undefined' && window.apiClient) ? window.apiClient : apiClient;
    }

    onUserLoggedIn(ev) {
        try {
            const detail = ev && ev.detail;
            if (detail) {
                // Some emitters pass the profile object directly, others wrap it
                const profile = detail?.cliente || detail || null;
                if (profile) {
                    this._profile = profile;
                    try { sessionStorage.setItem('pendingCliente', JSON.stringify(profile)); } catch (e) {}
                }
            } else {
                // fallback: try sessionStorage
                try { this._profile = JSON.parse(sessionStorage.getItem('pendingCliente') || 'null'); } catch (e) { this._profile = null; }
            }
        } catch (e) {}
        // re-render header to show profile
        try { this.render(); } catch (e) {}
    }

    // Try to decode a JWT without verifying to read payload (safe for UI use)
    parseJwt(token) {
        try {
            const parts = token.split('.');
            if (parts.length < 2) return null;
            const payload = parts[1];
            const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(decodeURIComponent(escape(json)));
        } catch (e) {
            return null;
        }
    }

    toggleProfileMenu(container) {
        try {
        // remove existing menu if present
        const existing = this.root.querySelector('.profile-menu');
        if (existing) { existing.remove(); return; }

        const menu = document.createElement('div');
            menu.className = 'profile-menu absolute right-4 mt-12 bg-white border rounded shadow-lg py-2 w-44 z-50';
            menu.innerHTML = `
              <a href="mi-cuenta.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Cuenta</a>
              <a href="mi-cuenta.html#autos" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mis Automóviles</a>
              <a href="mi-cuenta.html#citas" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mis Citas</a>
              <div class="border-t my-1"></div>
              <button id="menu-logout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Cerrar sesión</button>
            `;

            // Ensure container is positioned relative to place absolute menu
            const parent = container || this.root.querySelector('#header-auth') || this.root;
            if (parent && parent.style) parent.style.position = 'relative';
            parent.appendChild(menu);

            const mLogout = menu.querySelector('#menu-logout');
            if (mLogout) mLogout.addEventListener('click', () => {
                try { localStorage.removeItem('token'); sessionStorage.removeItem('token'); } catch (e) {}
                this.render();
                menu.remove();
                try { window.location.replace('index.html'); } catch (e) { window.location.href = 'index.html'; }
            });
        } catch (e) { console.warn('[header] toggleProfileMenu error', e); }
    }

    async connectedCallback() {
        // Remove any plain <header> elements that were accidentally included in the page
        // and are not part of a header-component; match by brand text to be conservative.
        try {
            Array.from(document.querySelectorAll('header')).forEach(h => {
                if (!h.closest('header-component')) {
                    try {
                        const txt = (h.textContent || '').trim();
                        if (txt.includes('Auto Servicios') || txt.includes('Auto Servicios Express')) {
                            h.remove();
                        }
                    } catch (e) {}
                }
            });
        } catch (e) {}

        // Prevent duplicate header-component instances: keep only the first one on the page
        try {
            const all = document.querySelectorAll('header-component');
            if (all && all.length > 1) {
                // If this is not the first instance, remove it and stop
                if (all[0] !== this) {
                    try { this.remove(); } catch (e) {}
                    return;
                }
            }
        } catch (e) {}
        if (!templateCache.innerHTML) {
            templateCache.innerHTML = headerTemplate();
        }

        // Listen for global requests to open auth modal
        window.addEventListener('open-auth', () => { try { this.showAuthModal('login'); } catch (e) {} });

        // Listen for user login events so header updates immediately
        window.addEventListener('user-logged-in', (ev) => { try { this.onUserLoggedIn(ev); } catch (e) {} });

        // Expose apiClient globally as a convenience for older pages
        try { window.apiClient = window.apiClient || apiClient; } catch (e) {}

        await this.render();
    }

    async render() {
        this.root.innerHTML = '';
        // Inject compiled Tailwind + (no local styles for header currently)
        await injectStyles(this.root, '');
        this.root.appendChild(templateCache.content.cloneNode(true));

        // Defensive dedupe: if the shadowRoot contains more than one <header>, remove extras
        try {
            const hdrs = this.root.querySelectorAll('header');
            if (hdrs && hdrs.length > 1) {
                for (let i = 1; i < hdrs.length; i++) {
                    try { hdrs[i].remove(); } catch (e) {}
                }
            }
        } catch (e) {}

        // Wire up auth area and Agendar button behavior
        try {
            const authArea = this.root.querySelector('#header-auth');
            const btnAgendar = this.root.querySelector('#btn-agendar');
            const client = this.getClient();
            const token = client.getToken && client.getToken();

            // Render auth area based on token
            if (authArea) {
                                if (token) {
                                        // Try get profile first-name from sessionStorage to show in header
                                        // compute profile name and initials
                                        let profileName = null;
                                        let initials = null;
                                        try {
                                            const p = this._profile || JSON.parse(sessionStorage.getItem('pendingCliente') || 'null');
                                            if (p && p.nombre) {
                                                profileName = p.nombre.split(' ')[0];
                                                const parts = p.nombre.trim().split(' ').filter(Boolean);
                                                initials = parts.length ? parts.slice(0,2).map(s => s[0].toUpperCase()).join('') : (p.nombre[0]||'').toUpperCase();
                                            }
                                        } catch (e) {}
                                        authArea.innerHTML = `
                                            <div class="flex items-center space-x-3">
                                                <a id="profile-link" href="#" title="Mi cuenta" class="flex items-center space-x-3 text-gray-700 hover:text-blue-600">
                                                    ${initials ? `<span class="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">${initials}</span>` : `<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"h-11 w-11 text-gray-700\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M5.121 17.804A13.937 13.937 0 0112 15c2.761 0 5.29.795 7.379 2.204M15 11a3 3 0 11-6 0 3 3 0 016 0z\"/></svg>`}
                                                    ${profileName ? `<span class="hidden sm:inline-block text-sm text-gray-700">${profileName}</span>` : ''}
                                                </a>
                                            </div>
                                        `;

                    // Profile dropdown toggle (desktop)
                    const profileLink = this.root.querySelector('#profile-link');
                    if (profileLink) profileLink.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        this.toggleProfileMenu(this.root.querySelector('#header-auth'));
                    });
                } else {
                    authArea.innerHTML = `
                      <button id="header-login" class="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 hover:bg-blue-600 hover:text-white transition-all duration-200 text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
                    `;
                    const hLogin = this.root.querySelector('#header-login');
                    if (hLogin) hLogin.addEventListener('click', (ev) => { ev.preventDefault(); this.showAuthModal('login'); });
                }
            }

                        // Mobile auth rendering: mirror desktop auth area into mobile placeholder
                        const mobileAuth = this.root.querySelector('#header-auth-mobile');
                        if (mobileAuth) {
                                if (token) {
                                        mobileAuth.innerHTML = `
                                            <a id="profile-link-mobile" href="#" title="Mi cuenta" class="flex items-center text-gray-700 hover:text-blue-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.121 17.804A13.937 13.937 0 0112 15c2.761 0 5.29.795 7.379 2.204M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                            </a>
                                        `;
                                        const profMobile = this.root.querySelector('#profile-link-mobile');
                                        if (profMobile) profMobile.addEventListener('click', (ev) => { ev.preventDefault(); this.toggleProfileMenu(mobileAuth); });
                                } else {
                                        mobileAuth.innerHTML = `
                                          <button id="header-login-mobile" class="flex items-center justify-center h-9 w-9 rounded-full bg-gray-200 hover:bg-blue-600 hover:text-white transition-all duration-200 text-gray-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                          </button>
                                        `;
                                        const hLoginMobile = this.root.querySelector('#header-login-mobile');
                                        if (hLoginMobile) hLoginMobile.addEventListener('click', (ev) => { ev.preventDefault(); this.showAuthModal('login'); });
                                }
                        }

                        // If token exists but we don't have profile cached, try to fetch it once (best-effort)
                        try {
                            const cached = sessionStorage.getItem('pendingCliente');
                            if (token && !cached) {
                                // First try /clientes/me
                                apiClient.get('/clientes/me').then((p) => {
                                    const prof = p?.data || p;
                                    if (prof) {
                                        try { sessionStorage.setItem('pendingCliente', JSON.stringify(prof)); } catch (e) {}
                                        this._profile = prof;
                                        this.render();
                                    }
                                }).catch(async () => {
                                    // If /me fails, try to decode token and fetch by id
                                    try {
                                        const tok = apiClient.getToken();
                                        const payload = this.parseJwt(tok || '');
                                        const id = payload && payload.id ? payload.id : null;
                                        if (id && !isNaN(Number(id))) {
                                            try {
                                                const r = await apiClient.get(`/clientes/${id}`);
                                                const prof2 = r?.data || r;
                                                if (prof2) {
                                                    try { sessionStorage.setItem('pendingCliente', JSON.stringify(prof2)); } catch (e) {}
                                                    this._profile = prof2;
                                                    this.render();
                                                }
                                            } catch (e) {
                                                // ignore final failure
                                            }
                                        }
                                    } catch (e) {}
                                });
                            }
                        } catch (e) {}

            if (btnAgendar) {
                btnAgendar.addEventListener('click', (ev) => {
                    const token = apiClient.getToken();
                    if (!token) {
                        ev.preventDefault();
                        // remember redirect after auth and open modal
                        this.afterAuthRedirect = 'agendar-cita.html';
                        this.showAuthModal('login');
                    } else {
                        // allow navigation to agendar-cita.html
                    }
                });
            }
            // Wire header-login to open modal
            const headerLogin = this.root.querySelector('#header-login');
            if (headerLogin) {
                headerLogin.addEventListener('click', (ev) => { ev.preventDefault(); this.showAuthModal('login'); });
            }

            // Wire global modal close/backdrop
            const globalModal = this.root.querySelector('#global-auth-modal');
            const globalClose = this.root.querySelector('#global-auth-close');
            if (globalModal) {
                globalModal.addEventListener('click', (ev) => { if (ev.target === globalModal) this.hideAuthModal(); });
            }
            if (globalClose) globalClose.addEventListener('click', () => this.hideAuthModal());
        } catch (e) {
            // non-fatal
            console.warn('[header] render error', e);
        }
    }

  showAuthModal(mode = 'login') {
    const modal = this.root.querySelector('#global-auth-modal');
    const forms = this.root.querySelector('#global-auth-forms');
    if (!modal || !forms) return;

    // Posicionar el modal según el dispositivo
    const isMobile = window.innerWidth < 768; // md breakpoint
    const modalCard = modal.querySelector('div:first-child');
    
    if (isMobile) {
      // En móviles, posicionar en el centro
      modal.classList.remove('bg-slate-900/40');
      modal.classList.add('flex', 'items-center', 'justify-center', 'p-4');
      modalCard.className = 'bg-white rounded-2xl w-full max-w-xs p-4 shadow-2xl border';
    } else {
      // En escritorio, posicionar cerca del botón
      modal.classList.remove('flex', 'items-center', 'justify-center', 'p-4');
      modal.classList.add('bg-slate-900/40');
      modalCard.className = 'absolute top-20 right-6 bg-white rounded-2xl w-full max-w-xs p-4 shadow-2xl border';
    }

    const attachHandlers = () => {
      const loginForm = forms.querySelector('#login-form');
      if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
      const registerForm = forms.querySelector('#register-form');
      if (registerForm) registerForm.addEventListener('submit', (e) => this.handleRegister(e));
      const closeTop = forms.querySelector('#auth-close-top');
      if (closeTop) closeTop.addEventListener('click', () => this.hideAuthModal());
    };

    const renderLogin = () => {
      forms.innerHTML = `
        <div class="relative">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-base font-semibold">Iniciar sesión</h3>
            <button id="auth-close-top" class="text-gray-400 hover:text-gray-600 text-lg font-bold">×</button>
          </div>
          <div id="global-auth-status" class="mb-3"></div>
          <form id="login-form" class="space-y-2">
            <div><label class="block text-xs text-gray-600">Email</label><input name="email" type="email" required class="w-full px-2 py-1.5 text-sm border rounded" /></div>
            <div><label class="block text-xs text-gray-600">Contraseña</label><input name="password" type="password" required class="w-full px-2 py-1.5 text-sm border rounded" /></div>
            <div class="pt-2"><button type="submit" class="w-full px-3 py-1.5 bg-blue-600 text-white rounded text-sm">Ingresar</button></div>
          </form>
          <div class="mt-2 text-center">
            <button id="switch-to-register" class="text-xs text-blue-600 hover:underline">¿No tienes cuenta? Regístrate</button>
          </div>
        </div>
      `;
      attachHandlers();
      const switchBtn = forms.querySelector('#switch-to-register');
      if (switchBtn) switchBtn.addEventListener('click', () => renderRegister());
    };

    const renderRegister = () => {
      forms.innerHTML = `
        <div class="relative">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-base font-semibold">Registrarse</h3>
            <button id="auth-close-top" class="text-gray-400 hover:text-gray-600 text-lg font-bold">×</button>
          </div>
          <div id="global-auth-status" class="mb-3"></div>
          <form id="register-form" class="space-y-2">
            <div><label class="block text-xs text-gray-600">Nombre</label><input name="nombre" type="text" required class="w-full px-2 py-1.5 text-sm border rounded" /></div>
            <div><label class="block text-xs text-gray-600">Email</label><input name="email" type="email" required class="w-full px-2 py-1.5 text-sm border rounded" /></div>
            <div><label class="block text-xs text-gray-600">Teléfono</label><input name="telefono" type="tel" required class="w-full px-2 py-1.5 text-sm border rounded" /></div>
            <div><label class="block text-xs text-gray-600">Dirección</label><input name="direccion" type="text" class="w-full px-2 py-1.5 text-sm border rounded" /></div>
            <div><label class="block text-xs text-gray-600">Contraseña</label><input name="password" type="password" required class="w-full px-2 py-1.5 text-sm border rounded" /></div>
            <div class="pt-2"><button type="submit" class="w-full px-3 py-1.5 bg-green-600 text-white rounded text-sm">Crear cuenta</button></div>
          </form>
          <div class="mt-2 text-center">
            <button id="switch-to-login" class="text-xs text-blue-600 hover:underline">¿Ya tienes cuenta? Inicia sesión</button>
          </div>
        </div>
      `;
      attachHandlers();
      const switchBtn = forms.querySelector('#switch-to-login');
      if (switchBtn) switchBtn.addEventListener('click', () => renderLogin());
    };

    if (mode === 'register') renderRegister(); else renderLogin();
    modal.classList.remove('hidden');
    modal.style.display = 'block';
  }    hideAuthModal() {
        const modal = this.root.querySelector('#global-auth-modal');
        const forms = this.root.querySelector('#global-auth-forms');
        if (!modal) return;
        modal.classList.add('hidden');
        modal.style.display = 'none';
        if (forms) forms.innerHTML = '';
    }

    async handleLogin(event) {
        try {
            event.preventDefault();
            const form = event.currentTarget;
            const fd = new FormData(form);
            const body = Object.fromEntries(fd.entries());
            const statusEl = this.root.querySelector('#global-auth-status');
            if (statusEl) { statusEl.className = 'text-sm text-gray-600'; statusEl.textContent = 'Iniciando sesión...'; }
            const res = await apiClient.post('/auth/login', body);
            const token = res?.data?.token || res?.token || (res && res.token) || (res && res.data && res.data.token);
            if (!token) throw new Error('Token no recibido');
            localStorage.setItem('token', token);
                        // fetch profile (best-effort). If it fails (400/404/401), proceed: token is saved and header will render accordingly.
                        let profile = null;
                        try {
                            const p = await apiClient.get('/clientes/me');
                            profile = p?.data || p;
                        } catch (e) {
                            // Non-fatal: likely using fallback account or profile not yet available. Continue without profile.
                        }
            // Always notify app that user is authenticated; include profile if available
            try { if (profile) sessionStorage.setItem('pendingCliente', JSON.stringify(profile)); } catch (e) {}
            window.dispatchEvent(new CustomEvent('user-logged-in', { detail: profile || null }));
            if (statusEl) { statusEl.className = 'text-sm text-green-600'; statusEl.textContent = 'Inicio de sesión exitoso'; }
            this.hideAuthModal();
            await this.render();
            // After render, if there is a pending redirect (e.g. user clicked Agendar), navigate
            try {
                if (this.afterAuthRedirect) {
                    const target = this.afterAuthRedirect;
                    this.afterAuthRedirect = null;
                    window.location.href = target;
                    return;
                }
            } catch (e) {}
        } catch (e) {
            const statusEl = this.root.querySelector('#global-auth-status');
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
            const statusEl = this.root.querySelector('#global-auth-status');
            if (statusEl) { statusEl.className = 'text-sm text-gray-600'; statusEl.textContent = 'Creando cuenta...'; }
            const res = await apiClient.post('/clientes', body);
            const cliente = res?.data || res;
            // Auto-login if password provided
            if (body.password && body.email) {
                try {
                    const loginRes = await apiClient.post('/auth/login', { email: body.email, password: body.password });
                    const token = loginRes?.data?.token || loginRes?.token || (loginRes && loginRes.token) || (loginRes && loginRes.data && loginRes.data.token);
                    if (token) {
                        localStorage.setItem('token', token);
                        const p = await apiClient.get('/clientes/me');
                        const profile = p?.data || p;
                        try { sessionStorage.setItem('pendingCliente', JSON.stringify(profile)); } catch (e) {}
                        window.dispatchEvent(new CustomEvent('user-logged-in', { detail: profile }));
                    }
                } catch (le) { console.warn('Auto-login fallido', le); }
            } else {
                // store created cliente temporarily to prefill appointment form
                try { sessionStorage.setItem('pendingCliente', JSON.stringify(cliente)); } catch (e) {}
                window.dispatchEvent(new CustomEvent('user-registered', { detail: cliente }));
            }
            if (statusEl) { statusEl.className = 'text-sm text-green-600'; statusEl.textContent = 'Registro exitoso'; }
            this.hideAuthModal();
            await this.render();
            try {
                if (this.afterAuthRedirect) {
                    const target = this.afterAuthRedirect;
                    this.afterAuthRedirect = null;
                    window.location.href = target;
                    return;
                }
            } catch (e) {}
        } catch (e) {
            const statusEl = this.root.querySelector('#global-auth-status');
            const message = e?.body?.message || e?.message || JSON.stringify(e?.body) || String(e);
            if (statusEl) { statusEl.className = 'text-sm text-red-600'; statusEl.textContent = 'Error: ' + message; }
        }
    }
}

customElements.define('header-component', HeaderComponent);
