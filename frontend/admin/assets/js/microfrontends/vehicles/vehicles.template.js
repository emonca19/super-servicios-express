export const vehiclesTemplate = () => `
  <div class="vehicles">

    <h1 class="title">Gestionar Vehículos</h1>
    <p class="subtitle">Todos los vehículos registrados en el sistema</p>

    <div class="top-bar">
      <admin-search placeholder="Buscar vehículo por placas, marca o modelo…" id="search"></admin-search>

      <button class="new-vehicle-btn" id="newVehicleBtn">
        + Nuevo Vehículo
      </button>
    </div>

    <admin-table id="vehiclesTable"></admin-table>

  </div>
`;