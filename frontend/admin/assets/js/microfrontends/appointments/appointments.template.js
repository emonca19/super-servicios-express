export const appointmentsTemplate = (activeFilter = "all") => `
  <div class="appointments">

    <h1 class="title">Citas Pendientes</h1>
    <p class="subtitle">Todas las citas que requieren atención</p>

    <div class="filters">
      <button class="filter-pill ${activeFilter === "all" ? "active" : ""}" data-filter="all">
        Todas
      </button>

      <button class="filter-pill ${activeFilter === "today" ? "active" : ""}" data-filter="today">
        Hoy
      </button>

      <button class="filter-pill ${activeFilter === "week" ? "active" : ""}" data-filter="week">
        Esta Semana
      </button>

      <button class="filter-pill ${activeFilter === "overdue" ? "active" : ""}" data-filter="overdue">
        Atrasadas
      </button>
    </div>

    <admin-table id="tabla-appointments"></admin-table>

  </div>
`;
