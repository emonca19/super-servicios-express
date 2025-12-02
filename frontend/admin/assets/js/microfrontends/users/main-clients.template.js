export const clientsTemplate = () => `
  <div class="clients">
    <!-- Título principal -->
    <h1 class="title">Gestionar Clientes</h1>

    <!-- Subtítulo descriptivo -->
    <p class="subtitle">Lista de todos los clientes registrados</p>

    <!-- Barra superior con buscador y botón para crear cliente -->
    <div class="top-bar">
      <admin-search
        placeholder="Buscar por nombre, correo o teléfono..."
        id="search"
      ></admin-search>

      <button class="new-client-btn" id="newClientBtn">
        + Nuevo Cliente
      </button>
    </div>

    <!-- Tabla donde se mostrarán los clientes -->
    <admin-table id="clientsTable"></admin-table>
  </div>

  <!-- Modal de edición de cliente -->
  <div id="editModal"
    class="fixed inset-0 bg-gray-900 bg-opacity-50 hidden items-center justify-center z-50 backdrop-blur-sm transition-opacity">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg transform scale-100 transition-transform">
        
      <div class="flex justify-between items-center p-6 border-b border-gray-100">
        <h3 class="text-xl font-bold text-gray-800">Editar Cliente</h3>
        <button id="closeModalBtn" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form id="editClientForm" class="p-6 space-y-4">
        <input type="hidden" id="editId" name="id">
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input type="text" name="nombre" id="editNombre" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input type="email" name="email" id="editEmail" required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input type="tel" name="telefono" id="editTelefono"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
          <textarea name="direccion" id="editDireccion" rows="2"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"></textarea>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button type="button" id="cancelBtn"
            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Cancelar
          </button>
          <button type="submit" id="saveBtn"
            class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-colors flex items-center gap-2">
            <span>Guardar Cambios</span>
          </button>
        </div>
      </form>
    </div>
  </div>
`;
