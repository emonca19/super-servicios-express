/**
 * SSE Button - Botón reutilizable con variantes
 * Framework-agnostic Web Component
 */

class SSEButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['variant', 'size', 'disabled', 'loading', 'icon'];
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  get variant() {
    return this.getAttribute('variant') || 'primary';
  }

  get size() {
    return this.getAttribute('size') || 'medium';
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  get loading() {
    return this.hasAttribute('loading');
  }

  get icon() {
    return this.getAttribute('icon');
  }

  render() {
    const isDisabled = this.disabled || this.loading;

    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      <button 
        class="sse-button ${this.variant} ${this.size}"
        ${isDisabled ? 'disabled' : ''}
        type="${this.getAttribute('type') || 'button'}">
        ${this.loading ? this.renderSpinner() : ''}
        ${this.icon && !this.loading ? this.renderIcon() : ''}
        <span class="button-text">
          <slot></slot>
        </span>
      </button>
    `;
  }

  renderSpinner() {
    return `<span class="spinner"></span>`;
  }

  renderIcon() {
    return `<span class="button-icon">${this.icon}</span>`;
  }

  attachEventListeners() {
    const button = this.shadowRoot.querySelector('button');
    button.addEventListener('click', (e) => {
      if (!this.disabled && !this.loading) {
        this.dispatchEvent(new CustomEvent('sse-click', {
          bubbles: true,
          composed: true,
          detail: { originalEvent: e }
        }));
      }
    });
  }

  styles() {
    return `
      :host {
        display: inline-block;
      }

      .sse-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        border: none;
        border-radius: 0.375rem;
        font-family: inherit;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      /* Variantes */
      .sse-button.primary {
        background-color: #4169e1;
        color: white;
      }

      .sse-button.primary:hover:not(:disabled) {
        background-color: #2c54c7;
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(65, 105, 225, 0.3);
      }

      .sse-button.secondary {
        background-color: #ff6633;
        color: white;
      }

      .sse-button.secondary:hover:not(:disabled) {
        background-color: #e54d1f;
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(255, 102, 51, 0.3);
      }

      .sse-button.success {
        background-color: #10b981;
        color: white;
      }

      .sse-button.success:hover:not(:disabled) {
        background-color: #059669;
      }

      .sse-button.danger {
        background-color: #ef4444;
        color: white;
      }

      .sse-button.danger:hover:not(:disabled) {
        background-color: #dc2626;
      }

      .sse-button.outline {
        background-color: transparent;
        border: 2px solid #4169e1;
        color: #4169e1;
      }

      .sse-button.outline:hover:not(:disabled) {
        background-color: #4169e1;
        color: white;
      }

      .sse-button.ghost {
        background-color: transparent;
        color: #4a5568;
      }

      .sse-button.ghost:hover:not(:disabled) {
        background-color: #f1f5f9;
      }

      /* Tamaños */
      .sse-button.small {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }

      .sse-button.medium {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      }

      .sse-button.large {
        padding: 1rem 2rem;
        font-size: 1.125rem;
      }

      /* Estados */
      .sse-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
      }

      .sse-button:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(65, 105, 225, 0.2);
      }

      /* Spinner */
      .spinner {
        width: 1em;
        height: 1em;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .button-icon {
        display: flex;
        align-items: center;
      }

      .button-text {
        display: flex;
        align-items: center;
      }
    `;
  }
}

customElements.define('sse-button', SSEButton);
export { SSEButton };
