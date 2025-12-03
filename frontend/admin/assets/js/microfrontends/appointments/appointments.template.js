export const appointmentsTemplate = (activeFilter = "all") => `
  <div class="appointments">
    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
            <h1 class="title">Citas Pendientes</h1>
            <p class="subtitle">Gestión de agenda y servicios</p>
        </div>
        <button id="newAppointmentBtn" class="new-appointment-btn">+ Nueva Cita</button>
    </div>

    <div class="filters">
      <button class="filter-pill ${activeFilter === "all" ? "active" : ""}" data-filter="all">Todas</button>
      <button class="filter-pill ${activeFilter === "today" ? "active" : ""}" data-filter="today">Hoy</button>
      <button class="filter-pill ${activeFilter === "week" ? "active" : ""}" data-filter="week">Esta Semana</button>
      <button class="filter-pill ${activeFilter === "overdue" ? "active" : ""}" data-filter="overdue">Atrasadas</button>
    </div>

    <admin-table id="tabla-appointments"></admin-table>
  </div>

  <div id="appModal" class="modal-backdrop">
    <div class="modal-card">
      <div class="modal-header">
        <h3 id="modalTitle" class="modal-title">Agendar Cita</h3>
        <button class="modal-close closeModal">&times;</button>
      </div>
      <form id="appForm" class="modal-body">
        <input type="hidden" id="appId" name="id">
        
        <div class="row-2-col">
            <div class="field">
                <label class="field-label">Fecha</label>
                <input type="date" id="appFecha" name="fecha" required class="field-input">
            </div>
            <div class="field">
                <label class="field-label">Hora Inicio</label>
                <input type="time" id="appHora" name="hora" required class="field-input">
            </div>
        </div>

        <div class="row-2-col">
            <div class="field">
                <label class="field-label">Cliente</label>
                <select id="appCliente" name="id_cliente" required class="field-input">
                    <option value="">Cargando...</option>
                </select>
            </div>
            <div class="field">
                <label class="field-label">Vehículo</label>
                <select id="appAuto" name="id_auto" required class="field-input">
                    <option value="">Seleccione Cliente primero</option>
                </select>
            </div>
        </div>

        <div class="row-2-col">
            <div class="field">
                <label class="field-label">Servicio Principal</label>
                <select id="appServicio" name="id_servicio" required class="field-input">
                    <option value="">Cargando...</option>
                </select>
            </div>
            <div class="field">
                <label class="field-label">Estado</label>
                <select id="appEstado" name="estado" class="field-input">
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="CONFIRMADA">Confirmada / En Proceso</option>
                    <option value="FINALIZADA">Finalizada</option>
                    <option value="CANCELADA">Cancelada</option>
                </select>
            </div>
        </div>

        <div class="field">
            <label class="field-label">Motivo / Asunto</label>
            <input type="text" id="appMotivo" name="motivo" placeholder="Ej. Revisión de frenos" class="field-input" required>
        </div>

        <div class="field">
            <label class="field-label">Observaciones</label>
            <textarea id="appObservaciones" name="observaciones" class="field-input field-textarea"></textarea>
        </div>

        <div class="modal-footer">
            <button type="button" class="btn-secondary closeModal">Cancelar</button>
            <button type="submit" id="saveBtn" class="btn-primary">Guardar Cita</button>
        </div>
      </form>
    </div>
  </div>

  <div id="viewModal" class="modal-backdrop">
    <div class="modal-card" style="max-width: 500px;">
      <div class="modal-header">
        <h3 class="modal-title">Detalles de la Cita</h3>
        <button class="modal-close closeView">&times;</button>
      </div>
      <div class="modal-body">
        <div class="field"><label class="field-label">Cliente</label><input id="viewCliente" readonly class="field-input"></div>
        <div class="field"><label class="field-label">Vehículo</label><input id="viewAuto" readonly class="field-input"></div>
        <div class="row-2-col">
            <div class="field"><label class="field-label">Fecha</label><input id="viewFecha" readonly class="field-input"></div>
            <div class="field"><label class="field-label">Hora</label><input id="viewHora" readonly class="field-input"></div>
        </div>
        <div class="field"><label class="field-label">Servicio</label><input id="viewServicio" readonly class="field-input"></div>
        <div class="field"><label class="field-label">Notas</label><textarea id="viewNotas" readonly class="field-input field-textarea"></textarea></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-primary closeView">Cerrar</button>
      </div>
    </div>
  </div>

  <div id="deleteModal" class="modal-backdrop">
    <div class="modal-card modal-card--danger" style="max-width: 400px;">
      <div class="modal-header">
        <h3 class="modal-title modal-title--danger">Eliminar Cita</h3>
        <button class="modal-close closeDelete">&times;</button>
      </div>
      <div class="modal-body">
        <p>¿Estás seguro de eliminar esta cita?</p>
        <p id="deleteName" style="font-weight:bold;"></p>
        <div class="modal-footer">
            <button type="button" class="btn-secondary closeDelete">Cancelar</button>
            <button type="button" id="confirmDeleteBtn" class="btn-delete-confirm">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
`;