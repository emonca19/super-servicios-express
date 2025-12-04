export const servicesTemplate = () => `
  <div class="services">
    <h1 class="title">Gestionar Servicios</h1>
    <p class="subtitle">Catálogo de servicios del taller</p>

    <div class="top-bar">
      <admin-search placeholder="Buscar servicio..." id="search"></admin-search>
      <button class="new-service-btn" id="newServiceBtn">
        + Nuevo Servicio
      </button>
    </div>

    <admin-table id="servicesTable"></admin-table>
  </div>

  <div id="serviceModal" class="modal-backdrop">
    <div class="modal-card">
      <div class="modal-header">
        <h3 id="modalTitle" class="modal-title">Nuevo Servicio</h3>
        <button id="closeModalBtn" class="modal-close" type="button">
          <svg class="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form id="serviceForm" class="modal-body">
        <input type="hidden" id="serviceId" name="id">

        <div class="field">
          <label class="field-label">Nombre del servicio</label>
          <input type="text" id="serviceNombre" name="nombre" required class="field-input" placeholder="Ej. Cambio de aceite">
        </div>

        <div class="field">
          <label class="field-label">Descripción</label>
          <textarea id="serviceDescripcion" name="descripcion" required class="field-input field-textarea" placeholder="Detalles del servicio..."></textarea>
        </div>

        <div class="row-2-col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="field">
                <label class="field-label">Duración (min)</label>
                <input type="number" id="serviceDuracion" name="duracion_estimada" required class="field-input" min="1" placeholder="45">
            </div>
            <div class="field">
                <label class="field-label">Precio ($)</label>
                <input type="number" id="servicePrecio" name="precio_con_utilidad" required class="field-input" min="0" step="0.01" placeholder="0.00">
            </div>
        </div>

        <div class="modal-footer">
          <button type="button" id="cancelBtn" class="btn-secondary">Cancelar</button>
          <button type="submit" id="saveBtn" class="btn-primary">
            <span id="saveBtnText">Guardar servicio</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <div id="viewModal" class="modal-backdrop">
    <div class="modal-card modal-card--small">
      <div class="modal-header">
        <h3 class="modal-title">Detalles del Servicio</h3>
        <button id="closeViewBtn" class="modal-close" type="button">
           <svg class="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div class="modal-body">
         <div class="field">
            <label class="field-label">Nombre</label>
            <input id="viewNombre" type="text" class="field-input" readonly />
         </div>
         <div class="field">
            <label class="field-label">Descripción</label>
            <textarea id="viewDescripcion" class="field-input field-textarea" readonly></textarea>
         </div>
         <div class="field">
            <label class="field-label">Costo y Duración</label>
            <input id="viewDetalles" type="text" class="field-input" readonly />
         </div>
         <div class="modal-footer">
            <button type="button" id="okViewBtn" class="btn-primary">Cerrar</button>
         </div>
      </div>
    </div>
  </div>

  <div id="deleteModal" class="modal-backdrop modal-backdrop--danger">
    <div class="modal-card modal-card--small modal-card--danger">
      <div class="modal-header modal-header--danger">
        <div class="modal-icon-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 7v7m0 9h.01" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <div>
            <h3 class="modal-title modal-title--danger">Eliminar servicio</h3>
            <p class="modal-subtitle">Esta acción no se puede deshacer.</p>
        </div>
        <button id="closeDeleteBtn" class="modal-close" type="button">
            <svg class="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div class="modal-body modal-body--danger">
        <p>¿Seguro que deseas eliminar este servicio?</p>
        <p id="deleteServiceName" class="delete-item-name"></p>
        <div class="modal-footer modal-footer--danger">
          <button type="button" id="cancelDeleteBtn" class="btn-delete-cancel">Cancelar</button>
          <button type="button" id="confirmDeleteBtn" class="btn-delete-confirm">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
`;