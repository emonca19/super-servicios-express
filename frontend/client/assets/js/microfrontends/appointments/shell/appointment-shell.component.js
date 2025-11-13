import '../../../components/appointment-form/index.js';
import { appointmentShellTemplate } from './appointment-shell.template.js';
import { appointmentShellStyles } from './appointment-shell.styles.js';

const templateCache = document.createElement('template');

class AppointmentShell extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    if (!templateCache.innerHTML) {
      templateCache.innerHTML = `
        <style>${appointmentShellStyles}</style>
        ${appointmentShellTemplate()}
      `;
    }

    this.innerHTML = '';
    this.appendChild(templateCache.content.cloneNode(true));
  }
}

customElements.define('appointment-shell', AppointmentShell);

export default AppointmentShell;
export { AppointmentShell };
