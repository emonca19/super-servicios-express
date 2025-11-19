const appointmentFormTemplate = () => `
  <div class="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl">
    <div id="form-status" class="mb-3 hidden"></div>

    <form id="appointment-form">
      
      <fieldset class="space-y-6">
        <legend class="w-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-gray-800 section-heading">
          <span class="bg-blue-600 text-white text-lg rounded-full w-12 h-12 flex items-center justify-center mr-4 shadow-sm shrink-0">1</span>
          Datos del Cliente
        </legend>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="appointment-nombre" class="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo *</label>
            <input id="appointment-nombre" type="text" name="nombre" autocomplete="name" required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Tu nombre completo" />
          </div>
          <div>
            <label for="appointment-telefono" class="block text-sm font-semibold text-gray-700 mb-2">Teléfono *</label>
            <input id="appointment-telefono" type="tel" name="telefono" autocomplete="tel" required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="(644) 123-4567" />
          </div>
          <div>
            <label for="appointment-email" class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
            <input id="appointment-email" type="email" name="email" autocomplete="email" required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="tu@email.com" />
          </div>
          <div>
            <label for="appointment-direccion" class="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
            <input id="appointment-direccion" type="text" name="direccion" autocomplete="street-address"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Tu dirección" />
          </div>
        </div>
      </fieldset>

      <fieldset class="space-y-6 border-t-2 border-gray-100">
        <legend class="w-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-gray-800 section-heading">
          <span class="bg-blue-600 text-white text-lg rounded-full w-12 h-12 flex items-center justify-center mr-4 shadow-sm shrink-0">2</span>
          Información del Vehículo
        </legend>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label for="appointment-marca" class="block text-sm font-semibold text-gray-700 mb-2">Marca *</label>
            <select id="appointment-marca" name="marca" required autocomplete="off"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white transition-colors">
              <option value="">Selecciona marca</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
              <option value="Chevrolet">Chevrolet</option>
              <option value="Nissan">Nissan</option>
              <option value="Volkswagen">Volkswagen</option>
              <option value="Mazda">Mazda</option>
              <option value="Otra">Otra</option>
            </select>
          </div>
          <div>
            <label for="appointment-modelo" class="block text-sm font-semibold text-gray-700 mb-2">Modelo *</label>
            <input id="appointment-modelo" type="text" name="modelo" autocomplete="off" required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Ej. Corolla" />
          </div>
          <div>
            <label for="ano-select" class="block text-sm font-semibold text-gray-700 mb-2">Año *</label>
            <select id="ano-select" name="ano" required autocomplete="off"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white transition-colors">
              <option value="">Selecciona año</option>
            </select>
          </div>
          <div>
            <label for="appointment-color" class="block text-sm font-semibold text-gray-700 mb-2">Color</label>
            <input id="appointment-color" type="text" name="color" autocomplete="off"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Color del vehículo" />
          </div>
          <div class="md:col-span-2">
            <label for="appointment-placas" class="block text-sm font-semibold text-gray-700 mb-2">Placas</label>
            <input id="appointment-placas" type="text" name="placas" autocomplete="off"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="XXX-123" />
          </div>
        </div>
      </fieldset>

      <fieldset class="space-y-6 border-t-2 border-gray-100">
        <legend class="w-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-gray-800 section-heading">
          <span class="bg-blue-600 text-white text-lg rounded-full w-12 h-12 flex items-center justify-center mr-4 shadow-sm shrink-0">3</span>
          Detalles de la Cita
        </legend>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="appointment-fecha" class="block text-sm font-semibold text-gray-700 mb-2">Fecha *</label>
            <input id="appointment-fecha" type="date" name="fecha" autocomplete="off" required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors" />
          </div>
          <div>
            <label for="appointment-hora" class="block text-sm font-semibold text-gray-700 mb-2">Hora *</label>
            <select id="appointment-hora" name="hora" autocomplete="off" required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white transition-colors">
              <option value="">Selecciona hora</option>
              <option value="08:00">08:00 AM</option>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">01:00 PM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="16:00">04:00 PM</option>
              <option value="17:00">05:00 PM</option>
              <option value="18:00">06:00 PM</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label for="appointment-servicio" class="block text-sm font-semibold text-gray-700 mb-2">Servicio *</label>
            <select id="appointment-servicio" name="servicio" autocomplete="off" required
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white transition-colors">
              <option value="">Cargando servicios...</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset class="space-y-6 border-t-2 border-gray-100">
        <legend class="w-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-gray-800 section-heading">
          <span class="bg-blue-600 text-white text-lg rounded-full w-12 h-12 flex items-center justify-center mr-4 shadow-sm shrink-0">4</span>
          Observaciones
        </legend>
        
        <div>
          <label for="appointment-observaciones" class="block text-sm font-semibold text-gray-700 mb-2">Observaciones adicionales (opcional)</label>
          <textarea id="appointment-observaciones" name="observaciones" rows="4" autocomplete="off"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="Describe cualquier problema específico o información adicional..."></textarea>
        </div>
      </fieldset>

      <div>
        <button type="button" id="cancel-btn"
          class="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
          Cancelar
        </button>
        <button type="submit" id="submit-btn"
          class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg hover:scale-105 transform focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Agendar Cita
        </button>
      </div>
    </form>
  </div>
`;

export default appointmentFormTemplate;
export { appointmentFormTemplate };