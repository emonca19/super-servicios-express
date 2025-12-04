import { headerTemplate } from './header-component.template.js';
import { injectStyles } from '../../utils/shadow-style-loader.js';
import apiClient from '../../services/api-client.js';


import '../../microfrontends/auth/index.js';

const templateCache = document.createElement('template');

class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this._profile = null;
    }

    getClient() {
        return (typeof window !== 'undefined' && window.apiClient) ? window.apiClient : apiClient;
    }

    onUserLoggedIn(ev) {
        try {
            const detail = ev && ev.detail;
            let profile = null;
            if (detail) {
                if (Object.prototype.hasOwnProperty.call(detail, 'cliente')) {
                    profile = detail.cliente;
                }

                if (profile) {
                    this._profile = profile;
                    try { sessionStorage.setItem('pendingCliente', JSON.stringify(profile)); } catch (e) { }
                } else {
                    try { sessionStorage.removeItem('pendingCliente'); } catch (e) { }
                    this._profile = null;
                }
            } else {
                try { this._profile = JSON.parse(sessionStorage.getItem('pendingCliente') || 'null'); } catch (e) { this._profile = null; }
            }
        } catch (e) { }
        try { this.render(); } catch (e) { }
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
                                                try { window.location.hash = `#${tabName}`; } catch (e) { }
                                            }
                                        } catch (err) {
                                            console.warn('[header] error activating dashboard tab', err);
                                            try { window.location.href = href; } catch (e) { }
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
                try {
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                } catch (e) { }

                this._profile = null;

                try { if (menu) menu.remove(); } catch (e) { }

                const isHomePage = window.location.pathname.endsWith('index.html') ||
                    window.location.pathname.endsWith('/') ||
                    document.querySelector('home-hero-section');

                if (isHomePage) {
                    this.render();
                } else {
                    window.location.href = 'index.html';
                }
            });
        } catch (err) {
            console.warn('[header] toggleProfileMenu error', err);
        }
    }

    async connectedCallback() {
        if (!templateCache.innerHTML) templateCache.innerHTML = headerTemplate();

        this._userLoggedInHandler = (ev) => this.onUserLoggedIn(ev);
        this._authExpiredHandler = () => this.handleAuthExpired();

        window.addEventListener('user-logged-in', this._userLoggedInHandler);
        window.addEventListener('auth-expired', this._authExpiredHandler);

        window.apiClient = window.apiClient || apiClient;

        await this.render();

        if (!document.querySelector('auth-modal')) {
            const modal = document.createElement('auth-modal');
            document.body.appendChild(modal);
        }
    }

    disconnectedCallback() {
        try { if (this._userLoggedInHandler) window.removeEventListener('user-logged-in', this._userLoggedInHandler); } catch (e) { }
        try { if (this._authExpiredHandler) window.removeEventListener('auth-expired', this._authExpiredHandler); } catch (e) { }
    }


    handleAuthExpired() {
        try {
            try { localStorage.removeItem('token'); sessionStorage.removeItem('token'); } catch (e) { }
            this._profile = null;
            this.render();
        } catch (e) { console.warn('[header] handleAuthExpired error', e); }
    }

    async render() {
        this.root.innerHTML = '';
        await injectStyles(this.root, '');
        this.root.appendChild(templateCache.content.cloneNode(true));

        try {
            const hdrs = this.root.querySelectorAll('header');
            if (hdrs && hdrs.length > 1) {
                for (let i = 1; i < hdrs.length; i++) {
                    try { hdrs[i].remove(); } catch (e) { }
                }
            }
        } catch (e) { }

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
                            initials = parts.length ? parts.slice(0, 2).map(s => s[0].toUpperCase()).join('') : (p.nombre[0] || '').toUpperCase();
                        }
                    } catch (e) { }
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
                    if (hLogin) hLogin.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        window.dispatchEvent(new CustomEvent('open-auth', { detail: 'login' }));
                    });
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
                    if (hLoginMobile) hLoginMobile.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        window.dispatchEvent(new CustomEvent('open-auth', { detail: 'login' }));
                    });
                }
            }

            try {
                const cached = sessionStorage.getItem('pendingCliente');
                if (token && !cached) {
                    apiClient.get('/clientes/me').then((p) => {
                        const prof = p?.data || p;
                        if (prof) {
                            try { sessionStorage.setItem('pendingCliente', JSON.stringify(prof)); } catch (e) { }
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
                                        try { sessionStorage.setItem('pendingCliente', JSON.stringify(prof2)); } catch (e) { }
                                        this._profile = prof2;
                                        this.render();
                                    }
                                } catch (e) {
                                }
                            }
                        } catch (e) { }
                    });
                }
            } catch (e) { }

            if (btnAgendar) {
                btnAgendar.addEventListener('click', (ev) => {
                    const token = apiClient.getToken();
                    if (!token) {
                        ev.preventDefault();
                        window.dispatchEvent(new CustomEvent('open-auth', { detail: 'login' }));
                    }
                });
            }
        } catch (e) {
            console.warn('[header] render error', e);
        }
    }
}

customElements.define('header-component', HeaderComponent);