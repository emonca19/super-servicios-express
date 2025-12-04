// assets/js/microfrontends/users/main-clients.template.js
export const clientsTemplate = () => `
  <div class="clients">
    <h1 class="title">Gestionar Clientes</h1>
    <p class="subtitle">Lista de todos los clientes registrados</p>

    <div class="top-bar">
      <admin-search
        placeholder="Buscar por nombre, correo o teléfono..."
        id="search"
      ></admin-search>

      <button class="new-client-btn" id="newClientBtn">
        + Nuevo Cliente
      </button>
    </div>

    <admin-table id="clientsTable"></admin-table>
  </div>

  <!-- Modal para NUEVO / EDITAR cliente -->
  <div id="clientModal" class="modal-backdrop">
    <div class="modal-card">

      <!-- Header del modal -->
      <div class="modal-header">
        <h3 id="modalTitle" class="modal-title">
          Nuevo Cliente
        </h3>
        <button
          id="closeModalBtn"
          class="modal-close"
          type="button"
        >
          <svg class="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Formulario CREATE / EDIT -->
      <form id="clientForm" class="modal-body">
        <input type="hidden" id="clientId" name="id">

        <div class="field">
          <label class="field-label">
            Nombre completo
          </label>
          <input
            type="text"
            name="nombre"
            id="clientNombre"
            required
            class="field-input"
          />
        </div>

        <div class="field">
          <label class="field-label">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            id="clientEmail"
            required
            class="field-input"
          />
        </div>

        <div class="field">
          <label class="field-label">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefono"
            id="clientTelefono"
            class="field-input"
          />
        </div>

        <div class="field">
          <label class="field-label">
            Dirección
          </label>
          <textarea
            name="direccion"
            id="clientDireccion"
            rows="2"
            class="field-input field-textarea"
          ></textarea>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            id="cancelBtn"
            class="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            id="saveBtn"
            class="btn-primary"
          >
            <span id="saveBtnText">Guardar cliente</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal VER DETALLES (solo lectura) -->
  <div id="viewModal" class="modal-backdrop">
    <div class="modal-card modal-card--small">
      <div class="modal-header">
        <h3 class="modal-title">Detalles del cliente</h3>
        <button
          id="closeViewBtn"
          class="modal-close"
          type="button"
        >
          <svg class="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="field">
          <label class="field-label">Nombre completo</label>
          <input
            id="viewNombre"
            type="text"
            class="field-input"
            readonly
          />
        </div>

        <div class="field">
          <label class="field-label">Correo electrónico</label>
          <input
            id="viewEmail"
            type="email"
            class="field-input"
            readonly
          />
        </div>

        <div class="field">
          <label class="field-label">Teléfono</label>
          <input
            id="viewTelefono"
            type="tel"
            class="field-input"
            readonly
          />
        </div>

        <div class="field">
          <label class="field-label">Dirección</label>
          <textarea
            id="viewDireccion"
            rows="2"
            class="field-input field-textarea"
            readonly
          ></textarea>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            id="okViewBtn"
            class="btn-primary"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal ELIMINAR (confirmación) -->
  <div id="deleteModal" class="modal-backdrop modal-backdrop--danger">
    <div class="modal-card modal-card--small modal-card--danger">
      <div class="modal-header modal-header--danger">
        <div class="modal-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2"></circle>
            <path d="M12 7v7" stroke-width="2" stroke-linecap="round"></path>
            <path d="M12 16h.01" stroke-width="2" stroke-linecap="round"></path>
          </svg>
        </div>
        <div>
          <h3 class="modal-title modal-title--danger">Eliminar cliente</h3>
          <p class="modal-subtitle">
            Esta acción no se puede deshacer.
          </p>
        </div>
        <button
          id="closeDeleteBtn"
          class="modal-close"
          type="button"
        >
          <svg class="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="modal-body modal-body--danger">
        <p id="deleteMessage">
          ¿Seguro que deseas eliminar este cliente?
        </p>

        <p id="deleteClientName" class="delete-client-name">
          <!-- aquí se inyecta el nombre -->
        </p>

        <div class="modal-footer modal-footer--danger">
          <button
            type="button"
            id="cancelDeleteBtn"
            class="btn-delete-cancel"
          >
            Cancelar
          </button>
          <button
            type="button"
            id="confirmDeleteBtn"
            class="btn-delete-confirm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
`;
