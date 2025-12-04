import './components/login-form.js';
import './components/register-form.js';

export class AuthModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isOpen = false;
        this.mode = 'login';
    }

    connectedCallback() {
        this.render();
        this.setupGlobalListeners();
    }

    disconnectedCallback() {
        this.removeGlobalListeners();
    }

    setupGlobalListeners() {
        this._openAuthHandler = (ev) => {
            const detail = ev.detail;
            this.mode = (detail === 'register' || (detail && detail.mode === 'register')) ? 'register' : 'login';
            this.open();
        };
        window.addEventListener('open-auth', this._openAuthHandler);

        this._closeAuthHandler = () => this.close();
        window.addEventListener('close-auth', this._closeAuthHandler);

        this.shadowRoot.addEventListener('login-success', () => this.close());
        this.shadowRoot.addEventListener('register-success', () => this.close());

        this.shadowRoot.addEventListener('switch-to-register', () => {
            this.mode = 'register';
            this.renderContent();
        });
        this.shadowRoot.addEventListener('switch-to-login', () => {
            this.mode = 'login';
            this.renderContent();
        });
    }

    removeGlobalListeners() {
        if (this._openAuthHandler) window.removeEventListener('open-auth', this._openAuthHandler);
        if (this._closeAuthHandler) window.removeEventListener('close-auth', this._closeAuthHandler);
    }

    open() {
        this.isOpen = true;
        this.style.display = 'block';
        this.renderContent();

        requestAnimationFrame(() => {
            const overlay = this.shadowRoot.querySelector('.overlay');
            const card = this.shadowRoot.querySelector('.modal-card');
            if (overlay) overlay.classList.add('active');
            if (card) card.classList.add('active');
        });
    }

    close() {
        this.isOpen = false;
        const overlay = this.shadowRoot.querySelector('.overlay');
        const card = this.shadowRoot.querySelector('.modal-card');

        if (overlay) overlay.classList.remove('active');
        if (card) card.classList.remove('active');

        setTimeout(() => {
            if (!this.isOpen) this.style.display = 'none';
        }, 300); 
    }

    render() {
        this.style.display = 'none';
        this.style.position = 'fixed';
        this.style.zIndex = '9999';
        this.style.inset = '0';

        this.shadowRoot.innerHTML = `
            <style>
                .overlay {
                    position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(4px); opacity: 0; transition: opacity 0.3s;
                    display: flex; align-items: center; justify-content: center;
                    padding: 1rem;
                }
                .overlay.active { opacity: 1; }
                
                .modal-card {
                    background: white; width: 100%; max-width: 440px;
                    border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    padding: 2rem; position: relative;
                    transform: scale(0.95); opacity: 0; transition: all 0.3s;
                    max-height: 90vh; overflow-y: auto;
                }
                .modal-card.active { transform: scale(1); opacity: 1; }
                
                .close-btn {
                    position: absolute; top: 1rem; right: 1rem;
                    background: none; border: none; cursor: pointer;
                    color: #9ca3af; padding: 0.5rem; border-radius: 50%;
                    transition: all 0.2s;
                }
                .close-btn:hover { color: #111827; background: #f3f4f6; }
            </style>
            
            <div class="overlay" id="overlay">
                <div class="modal-card">
                    <button class="close-btn" id="close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <div id="content"></div>
                </div>
            </div>
        `;

        this.shadowRoot.getElementById('overlay').addEventListener('click', (e) => {
            if (e.target.id === 'overlay') this.close();
        });
        this.shadowRoot.getElementById('close-btn').addEventListener('click', () => this.close());
    }

    renderContent() {
        const content = this.shadowRoot.getElementById('content');
        if (!content) return;

        content.innerHTML = '';
        const el = this.mode === 'register' ? document.createElement('register-form') : document.createElement('login-form');
        content.appendChild(el);
    }
}

customElements.define('auth-modal', AuthModal);
