import apiClient from '../../../services/api-client.js';

export class LoginForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; }
                .form-container { max-width: 360px; margin: 0 auto; }
                .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
                h3 { font-size: 1.125rem; font-weight: 600; color: #111827; margin: 0; }
                p { font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem; margin-bottom: 0; }
                .status { margin-bottom: 1rem; font-size: 0.875rem; }
                .status.error { color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; padding: 0.5rem; border-radius: 0.5rem; }
                .status.success { color: #16a34a; }
                .status.loading { color: #4b5563; }
                
                form { display: flex; flex-direction: column; gap: 1rem; }
                label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.375rem; }
                input { 
                    width: 100%; padding: 0.75rem 1rem; font-size: 0.875rem; 
                    border: 1px solid #d1d5db; border-radius: 0.5rem; 
                    box-sizing: border-box; transition: all 0.2s;
                }
                input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
                
                button[type="submit"] {
                    width: 100%; padding: 0.75rem 1rem; background: #0f172a; color: white;
                    border: none; border-radius: 0.5rem; font-weight: 700; cursor: pointer;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: background 0.2s;
                }
                button[type="submit"]:hover { background: #1e293b; }
                
                .footer { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #f3f4f6; text-align: center; font-size: 0.875rem; }
                .link-btn { background: none; border: none; color: #2563eb; font-weight: 500; cursor: pointer; padding: 0; }
                .link-btn:hover { text-decoration: underline; color: #1d4ed8; }
                .forgot-password { font-size: 0.875rem; color: #2563eb; text-decoration: none; }
                .forgot-password:hover { text-decoration: underline; }
                .flex-between { display: flex; justify-content: space-between; align-items: center; }
            </style>

            <div class="form-container">
                <div class="header">
                    <div>
                        <h3>Iniciar sesión</h3>
                        <p>Accede con tu correo y contraseña</p>
                    </div>
                </div>

                <div id="status" class="status"></div>

                <form id="login-form">
                    <div>
                        <label for="email">Email</label>
                        <input id="email" name="email" type="email" autocomplete="email" required placeholder="tu@email.com" />
                    </div>
                    <div>
                        <label for="password">Contraseña</label>
                        <input id="password" name="password" type="password" autocomplete="current-password" required placeholder="••••••••" />
                    </div>
                    <div class="flex-between">
                        <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
                    </div>
                    <button type="submit">Ingresar</button>
                </form>

                <div class="footer">
                    <button type="button" id="switch-register" class="link-btn">
                        ¿No tienes cuenta? <span>Regístrate</span>
                    </button>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById('login-form').addEventListener('submit', this.handleLogin.bind(this));
        this.shadowRoot.getElementById('switch-register').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('switch-to-register', { bubbles: true, composed: true }));
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const statusEl = this.shadowRoot.getElementById('status');

        try {
            statusEl.textContent = 'Iniciando sesión...';
            statusEl.className = 'status loading';

            const res = await apiClient.post('/auth/login', data);
            const token = res?.data?.token || res?.token || (res && res.token);

            if (!token) throw new Error('Token no recibido');

            localStorage.setItem('token', token);
            
            let profile = null;
            try {
                const p = await apiClient.get('/clientes/me');
                profile = p?.data || p;
                if (profile) {
                    sessionStorage.setItem('pendingCliente', JSON.stringify(profile));
                }
            } catch (err) {
                console.warn('Error fetching profile:', err);
            }

            statusEl.textContent = 'Inicio de sesión exitoso';
            statusEl.className = 'status success';

            window.dispatchEvent(new CustomEvent('user-logged-in', { detail: { cliente: profile } }));
            this.dispatchEvent(new CustomEvent('login-success', { bubbles: true, composed: true }));

        } catch (error) {
            console.error('Login error:', error);
            const message = error?.body?.message || error?.message || 'Error al iniciar sesión';
            statusEl.innerHTML = `<strong>Error:</strong> ${message}`;
            statusEl.className = 'status error';
        }
    }
}

customElements.define('login-form', LoginForm);
