class ClientFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const currentYear = new Date().getFullYear();
    
    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section">
              <h3 class="footer-title">Auto Servicios Express</h3>
              <p class="footer-description">
                Tu taller de confianza con más de 10 años de experiencia. 
                Calidad, rapidez y profesionalismo en cada servicio.
              </p>
            </div>

            <div class="footer-section">
              <h4 class="footer-subtitle">Contáctanos</h4>
              <ul class="contact-list">
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <a href="tel:644-xxx-xxxx">644-xxx-xxxx</a>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <a href="mailto:autoserviciosexpress@gmail.com">autoserviciosexpress@gmail.com</a>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>República de Guatemala 720, Centro, Urb. No. 2, 85000 Ciudad Obregón, Son. México</span>
                </li>
              </ul>
            </div>

            <div class="footer-section">
              <h4 class="footer-subtitle">Horario</h4>
              <ul class="schedule-list">
                <li>
                  <span class="day">Lun - Vie:</span>
                  <span class="time">8a.m. - 7p.m.</span>
                </li>
                <li>
                  <span class="day">Sábado:</span>
                  <span class="time">8a.m. - 2p.m.</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <p>&copy; ${currentYear} Auto Servicios Express. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    `;
  }

  styles() {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .footer {
        background-color: #1e293b;
        color: #e2e8f0;
        padding: 3rem 0 1rem;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .footer-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
      }

      .footer-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #ff6633;
        margin-bottom: 1rem;
      }

      .footer-subtitle {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1rem;
        color: white;
      }

      .footer-description {
        line-height: 1.6;
        color: #cbd5e0;
      }

      .contact-list,
      .schedule-list {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .contact-list li {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .contact-list svg {
        flex-shrink: 0;
        margin-top: 0.125rem;
        color: #ff6633;
      }

      .contact-list a {
        color: #cbd5e0;
        text-decoration: none;
        transition: color 0.3s ease;
      }

      .contact-list a:hover {
        color: #ff6633;
      }

      .schedule-list li {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .day {
        font-weight: 600;
      }

      .time {
        color: #cbd5e0;
      }

      .footer-bottom {
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
        color: #94a3b8;
        font-size: 0.875rem;
      }

      @media (max-width: 768px) {
        .footer-content {
          grid-template-columns: 1fr;
        }
      }
    `;
  }
}

customElements.define('client-footer', ClientFooter);
