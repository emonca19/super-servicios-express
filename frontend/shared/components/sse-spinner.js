/**
 * SSE Spinner - Loading spinner reutilizable
 */

class SSESpinner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['size', 'color'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const size = this.getAttribute('size') || 'medium';
    const color = this.getAttribute('color') || 'primary';

    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      <div class="spinner ${size} ${color}"></div>
    `;
  }

  styles() {
    return `
      .spinner {
        border-radius: 50%;
        border-style: solid;
        animation: spin 0.8s linear infinite;
      }

      .spinner.small {
        width: 16px;
        height: 16px;
        border-width: 2px;
      }

      .spinner.medium {
        width: 32px;
        height: 32px;
        border-width: 3px;
      }

      .spinner.large {
        width: 48px;
        height: 48px;
        border-width: 4px;
      }

      .spinner.primary {
        border-color: rgba(65, 105, 225, 0.2);
        border-top-color: #4169e1;
      }

      .spinner.white {
        border-color: rgba(255, 255, 255, 0.2);
        border-top-color: white;
      }

      .spinner.secondary {
        border-color: rgba(255, 102, 51, 0.2);
        border-top-color: #ff6633;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
  }
}

customElements.define('sse-spinner', SSESpinner);
export { SSESpinner };
