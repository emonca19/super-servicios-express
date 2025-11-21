import { injectStyles } from '../../utils/shadow-style-loader.js';

const template = document.createElement('template');
template.innerHTML = `
  <div class="page-root">
    <header-component></header-component>
    
    <main class="main-content">
      <section class="container">
        
        <div class="hero-header">
          <div class="hero-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" class="hero-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 class="page-title">Encuéntranos</h1>
          <p class="page-subtitle">Tu automóvil merece la mejor atención. Visítanos hoy mismo.</p>
        </div>

        <div class="content-grid">
          
          <div class="info-column">
            
            <div class="card address-card">
              <div class="card-header">
                <div class="icon-box gray">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 class="card-title">Nuestra Ubicación</h2>
                  <p class="card-text highlight">República de Guatemala 720</p>
                  <p class="card-text">Colonia Centro, CP 85000</p>
                  <p class="card-text">Ciudad Obregón, Sonora</p>
                </div>
              </div>
            </div>

            <div class="sub-grid">
              
              <div class="card panel-blue">
                <div class="panel-content">
                  <div class="panel-icon-bg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="panel-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 class="panel-heading">Horarios</h3>
                  <ul class="panel-list">
                    <li><span>Lunes - Viernes</span> <strong>8:00 - 6:00 PM</strong></li>
                    <li><span>Sábados</span> <strong>9:00 - 2:00 PM</strong></li>
                    <li><span>Domingos</span> <span style="opacity:0.8">Cerrado</span></li>
                  </ul>
                </div>
              </div>

              <div class="card panel-orange">
                <div class="panel-content">
                  <div class="panel-icon-bg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="panel-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 class="panel-heading">Contáctanos</h3>
                  <div class="contact-links">
                    <a href="tel:+526441234567" class="contact-item">(644) 123-4567</a>
                    <a href="mailto:contacto@autos.com" class="contact-item">contacto@autos.com</a>
                    <span class="contact-item">WhatsApp Disponible</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="map-column">
            <div class="map-wrapper">
              <iframe 
                class="map-frame" 
                src="https://maps.google.com/maps?q=Republica+de+Guatemala+720,+Ciudad+Obregon,+Sonora&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                allowfullscreen="" 
                loading="lazy">
              </iframe>
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
      :host { display: block; font-family: system-ui, -apple-system, sans-serif; background-color: #f8fafc; }
      
      .main-content { padding: 3rem 1rem; min-height: 80vh; }
      .container { max-width: 1100px; margin: 0 auto; }

      .hero-header { text-align: center; margin-bottom: 3rem; }
      .hero-icon-wrapper { 
        display: inline-flex; 
        padding: 1rem; 
        background: #eff6ff; 
        border-radius: 50%; 
        margin-bottom: 1rem; 
        box-shadow: 0 0 0 8px #f8fafc;
      }
      .hero-icon { width: 40px; height: 40px; color: #2563eb; }
      .page-title { font-size: 2.25rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.025em; }
      .page-subtitle { font-size: 1.1rem; color: #64748b; margin-top: 0.5rem; max-width: 600px; margin-left: auto; margin-right: auto; }

      .content-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      @media (min-width: 900px) {
        .content-grid {
          grid-template-columns: 380px 1fr; /* Columna izquierda fija, mapa flexible */
          align-items: stretch;
        }
      }

      .card {
        background: white;
        border-radius: 1rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        overflow: hidden;
        transition: transform 0.2s ease;
      }
      
      .info-column { display: flex; flex-direction: column; gap: 1.5rem; }

      .address-card { padding: 1.5rem; border: 1px solid #e2e8f0; }
      .card-header { display: flex; gap: 1rem; align-items: flex-start; }
      .icon-box { 
        width: 48px; height: 48px; 
        background: #f1f5f9; 
        border-radius: 12px; 
        display: flex; align-items: center; justify-content: center; 
        flex-shrink: 0; 
      }
      .icon { width: 24px; height: 24px; color: #475569; }
      .card-title { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem 0; }
      .card-text { margin: 0; color: #64748b; font-size: 0.95rem; line-height: 1.5; }
      .card-text.highlight { color: #0f172a; font-weight: 600; font-size: 1rem; }

      .sub-grid { display: flex; flex-direction: column; gap: 1rem; }

      .panel-blue { background: linear-gradient(145deg, #3b82f6, #2563eb); color: white; border: none; }
      .panel-orange { background: linear-gradient(145deg, #f97316, #ea580c); color: white; border: none; }
      
      .panel-content { padding: 1.5rem; position: relative; overflow: hidden; }
      .panel-icon-bg {
        position: absolute;
        top: -10px; right: -10px;
        width: 80px; height: 80px;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
      }
      .panel-svg { width: 40px; height: 40px; color: rgba(255,255,255,0.3); }
      
      .panel-heading { font-size: 1.25rem; font-weight: 700; margin: 0 0 1rem 0; position: relative; z-index: 1; }
      
      .panel-list { list-style: none; padding: 0; margin: 0; font-size: 0.9rem; position: relative; z-index: 1; }
      .panel-list li { display: flex; justify-content: space-between; margin-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 0.25rem; }
      .panel-list li:last-child { border-bottom: none; }

      .contact-links { display: flex; flex-direction: column; gap: 0.5rem; position: relative; z-index: 1; }
      .contact-item { color: white; text-decoration: none; font-weight: 500; opacity: 0.95; font-size: 0.95rem; display: block; }
      .contact-item:hover { opacity: 1; text-decoration: underline; }

      .map-column { display: flex; flex-direction: column; }
      .map-wrapper { 
        flex: 1; 
        min-height: 400px; 
        height: 100%; 
        border-radius: 1rem; 
        overflow: hidden; 
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        border: 4px solid white;
      }
      .map-frame { width: 100%; height: 100%; min-height: 400px; border: 0; display: block; }

      @media (max-width: 768px) {
        .page-title { font-size: 1.75rem; }
        .map-wrapper { min-height: 300px; }
      }
    `;

    await injectStyles(this.root, componentCss);
    this.root.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('ubicacion-page', UbicacionPage);
export default UbicacionPage;