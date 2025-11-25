export const clientsTemplate = (rows = []) => `
  <div class="clients">
    <h1 class="title">Gestionar Clientes</h1>
    <p class="subtitle">Lista de todos los clientes registrados</p>

    <div class="top-bar">
      <admin-search placeholder="Buscar cliente..." id="search"></admin-search>
      <button class="new-client-btn" id="newClientBtn">
        + Nuevo Cliente
      </button>
    </div>

    <admin-table id="clientsTable"></admin-table>
  </div>
`;