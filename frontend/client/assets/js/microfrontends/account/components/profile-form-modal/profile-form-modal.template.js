export const profileFormModalTemplate = (isOpen, data = {}) => `
  <div class="overlay" id="profile-modal"></div>
  <div class="modal">
    <div class="modal-header">
      <h3 class="modal-title">Editar Perfil</h3>
      <button class="close-btn" data-action="cancel">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <form id="profile-form">
      <div class="modal-body">
        <div class="form-group">
          <label class="label" for="nombre">Nombre Completo</label>
          <input type="text" id="nombre" name="nombre" class="input" value="${data.nombre || ''}" required>
        </div>
        
        <div class="form-group">
          <label class="label" for="email">Correo Electrónico</label>
          <input type="email" id="email" name="email" class="input" value="${data.email || ''}" required>
        </div>

        <div class="form-group">
          <label class="label" for="telefono">Teléfono</label>
          <input type="tel" id="telefono" name="telefono" class="input" value="${data.telefono || ''}" required>
        </div>
        
        <div class="form-group">
          <label class="label" for="direccion">Dirección</label>
          <input type="text" id="direccion" name="direccion" class="input" value="${data.direccion || ''}">
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-action="cancel">Cancelar</button>
        <button type="submit" class="btn btn-primary">Guardar Cambios</button>
      </div>
    </form>
  </div>
`;
