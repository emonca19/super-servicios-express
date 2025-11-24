export const adminSidebarTemplate = () => `
<aside id="sidebar" class="sidebar">

  <div id="resize-handle"></div>

  <div class="logo-section">
    <div class="logo-box"></div>
    <div class="logo-text">
      <h1 class="title">Auto Servicios Express</h1>
      <p class="subtitle">Calidad y Rapidez Garantizada</p>
    </div>
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
    <img src="./assets/images/icons/logout.svg" class="logout-icon" />
    <p class="label">Carlos Mendoza</p>
    <p class="label">admin@autoservices.com</p>
    <a href="#" class="label">Logout</a>
  </div>

</aside>
`;
