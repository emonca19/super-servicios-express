import '../../../components/appointment-form/index.js';
import { appointmentShellTemplate } from './appointment-shell.template.js';
import { appointmentShellStyles } from './appointment-shell.styles.js';
import { injectStyles } from '../../../utils/shadow-style-loader.js';

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

    this.root.innerHTML = '';
    await injectStyles(this.root, appointmentShellStyles);
    this.root.appendChild(templateCache.content.cloneNode(true));
  }
}

customElements.define('appointment-shell', AppointmentShell);

export default AppointmentShell;
export { AppointmentShell };
