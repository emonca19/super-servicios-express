export const adminSidebarTemplate = () => `

 <aside id="sidebar" class="sidebar">

  <div id="resize-handle"></div>

  <div class="logo-section">
    <a href="dashboard.html" class="nav-item logo-nav">
      <img src="./assets/images/icons/logo.svg" class="icon" />
      <div class="label-group">
        <span class="main">Auto Servicios Express</span>
        <span class="sub">Calidad y Rapidez Garantizada</span>
      </div>
    </a>
  </div>

  <nav class="nav-container">
    <ul class="nav-list">

      <li><a href="dashboard.html" class="nav-item">
        <img src="./assets/images/icons/dashboard.svg" class="icon" />
        <span class="label">Dashboard</span>
      </a></li>

      <li><a href="citas.html" class="nav-item">
        <img src="./assets/images/icons/citas.svg" class="icon" />
        <span class="label">Citas Pendientes</span>
      </a></li>

      <li><a href="clientes.html" class="nav-item">
        <img src="./assets/images/icons/clientes.svg" class="icon" />
        <span class="label">Clientes</span>
      </a></li>

      <li><a href="vehiculos.html" class="nav-item">
        <img src="./assets/images/icons/vehiculos.svg" class="icon" />
        <span class="label">Vehículos</span>
      </a></li>

      <li><a href="servicios.html" class="nav-item">
        <img src="./assets/images/icons/servicios.svg" class="icon" />
        <span class="label">Servicios</span>
      </a></li>

    </ul>
  </nav>

   <div class="footer">
    <a href="login.html" class="logout-wrapper">
      <img src="./assets/images/icons/logout.svg" class="logout-icon" />
    </a>
    <div class="footer-content">
      <p class="footer-text footer-name">Carlos Mendoza</p>
      <p class="footer-text footer-email">admin@autoservices.com</p>
      <a href="login.html" class="footer-text footer-logout-text">Logout</a>
    </div>
  </div>

</aside>

`;