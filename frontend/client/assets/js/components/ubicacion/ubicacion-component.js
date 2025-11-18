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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 class="page-title">Nuestra Ubicación</h1>
          <p class="page-sub">Visítanos en nuestro taller para recibir la mejor atención en servicios automotrices</p>
        </div>

        <div class="max-w-5xl mx-auto">
          <div class="info-card">
            <div class="mb-6 pb-6 border-b-2 border-gray-100">
              <div class="flex items-start">
                <div class="small-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="s-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-gray-800 mb-2">Dirección</h2>
                  <p class="text-gray-700 text-lg">República de Guatemala 720</p>
                  <p class="text-gray-600">Centro, Ciudad Obregón, Sonora</p>
                </div>
              </div>
            </div>
            <div class="rounded-xl overflow-hidden shadow-lg map-wrap">
              <iframe class="map-frame" src="https://www.google.com/maps?q=Rep%C3%BAblica+de+Guatemala+720+Ciudad+Obreg%C3%B3n&output=embed"></iframe>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div class="panel-blue">
              <div class="panel-head">
                <div class="panel-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="p-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 class="panel-title">Horario de Atención</h3>
              </div>
              <div class="panel-body">
                <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                <p>Sábados: 9:00 AM - 2:00 PM</p>
                <p>Domingos: Cerrado</p>
              </div>
            </div>

            <div class="panel-orange">
              <div class="panel-head">
                <div class="panel-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="p-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <h3 class="panel-title">Contacto Directo</h3>
              </div>
              <div class="panel-body">
                <p>Teléfono: (644) 123-4567</p>
                <p>WhatsApp: (644) 123-4567</p>
                <p>Email: contacto@autoservicios.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer-component></footer-component>
  </div>
`;

class UbicacionPage extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    const componentCss = `
      :host { display:block; }
      .page-hero-icon { width: 40px; height:40px; color:#1e40af; }
      .page-title { font-size:2rem; font-weight:700; color:#1f2937; margin-top:0.5rem; }
      .info-card { background:#fff; padding:1.5rem; border-radius:1rem; box-shadow:0 8px 24px rgba(15,23,42,0.06); }
      .small-icon { padding:0.25rem; border-radius:8px; background:#eff6ff; display:flex; align-items:center; justify-content:center; }
      .s-icon { width:18px; height:18px; color:#2563eb; }
      .map-frame { width:100%; height:380px; border:0; display:block; }

      .panel-blue { background: linear-gradient(135deg,#2563eb,#1e40af); color:#fff; padding:1.5rem; border-radius:1rem; }
      .panel-orange { background: linear-gradient(135deg,#fb923c,#fb7a00); color:#fff; padding:1.5rem; border-radius:1rem; }
      .panel-head { display:flex; align-items:center; margin-bottom:0.75rem; }
      .panel-icon { background: rgba(255,255,255,0.12); padding:0.5rem; border-radius:9999px; margin-right:0.75rem; }
      .p-icon { width:18px; height:18px; color:#fff; }

      svg { width:auto; height:auto; max-width:100%; max-height:2.25rem; }
    `;

    await injectStyles(this.root, componentCss);
    this.root.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('ubicacion-page', UbicacionPage);
export default UbicacionPage;
