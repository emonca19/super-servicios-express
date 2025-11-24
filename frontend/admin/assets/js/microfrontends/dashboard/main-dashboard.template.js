export const dashboardTemplate = () => `
  <div class="dashboard">

    <h1 class="title">Dashboard</h1>

    <section class="kpi-grid">

      <div class="kpi-card orange">
        <div class="kpi-label">Citas Hoy</div>
        <div class="kpi-value" id="kpi-citas"></div>
        <div class="kpi-sub" id="kpi-citas-delta"></div>
      </div>

      <div class="kpi-card green">
        <div class="kpi-label">Ingresos Hoy</div>
        <div class="kpi-value" id="kpi-ingresos"></div>
        <div class="kpi-sub" id="kpi-ingresos-delta"></div>
      </div>

      <div class="kpi-card blue">
        <div class="kpi-label">Clientes Nuevos</div>
        <div class="kpi-value" id="kpi-clientes"></div>
        <div class="kpi-sub">Esta semana</div>
      </div>

      <div class="kpi-card yellow">
        <div class="kpi-label">Ocupación</div>
        <div class="kpi-value" id="kpi-ocupacion"></div>
        <div class="kpi-sub">Capacidad actual</div>
      </div>

    </section>

    <section class="citas-section">
      <h2 class="section-title">Citas Programadas Hoy</h2>
      <p class="section-sub">Gestiona las citas del día</p>

      <!-- Aquí se insertará el admin-table -->
      <admin-table id="tabla-citas"></admin-table>

    </section>

  </div>
`;
