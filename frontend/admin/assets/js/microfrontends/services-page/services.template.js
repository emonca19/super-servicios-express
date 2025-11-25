// Template de la pagina de servicios
// Regresa el HTML que se mostrara dentro del componente services-page
export const servicesTemplate = () => `
  <div class="services">

    <!-- Titulo principal -->
    <h1 class="title">Gestionar Servicios</h1>

    <!-- Subtitulo descriptivo -->
    <p class="subtitle">Servicios ofrecidos por el taller</p>

    <!-- Barra superior con buscador y boton para crear servicio -->
    <div class="top-bar">
      <admin-search placeholder="Buscar servicio..." id="search"></admin-search>

      <button class="new-service-btn" id="newServiceBtn">
        + Nuevo Servicio
      </button>
    </div>

    <!-- Tabla donde se mostraran los servicios -->
    <admin-table id="servicesTable"></admin-table>

  </div>
`;
