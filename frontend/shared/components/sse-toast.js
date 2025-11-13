/**
 * SSE Toast - Notificaciones toast
 */

class SSEToast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['message', 'type', 'duration'];
  }

  connectedCallback() {
    this.render();
    this.startTimer();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  startTimer() {
    const duration = parseInt(this.getAttribute('duration') || '3000');
    
    if (duration > 0) {
      setTimeout(() => {
        this.close();
      }, duration);
    }
  }

  close() {
    this.classList.add('closing');
    setTimeout(() => {
      this.remove();
    }, 300);
  }

  render() {
    const message = this.getAttribute('message') || '';
    const type = this.getAttribute('type') || 'info';

    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      <div class="toast ${type}">
        <div class="toast-icon">
          ${this.getIcon(type)}
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" id="close-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;

    const closeBtn = this.shadowRoot.getElementById('close-btn');
    closeBtn.addEventListener('click', () => this.close());
  }

  getIcon(type) {
    const icons = {
      success: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>`,
      error: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>`,
      warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>`,
      info: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>`,
    };
    return icons[type] || icons.info;
  }

  styles() {
    return `
      :host {
        display: block;
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
        animation: slideIn 0.3s ease;
      }

      :host(.closing) {
        animation: slideOut 0.3s ease;
      }

      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }

      .toast {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
                    0 4px 6px -2px rgba(0, 0, 0, 0.05);
        min-width: 300px;
        max-width: 400px;
      }

      .toast.success {
        border-left: 4px solid #10b981;
      }

      .toast.error {
        border-left: 4px solid #ef4444;
      }

      .toast.warning {
        border-left: 4px solid #f59e0b;
      }

      .toast.info {
        border-left: 4px solid #3b82f6;
      }

      .toast-icon {
        flex-shrink: 0;
      }

      .toast.success .toast-icon {
        color: #10b981;
      }

      .toast.error .toast-icon {
        color: #ef4444;
      }

      .toast.warning .toast-icon {
        color: #f59e0b;
      }

      .toast.info .toast-icon {
        color: #3b82f6;
      }

      .toast-message {
        flex: 1;
        font-size: 0.875rem;
        color: #1e293b;
      }

      .toast-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 0.25rem;
        color: #64748b;
        transition: all 0.2s;
      }

      .toast-close:hover {
        background-color: #f1f5f9;
        color: #1e293b;
      }

      @media (max-width: 640px) {
        :host {
          top: 0.5rem;
          right: 0.5rem;
          left: 0.5rem;
        }

        .toast {
          width: 100%;
          max-width: none;
        }
      }
    `;
  }
}

customElements.define('sse-toast', SSEToast);

// Helper para mostrar toasts fácilmente
export class ToastService {
  static show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('sse-toast');
    toast.setAttribute('message', message);
    toast.setAttribute('type', type);
    toast.setAttribute('duration', duration);
    document.body.appendChild(toast);
    return toast;
  }

  static success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  }

  static error(message, duration = 4000) {
    return this.show(message, 'error', duration);
  }

  static warning(message, duration = 3000) {
    return this.show(message, 'warning', duration);
  }

  static info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }
}

export { SSEToast };
