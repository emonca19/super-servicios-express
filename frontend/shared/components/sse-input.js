/**
 * SSE Input - Input reutilizable con validación
 */

class SSEInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['label', 'type', 'placeholder', 'value', 'error', 'required', 'disabled'];
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

  get value() {
    const input = this.shadowRoot.querySelector('input');
    return input ? input.value : '';
  }

  set value(val) {
    const input = this.shadowRoot.querySelector('input');
    if (input) {
      input.value = val;
    }
  }

  render() {
    const label = this.getAttribute('label') || '';
    const type = this.getAttribute('type') || 'text';
    const placeholder = this.getAttribute('placeholder') || '';
    const value = this.getAttribute('value') || '';
    const error = this.getAttribute('error') || '';
    const required = this.hasAttribute('required');
    const disabled = this.hasAttribute('disabled');

    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      <div class="input-wrapper">
        ${label ? `
          <label class="input-label">
            ${label}
            ${required ? '<span class="required">*</span>' : ''}
          </label>
        ` : ''}
        
        <input
          type="${type}"
          class="input-field ${error ? 'error' : ''}"
          placeholder="${placeholder}"
          value="${value}"
          ${required ? 'required' : ''}
          ${disabled ? 'disabled' : ''}>
        
        ${error ? `<span class="error-message">${error}</span>` : ''}
      </div>
    `;
  }

  attachEventListeners() {
    const input = this.shadowRoot.querySelector('input');
    
    input.addEventListener('input', (e) => {
      this.dispatchEvent(new CustomEvent('sse-input', {
        bubbles: true,
        composed: true,
        detail: { value: e.target.value }
      }));
    });

    input.addEventListener('change', (e) => {
      this.dispatchEvent(new CustomEvent('sse-change', {
        bubbles: true,
        composed: true,
        detail: { value: e.target.value }
      }));
    });

    input.addEventListener('blur', (e) => {
      this.dispatchEvent(new CustomEvent('sse-blur', {
        bubbles: true,
        composed: true,
        detail: { value: e.target.value }
      }));
    });
  }

  styles() {
    return `
      .input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .input-label {
        font-weight: 600;
        font-size: 0.875rem;
        color: #4a5568;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .required {
        color: #ef4444;
      }

      .input-field {
        padding: 0.75rem 1rem;
        border: 2px solid #cbd5e0;
        border-radius: 0.375rem;
        font-size: 1rem;
        font-family: inherit;
        color: #2d3748;
        transition: all 0.2s ease;
        width: 100%;
      }

      .input-field:focus {
        outline: none;
        border-color: #4169e1;
        box-shadow: 0 0 0 3px rgba(65, 105, 225, 0.1);
      }

      .input-field.error {
        border-color: #ef4444;
      }

      .input-field.error:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }

      .input-field:disabled {
        background-color: #f1f5f9;
        cursor: not-allowed;
        opacity: 0.6;
      }

      .error-message {
        font-size: 0.75rem;
        color: #ef4444;
      }
    `;
  }
}

customElements.define('sse-input', SSEInput);
export { SSEInput };
