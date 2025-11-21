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
        this._suppressHide = false;
        this._protectModalUntil = 0; 
        this._modalObserver = null;
        this._pendingLoginError = null;
        this._pendingLoginValues = null;
        this._renderLoginForm = null;
        this._lastModalRenderAt = 0; 
    }

    getClient() {
        return (typeof window !== 'undefined' && window.apiClient) ? window.apiClient : apiClient;
    }

    onUserLoggedIn(ev) {
        try {
            const detail = ev && ev.detail;
            if (detail) {
                const profile = detail?.cliente || detail || null;
                if (profile) {
                    this._profile = profile;
                    try { sessionStorage.setItem('pendingCliente', JSON.stringify(profile)); } catch (e) {}
                }
            } else {
                try { this._profile = JSON.parse(sessionStorage.getItem('pendingCliente') || 'null'); } catch (e) { this._profile = null; }
            }
        } catch (e) {}
        try { this.render(); } catch (e) {}
    }

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
        const existing = this.root.querySelector('.profile-menu');
        if (existing) { existing.remove(); return; }

        const menu = document.createElement('div');
            menu.className = 'profile-menu absolute right-4 mt-12 bg-white border rounded shadow-lg py-2 z-50 ai-style-change-1';
            menu.style.width = '120px';
                        menu.innerHTML = `
                            <a href="mi-cuenta.html#perfil" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Cuenta</a>
                            <a href="mi-cuenta.html#autos" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mis Automóviles</a>
                            <a href="mi-cuenta.html#citas" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mis Citas</a>
                            <div class="border-t my-1"></div>
                            <button id="menu-logout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Cerrar sesión</button>
                        `;

            const parent = container || this.root.querySelector('#header-auth') || this.root;
            if (parent && parent.style) parent.style.position = 'relative';
            parent.appendChild(menu);

            try {
                const anchors = menu.querySelectorAll('a[href]');
                anchors.forEach(a => {
                    a.addEventListener('click', (ev) => {
                        try {
                            const href = a.getAttribute('href') || '';
                            const hashIndex = href.indexOf('#');
                            if (hashIndex !== -1) {
                                const tabName = href.substring(hashIndex + 1);
                                const dashboardEl = document.querySelector('account-dashboard');
                                if (dashboardEl) {
                                    ev.preventDefault();
                                    if (menu && menu.remove) menu.remove();
                                    const tryActivate = () => {
                                        try {
                                            if (typeof dashboardEl.showTab === 'function') {
                                                dashboardEl.showTab(tabName);
                                            } else {
                                                try { window.location.hash = `#${tabName}`; } catch (e) {}
                                            }
                                        } catch (err) {
                                            console.warn('[header] error activating dashboard tab', err);
                                            try { window.location.href = href; } catch (e) {}
                                        }
                                    };
                                    if (window.customElements && typeof window.customElements.whenDefined === 'function') {
                                        window.customElements.whenDefined('account-dashboard').then(tryActivate).catch(tryActivate);
                                    } else {
                                        tryActivate();
                                    }
                                    return;
                                }
                            }
                        } catch (err) {
                            console.warn('[header] menu anchor click handler error', err);
                        }
                    });
                });
            } catch (err) {
                console.debug('[header] error attaching menu link handlers', err);
            }

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

        try {
            const all = document.querySelectorAll('header-component');
            if (all && all.length > 1) {
                if (all[0] !== this) {
                    try { this.remove(); } catch (e) {}
                    return;
                }
            }
        } catch (e) {}
        if (!templateCache.innerHTML) {
            templateCache.innerHTML = headerTemplate();
        }

        window.addEventListener('open-auth', (ev) => {
            try {
                const d = ev && ev.detail;
                let mode = 'login';
                if (d) {
                    if (typeof d === 'string') mode = d;
                    else if (typeof d === 'object' && d.mode) mode = d.mode;
                }
                this.showAuthModal(mode);
            } catch (e) {}
        });

        window.addEventListener('user-logged-in', (ev) => { try { this.onUserLoggedIn(ev); } catch (e) {} });
   
        window.addEventListener('auth-expired', () => { try { this.handleAuthExpired(); } catch (e) {} });

        try { window.apiClient = window.apiClient || apiClient; } catch (e) {}

        await this.render();

        try {
            this._globalOpenAuthClick = (ev) => {
                try {
                    const path = ev.composedPath ? ev.composedPath() : (ev.path || []);
                    if (path && path.indexOf && (path.indexOf(this) !== -1 || path.indexOf(this.root) !== -1)) return;

                    let el = null;
                    if (path && path.length) {
                        for (let i = 0; i < path.length; i++) {
                            const p = path[i];
                            if (!p || !p.tagName) continue;
                            const tag = String(p.tagName).toLowerCase();
                            if (tag === 'a' || tag === 'button') { el = p; break; }
                        }
                    }
                    if (!el) return;
                    const txt = (el.textContent || '').trim();
                    if (/reg[ií]strate/i.test(txt)) {
                        try { ev.preventDefault(); } catch (e) {}
                        try { window.dispatchEvent(new CustomEvent('open-auth', { detail: 'register' })); } catch (e) {}
                    }
                } catch (e) {}
            };
            document.addEventListener('click', this._globalOpenAuthClick, true);
        } catch (e) {}

        try {
            if (!this._modalObserver) {
                this._modalObserver = new MutationObserver((mutations) => {
                    try {
                        if (!this._protectModalUntil || Date.now() >= this._protectModalUntil) return;
                        const modal = this.root.querySelector('#global-auth-modal');
                        if (!modal) {
                            try {
                                this.render().then(() => {
                                    try {
                                        setTimeout(() => {
                                            try { this.showAuthModal('login'); } catch (e) {}
                                        }, 160);
                                    } catch (e) {}
                                }).catch(() => {});
                            } catch (e) {}
                            return;
                        }
                        const isHidden = modal.classList.contains('hidden') || modal.style.display === 'none';
                        if (isHidden) {
                            try { modal.classList.remove('hidden'); modal.style.display = 'block'; modal.dataset.open = 'true'; } catch (e) {}
                            try { const first = this.root.querySelector('#global-auth-forms input'); if (first) first.focus(); } catch (e) {}
                        }
                    } catch (err) { }
                });
                this._modalObserver.observe(this.root, { attributes: true, childList: true, subtree: true, attributeFilter: ['class', 'style', 'data-open'] });
            }
        } catch (e) { console.warn('[header] failed to create modal observer', e); }
    }

    disconnectedCallback() {
        try {
            if (this._modalObserver) {
                this._modalObserver.disconnect();
                this._modalObserver = null;
            }
        } catch (e) {}
    }


    handleAuthExpired() {
        try {
            try { localStorage.removeItem('token'); sessionStorage.removeItem('token'); } catch (e) {}
            this._profile = null;
            this.render();
        } catch (e) { console.warn('[header] handleAuthExpired error', e); }
    }

    async render() {
        this.root.innerHTML = '';
            const componentStyles = `
                #global-auth-forms .mt-4.pt-4.border-t.border-gray-100.text-center.text-sm {
                    margin-bottom: 20px !important;
                }
                #global-auth-forms .flex.justify-between.items-start.mb-4 {
                    margin-top: 20px !important;
                }
                #global-auth-forms a.text-blue-600.hover\\:underline {
                    display: block !important;
                    margin: 16px auto !important;
                }
                #global-auth-forms #login-form a.text-blue-600.hover\\:underline {
                    margin-top: 4px !important;
                    margin-bottom: 15px !important;
                }
                
                /* APLICA EL ESTILO A TODOS LOS INPUTS DENTRO DE LOS FORMS (LOGIN Y REGISTER) */
                #global-auth-forms form input {
                    padding-top: 16px !important;
                    padding-bottom: 16px !important;
                    padding-left: 14px !important;
                    padding-right: 14px !important;
                    height: 30px !important;
                    font-size: 15px !important;
                    border-radius: 10px !important;
                }
                
                /* increase top margin of labels */
                #global-auth-forms form label {
                    margin-top: 8px !important;
                    display: block !important;
                }
            `;
        await injectStyles(this.root, componentStyles);
        this.root.appendChild(templateCache.content.cloneNode(true));

        try {
            const hdrs = this.root.querySelectorAll('header');
            if (hdrs && hdrs.length > 1) {
                for (let i = 1; i < hdrs.length; i++) {
                    try { hdrs[i].remove(); } catch (e) {}
                }
            }
        } catch (e) {}

        try {
            const authArea = this.root.querySelector('#header-auth');
            const btnAgendar = this.root.querySelector('#btn-agendar');
            const client = this.getClient();
            const token = client.getToken && client.getToken();

            if (authArea) {
                                if (token) {
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

                        try {
                            const cached = sessionStorage.getItem('pendingCliente');
                            if (token && !cached) {
                                apiClient.get('/clientes/me').then((p) => {
                                    const prof = p?.data || p;
                                    if (prof) {
                                        try { sessionStorage.setItem('pendingCliente', JSON.stringify(prof)); } catch (e) {}
                                        this._profile = prof;
                                        this.render();
                                    }
                                }).catch(async () => {
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
                        this.afterAuthRedirect = 'agendar-cita.html';
                        this.showAuthModal('login');
                    } else {
                    }
                });
            }
            const headerLogin = this.root.querySelector('#header-login');
            if (headerLogin) {
                headerLogin.addEventListener('click', (ev) => { ev.preventDefault(); this.showAuthModal('login'); });
            }

            const globalModal = this.root.querySelector('#global-auth-modal');
            const globalClose = this.root.querySelector('#global-auth-close');
            if (globalModal) {
                globalModal.addEventListener('click', (ev) => {
                    try {
                        const card = globalModal.querySelector('div:first-child');
                        const isOpen = globalModal.dataset.open === 'true';
                        const clickedOutsideCard = !card || !card.contains(ev.target);
                        if (isOpen && clickedOutsideCard) {
                            this.hideAuthModal();
                        }
                    } catch (err) { console.warn('[header] globalModal click handler error', err); }
                });
            }
            if (globalClose) globalClose.addEventListener('click', () => this.hideAuthModal());
        } catch (e) {
            console.warn('[header] render error', e);
        }
    }

    applyPendingLoginState() {
        try {
            const statusEl = this.root.querySelector('#global-auth-status');
            if (statusEl && this._pendingLoginError) {
                statusEl.innerHTML = `
                    <div role="alert" style="background:#FEF2F2;border:1px solid #FECACA;color:#991B1B;padding:8px 10px;border-radius:8px;font-size:0.9rem;">
                        <strong style="display:block;font-weight:700;margin-bottom:4px;">Error al iniciar sesión</strong>
                        <span style="display:block;">${this._pendingLoginError}</span>
                    </div>`;
            }
            if (this._pendingLoginValues) {
                const { email, password } = this._pendingLoginValues;
                const emailInput = this.root.querySelector('#global-login-email');
                if (emailInput && typeof email === 'string') emailInput.value = email;
                const passwordInput = this.root.querySelector('#global-login-password');
                if (passwordInput && typeof password === 'string') passwordInput.value = password;
            }
        } catch (e) { }
    }

  showAuthModal(mode = 'login') {
    try {
        const now = Date.now();
        if (now - (this._lastModalRenderAt || 0) < 120) return;
        this._lastModalRenderAt = now;
    } catch (e) {}

    const modal = this.root.querySelector('#global-auth-modal');
    const forms = this.root.querySelector('#global-auth-forms');
    if (!modal || !forms) return;

    const isMobile = window.innerWidth < 768; 
    const modalCard = modal.querySelector('div:first-child');
    const self = this;

    if (isMobile) {
        modal.classList.remove('bg-slate-900/40');
        modal.classList.add('flex', 'items-center', 'justify-center', 'p-4', 'fixed', 'inset-0', 'z-[9999]', 'bg-slate-900/40');
        modal.style.position = 'fixed'; 
        
        modalCard.className = 'bg-white rounded-2xl w-full max-w-sm p-4 shadow-2xl border relative';
        modalCard.style.top = ''; 
        modalCard.style.left = '';
        modalCard.style.transform = '';
    } else {
        modal.classList.remove('flex', 'items-center', 'justify-center', 'p-4');
        modal.classList.add('fixed', 'inset-0', 'z-[9999]', 'bg-slate-900/40');
        modal.style.position = 'fixed'; 

        modalCard.className = 'absolute bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border';
        modalCard.style.top = '3.8rem'; 
        modalCard.style.left = '50%';
        modalCard.style.transform = 'translateX(-50%)';
    }

    
    const attachHandlers = () => {
        try {
            const loginForm = forms.querySelector('#login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    try { e.preventDefault(); e.stopImmediatePropagation(); } catch (err) {}
                    try { self.handleLogin(e); } catch (err) { console.warn(err); }
                });
            }
            const registerForm = forms.querySelector('#register-form');
            if (registerForm) registerForm.addEventListener('submit', (e) => self.handleRegister(e));
        } catch (err) { console.warn(err); }
    };

    function renderLogin() {
        forms.innerHTML = `
            <div style="max-width:360px;margin:0 auto;">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Iniciar sesión</h3>
                        <p class="text-sm text-gray-500 mt-1">Accede con tu correo y contraseña</p>
                    </div>
                </div>

                <div id="global-auth-status" class="mb-4"></div>

                <form id="login-form" class="space-y-4" method="post">
                    <div>
                        <label for="global-login-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input id="global-login-email" name="email" type="email" autocomplete="email" required 
                            class="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                            placeholder="tu@email.com" />
                    </div>
                    <div>
                        <label for="global-login-password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input id="global-login-password" name="password" type="password" autocomplete="current-password" required 
                            class="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                            placeholder="••••••••" />
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="text-sm">
                            <a href="#" class="text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
                        </div>
                    </div>
                    <button id="global-login-submit" type="submit" style="display:block;width:100%;padding:12px 16px;background:#0f172a;color:#fff;border-radius:8px;box-shadow:0 8px 24px rgba(15,23,42,0.12);font-weight:700" class="w-full text-white">Ingresar</button>
                </form>
                <div class="mt-4 pt-4 border-t border-gray-100 text-center text-sm">
                    <button type="button" id="switch-to-register" class="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">¿No tienes cuenta? <span class="font-semibold">Regístrate</span></button>
                </div>
            </div>
        `;
        attachHandlers();
        if (self.applyPendingLoginState) self.applyPendingLoginState();
        
        const switchBtn = forms.querySelector('#switch-to-register');
        if (switchBtn) {
            switchBtn.addEventListener('click', (ev) => { 
                try { ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation(); } catch (e) {}
                renderRegister(); 
            });
        }
    }

    function renderRegister() {
        forms.innerHTML = `
            <div style="max-width:360px;margin:0 auto;">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-900">Crear cuenta</h3>
                        <p class="text-sm text-gray-500 mt-1">Regístrate en segundos</p>
                    </div>
                </div>

                <div id="global-auth-status" class="mb-4 text-sm text-gray-600"></div>

                <form id="register-form" class="space-y-3">
                    <div>
                        <label for="global-register-nombre" class="block text-sm font-medium text-gray-700 mb-1.5">Nombre completo</label>
                        <input id="global-register-nombre" name="nombre" type="text" autocomplete="name" required 
                            class="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                            placeholder="Juan Pérez" />
                    </div>
                    <div>
                        <label for="global-register-email" class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <input id="global-register-email" name="email" type="email" autocomplete="email" required 
                            class="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                            placeholder="tu@email.com" />
                    </div>
                    <div>
                        <label for="global-register-telefono" class="block text-sm font-medium text-gray-700 mb-1.5">Teléfono</label>
                        <input id="global-register-telefono" name="telefono" type="tel" autocomplete="tel" required 
                            class="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                            placeholder="+51 912 345 678" />
                    </div>
                    <div>
                        <label for="global-register-password" class="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
                        <input id="global-register-password" name="password" type="password" autocomplete="new-password" required 
                            class="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
                            placeholder="••••••••" />
                    </div>
                    <button type="submit" style="display:block;width:100%;padding:12px 16px;background:#0f172a;color:#fff;border-radius:8px;box-shadow:0 8px 24px rgba(15,23,42,0.12);font-weight:700;margin-top:22px;" class="w-full text-white mt-4">Crear cuenta</button>
                </form>
                <div class="mt-4 pt-4 border-t border-gray-100 text-center text-sm">
                    <button type="button" id="switch-to-login" class="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">¿Ya tienes cuenta? <span class="font-semibold">Inicia sesión</span></button>
                </div>
            </div>
        `;
        attachHandlers();
        if (self.applyPendingLoginState) self.applyPendingLoginState();
        
        const switchBtn = forms.querySelector('#switch-to-login');
        if (switchBtn) {
            switchBtn.addEventListener('click', (ev) => { 
                try { ev.preventDefault(); ev.stopPropagation(); ev.stopImmediatePropagation(); } catch (e) {}
                renderLogin(); 
            });
        }
    }

    if (mode === 'register') renderRegister(); else renderLogin();
    
    modal.classList.remove('hidden');
    modal.style.display = 'block'; 
    try { modal.dataset.open = 'true'; } catch (e) {}

    try {
        if (this._outsideClickHandler) { try { document.removeEventListener('click', this._outsideClickHandler, true); } catch (e) {} this._outsideClickHandler = null; }
        if (this._escHandler) { try { document.removeEventListener('keydown', this._escHandler); } catch (e) {} this._escHandler = null; }

        const card = modal.querySelector('div:first-child');
        this._outsideClickHandler = (ev) => {
            try {
                const path = ev.composedPath ? ev.composedPath() : (ev.path || []);
                const clickedInsideCard = card && path && path.indexOf(card) !== -1;
                if (!clickedInsideCard) this.hideAuthModal();
            } catch (err) {
                try { if (card && !card.contains(ev.target)) this.hideAuthModal(); } catch (e) {}
            }
        };

        setTimeout(() => {
            try { document.addEventListener('click', this._outsideClickHandler, true); } catch (e) {}
        }, 50);

        this._escHandler = (ev) => { try { if (ev.key === 'Escape' || ev.key === 'Esc') this.hideAuthModal(); } catch (e) {} };
        document.addEventListener('keydown', this._escHandler);
    } catch (e) {}

    try { setTimeout(() => { const first = forms.querySelector('input'); if (first) first.focus(); }, 30); } catch (e) {}
  }

    hideAuthModal() {
        if (this._suppressHide) {
            console.debug('[header] hideAuthModal suppressed due to login in progress');
            return;
        }
        try {
            if (this._protectModalUntil && Date.now() < this._protectModalUntil) {
                return;
            }
        } catch (e) {}
            try { this._pendingLoginError = null; this._pendingLoginValues = null; } catch (e) {}
        const modal = this.root.querySelector('#global-auth-modal');
            const forms = this.root.querySelector('#global-auth-forms');
            if (!modal) return;
            try { modal.dataset.open = 'false'; modal.removeAttribute('data-open'); } catch (e) {}
            modal.classList.add('hidden');
            modal.style.display = 'none';
            if (forms) forms.innerHTML = '';
            try { if (this._outsideClickHandler) { this.root.removeEventListener('click', this._outsideClickHandler); this._outsideClickHandler = null; } } catch (e) {}
            try { if (this._escHandler) { document.removeEventListener('keydown', this._escHandler); this._escHandler = null; } } catch (e) {}
    }

    async handleLogin(event) {
        this._suppressHide = true;
        try { this._pendingLoginError = null; this._pendingLoginValues = null; } catch (e) {}
        let lastLoginPayload = null;
        try {
                event.preventDefault();
                const form = event.currentTarget;
                const fd = new FormData(form);
                const body = Object.fromEntries(fd.entries());
                lastLoginPayload = body;
            const statusEl = this.root.querySelector('#global-auth-status');
            if (statusEl) { statusEl.className = 'text-sm text-gray-600'; statusEl.textContent = 'Iniciando sesión...'; }
                const res = await apiClient.post('/auth/login', body);
            const token = res?.data?.token || res?.token || (res && res.token) || (res && res.data && res.data.token);
            if (!token) throw new Error('Token no recibido');
            localStorage.setItem('token', token);
                        let profile = null;
                        try {
                            const p = await apiClient.get('/clientes/me');
                            profile = p?.data || p;
                        } catch (e) {
                        }
            try { if (profile) sessionStorage.setItem('pendingCliente', JSON.stringify(profile)); } catch (e) {}
            window.dispatchEvent(new CustomEvent('user-logged-in', { detail: profile || null }));
            if (statusEl) { statusEl.className = 'text-sm text-green-600'; statusEl.textContent = 'Inicio de sesión exitoso'; }
            this._suppressHide = false;
            try { const ov = document.querySelector('.global-auth-error-overlay'); if (ov) ov.remove(); } catch (e) {}
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
            console.warn('[header] handleLogin error', e);
            const message = e?.body?.message || e?.message || JSON.stringify(e?.body) || String(e);
            this._suppressHide = false;
            try { this._protectModalUntil = Date.now() + 600; } catch (err) { this._protectModalUntil = 0; }
            const modal = this.root.querySelector('#global-auth-modal');
            if (modal) {
                try { modal.classList.remove('hidden'); modal.style.display = 'block'; modal.dataset.open = 'true'; } catch (err) {}
            }
            this._pendingLoginError = message;
            this._pendingLoginValues = lastLoginPayload;

            const forms = this.root.querySelector('#global-auth-forms');
            if (forms && forms.querySelector('#login-form')) {
                try { this.applyPendingLoginState(); } catch (err) {}
            } else if (typeof this._renderLoginForm === 'function') {
                try { this._renderLoginForm(); } catch (err) { try { this.showAuthModal('login'); } catch (e2) {} }
            } else {
                try { this.showAuthModal('login'); } catch (err) {}
            }

            try { const focusTarget = this.root.querySelector('#global-auth-forms input'); if (focusTarget) focusTarget.focus(); } catch (err) {}
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