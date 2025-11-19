import { injectStyles } from '../../utils/shadow-style-loader.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="page-root">
    <header-component></header-component>
    <main class="py-16 min-h-screen">
      <section class="container mx-auto px-6">
        <div class="text-center mb-12">
          <div class="inline-block icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" class="page-hero-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 class="page-title">Contáctanos</h1>
          <p class="page-sub">¿Tienes preguntas o necesitas una cotización? Estamos aquí para ayudarte.</p>
        </div>

        <div class="max-w-3xl mx-auto">
          <div class="form-card">
            <form id="contact-form" class="space-y-6">
              <div>
                <label for="contact-nombre" class="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo *</label>
                <input id="contact-nombre" required autocomplete="name" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" name="nombre" placeholder="Tu nombre completo" />
              </div>
              <div>
                <label for="contact-email" class="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico *</label>
                <input id="contact-email" required type="email" autocomplete="email" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" name="email" placeholder="tu@email.com" />
              </div>
              <div>
                <label for="contact-telefono" class="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                <input id="contact-telefono" type="tel" autocomplete="tel" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" name="telefono" placeholder="(644) 123-4567" />
              </div>
              <div>
                <label for="contact-mensaje" class="block text-sm font-semibold text-gray-700 mb-2">Mensaje *</label>
                <textarea id="contact-mensaje" required autocomplete="off" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none" rows="6" name="mensaje" placeholder="Cuéntanos en qué podemos ayudarte..."></textarea>
              </div>
              <div class="flex justify-end pt-4">
                <button type="submit" class="btn-submit">Enviar Mensaje</button>
              </div>
            </form>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 contact-cards">
            <div class="contact-card">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="c-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <h3 class="contact-title">Teléfono</h3>
              <p class="contact-text">(644) 123-4567</p>
            </div>

            <div class="contact-card">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="c-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"/></svg>
              </div>
              <h3 class="contact-title">Email</h3>
              <p class="contact-text">contacto@autoservicios.com</p>
            </div>

            <div class="contact-card">
              <div class="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="c-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <h3 class="contact-title">Horario</h3>
              <p class="contact-text">Lun - Vie: 8AM - 6PM</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer-component></footer-component>
  </div>
`;

class ContactPage extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const componentCss = `
      /* Scoped component styles */
      :host { display: block; }
      .page-root { background: var(--page-bg, #f8fafc); }
      .page-hero-icon { width: 40px; height: 40px; color: #1e40af; }
      .page-title { font-size: 2rem; font-weight: 700; color: #1f2937; margin-top: 0.5rem; }
      .page-sub { color: #4b5563; max-width: 42rem; margin: 0 auto; }

      .form-card { background: #fff; padding: 2rem; border-radius: 1rem; box-shadow: 0 8px 24px rgba(15,23,42,0.06); }
      .contact-cards { margin-top: 1.5rem; }
      .contact-card { background: #fff; padding: 1.25rem; border-radius: 0.75rem; text-align: center; box-shadow: 0 6px 18px rgba(15,23,42,0.04); }
      .contact-icon { display:flex; align-items:center; justify-content:center; margin-bottom:0.5rem; }
      .c-icon { width: 20px; height: 20px; color: #2563eb; }
      .contact-title { font-weight:700; color:#1f2937; margin-bottom:0.25rem; }
      .contact-text { color:#4b5563; font-size:0.9rem; }

      /* Ensure SVGs inside component don't get oversized by global rules */
      svg { width: auto; height: auto; max-width: 100%; max-height: 3rem; }

      /* buttons */
      .btn-submit { padding: 0.75rem 2rem; background:#1e40af; color:#fff; border-radius:0.5rem; font-weight:700; border:none; }
    `;

    await injectStyles(this.root, componentCss);
    this.root.appendChild(template.content.cloneNode(true));

    const form = this.root.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        alert('Gracias por contactarnos. Respondemos pronto.');
        form.reset();
      });
    }
  }
}

customElements.define('contact-page', ContactPage);
export default ContactPage;
