export const vehiclesTemplate = () => `
  <div class="vehicles">
    <h1 class="title">Gestionar Vehículos</h1>
    <p class="subtitle">Flota de vehículos registrados</p>

    <div class="top-bar">
      <admin-search placeholder="Buscar por placas, marca, modelo o dueño..." id="search"></admin-search>
      <button class="new-vehicle-btn" id="newVehicleBtn">
        + Nuevo Vehículo
      </button>
    </div>

    <admin-table id="vehiclesTable"></admin-table>
  </div>

  <div id="vehicleModal" class="modal-backdrop">
    <div class="modal-card">
      <div class="modal-header">
        <h3 id="modalTitle" class="modal-title">Nuevo Vehículo</h3>
        <button id="closeModalBtn" class="modal-close" type="button">
          <svg class="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form id="vehicleForm" class="modal-body">
        <input type="hidden" id="vehicleId" name="id">

        <div class="field">
            <label class="field-label">Propietario (Cliente)</label>
            <select id="vehicleCliente" name="id_cliente" class="field-input" required>
                <option value="">-- Seleccione un cliente --</option>
                </select>
        </div>

        <div class="row-2-col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="field">
                <label class="field-label">Marca</label>
                <input type="text" id="vehicleMarca" name="marca" required class="field-input" placeholder="Ej. Toyota">
            </div>
            <div class="field">
                <label class="field-label">Modelo</label>
                <input type="text" id="vehicleModelo" name="modelo" required class="field-input" placeholder="Ej. Corolla">
            </div>
        </div>

        <div class="row-2-col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="field">
                <label class="field-label">Año</label>
                <input type="number" id="vehicleAnio" name="anio" required class="field-input" placeholder="2020">
            </div>
            <div class="field">
                <label class="field-label">Color</label>
                <input type="text" id="vehicleColor" name="color" required class="field-input" placeholder="Rojo">
            </div>
        </div>

        <div class="field">
            <label class="field-label">Placas</label>
            <input type="text" id="vehiclePlacas" name="placas" required class="field-input" style="text-transform: uppercase;">
        </div>

        <div class="field">
            <label class="field-label">Número de Serie (VIN)</label>
            <input type="text" id="vehicleSerie" name="numero_serie" required class="field-input">
        </div>

        <div class="modal-footer">
          <button type="button" id="cancelBtn" class="btn-secondary">Cancelar</button>
          <button type="submit" id="saveBtn" class="btn-primary">
            <span id="saveBtnText">Guardar vehículo</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <div id="viewModal" class="modal-backdrop">
    <div class="modal-card modal-card--small">
      <div class="modal-header">
        <h3 class="modal-title">Detalles del Vehículo</h3>
        <button id="closeViewBtn" class="modal-close" type="button">
           <svg class="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div class="modal-body">
         <div class="field">
            <label class="field-label">Propietario</label>
            <input id="viewPropietario" type="text" class="field-input" readonly />
         </div>
         <div class="field">
            <label class="field-label">Vehículo</label>
            <input id="viewAuto" type="text" class="field-input" readonly />
         </div>
         <div class="field">
            <label class="field-label">Placas</label>
            <input id="viewPlacas" type="text" class="field-input" readonly />
         </div>
         <div class="field">
            <label class="field-label">VIN / Serie</label>
            <input id="viewSerie" type="text" class="field-input" readonly />
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
            <h3 class="modal-title modal-title--danger">Eliminar vehículo</h3>
            <p class="modal-subtitle">Esta acción es irreversible.</p>
        </div>
        <button id="closeDeleteBtn" class="modal-close" type="button">
            <svg class="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div class="modal-body modal-body--danger">
        <p>¿Seguro que deseas eliminar este vehículo?</p>
        <p id="deleteVehicleName" class="delete-client-name" style="font-weight:bold;"></p>
        <div class="modal-footer modal-footer--danger">
          <button type="button" id="cancelDeleteBtn" class="btn-delete-cancel">Cancelar</button>
          <button type="button" id="confirmDeleteBtn" class="btn-delete-confirm">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
`;