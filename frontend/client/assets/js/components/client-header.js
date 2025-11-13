/**
 * Header Component - Framework-agnostic Web Component
 * Puede ser fácilmente migrado a React, Vue, Angular, etc.
 */

class ClientHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      <header class="header">
        <div class="container">
          <div class="header-content">
            <a href="index.html" class="logo">
              <img src="./assets/images/logo.png" alt="Auto Servicios Express" width="200" height="50">
              <span class="logo-text">
                <strong>Auto Servicios Express</strong>
                <small>Calidad y Rapidez Garantizada</small>
              </span>
            </a>

            <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu">
              <span class="menu-icon"></span>
            </button>

            <nav class="nav" id="main-nav">
              <ul class="nav-list">
                <li class="nav-item">
                  <a href="index.html" class="nav-link" data-page="inicio">Inicio</a>
                </li>
                <li class="nav-item">
                  <a href="servicios.html" class="nav-link" data-page="servicios">Servicios</a>
                </li>
                <li class="nav-item">
                  <a href="contacto.html" class="nav-link" data-page="contacto">Contacto</a>
                </li>
                <li class="nav-item">
                  <a href="ubicacion.html" class="nav-link" data-page="ubicacion">Ubicación</a>
                </li>
              </ul>

              <a href="agendar-cita.html" class="btn-cta">
                📅 Agendar Cita
              </a>
            </nav>
          </div>
        </div>
      </header>
    `;
  }

  attachEventListeners() {
    const menuToggle = this.shadowRoot.getElementById('menu-toggle');
    const mainNav = this.shadowRoot.getElementById('main-nav');

    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Cerrar menú al hacer click en un enlace (móvil)
    const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          mainNav.classList.remove('active');
          menuToggle.classList.remove('active');
        }
      });
    });

    // Highlight active page
    this.highlightActivePage();
  }

  highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }

  styles() {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      .header {
        background-color: #2c3e50;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 0;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        color: white;
      }

      .logo img {
        height: 40px;
        width: auto;
      }

      .logo-text {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
      }

      .logo-text strong {
        font-size: 1.125rem;
        font-weight: 700;
      }

      .logo-text small {
        font-size: 0.75rem;
        opacity: 0.9;
      }

      .menu-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
      }

      .menu-icon,
      .menu-icon::before,
      .menu-icon::after {
        display: block;
        width: 24px;
        height: 2px;
        background-color: white;
        transition: all 0.3s ease;
      }

      .menu-icon::before,
      .menu-icon::after {
        content: '';
        position: relative;
      }

      .menu-icon::before {
        top: -8px;
      }

      .menu-icon::after {
        top: 6px;
      }

      .menu-toggle.active .menu-icon {
        background-color: transparent;
      }

      .menu-toggle.active .menu-icon::before {
        top: 0;
        transform: rotate(45deg);
      }

      .menu-toggle.active .menu-icon::after {
        top: -2px;
        transform: rotate(-45deg);
      }

      .nav {
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      .nav-list {
        display: flex;
        align-items: center;
        gap: 2rem;
        list-style: none;
      }

      .nav-link {
        color: white;
        text-decoration: none;
        font-weight: 500;
        font-size: 1rem;
        position: relative;
        transition: color 0.3s ease;
      }

      .nav-link::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0;
        height: 2px;
        background-color: #ff6633;
        transition: width 0.3s ease;
      }

      .nav-link:hover,
      .nav-link.active {
        color: #ff6633;
      }

      .nav-link:hover::after,
      .nav-link.active::after {
        width: 100%;
      }

      .btn-cta {
        padding: 0.625rem 1.5rem;
        background-color: #ff6633;
        color: white;
        text-decoration: none;
        border-radius: 0.375rem;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .btn-cta:hover {
        background-color: #e54d1f;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 102, 51, 0.4);
      }

      @media (max-width: 768px) {
        .logo-text {
          display: none;
        }

        .menu-toggle {
          display: block;
        }

        .nav {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: #2c3e50;
          flex-direction: column;
          padding: 1.5rem;
          gap: 1rem;
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .nav.active {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .nav-list {
          flex-direction: column;
          width: 100%;
          gap: 1rem;
        }

        .nav-item {
          width: 100%;
        }

        .nav-link {
          display: block;
          padding: 0.75rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-cta {
          width: 100%;
          text-align: center;
          padding: 1rem;
        }
      }
    `;
  }
}

customElements.define('client-header', ClientHeader);
