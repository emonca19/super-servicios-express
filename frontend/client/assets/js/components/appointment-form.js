/**
 * Formulario de agendar cita - Web Component
 */

class AppointmentForm extends HTMLElement {
    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl">
                
                <!-- Mensaje de estado -->
                <div id="form-status" class="mb-6 hidden"></div>

                <form id="appointment-form" class="space-y-10">
                    
                    <!-- 1. Datos del Cliente -->
                    <fieldset class="space-y-6">
                        <legend class="flex items-center text-2xl font-bold text-gray-800 mb-6">
                            <span class="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">1</span>
                            Datos del Cliente
                        </legend>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo *</label>
                                <input type="text" name="nombre" required 
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                    placeholder="Tu nombre completo">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Teléfono *</label>
                                <input type="tel" name="telefono" required 
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                    placeholder="(644) 123-4567">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                                <input type="email" name="email" required 
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                    placeholder="tu@email.com">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Dirección</label>
                                <input type="text" name="direccion" 
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                    placeholder="Tu dirección">
                            </div>
                        </div>
                    </fieldset>

                    <!-- 2. Información del Vehículo -->
                    <fieldset class="space-y-6 pt-6 border-t-2">
                        <legend class="flex items-center text-2xl font-bold text-gray-800 mb-6">
                            <span class="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">2</span>
                            Información del Vehículo
                        </legend>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Marca *</label>
                                <select name="marca" required 
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
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
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Modelo *</label>
                                <input type="text" name="modelo" required 
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                    placeholder="Ej: Corolla">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Año *</label>
                                <select name="ano" required id="ano-select"
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                                    <option value="">Selecciona año</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Placas</label>
                                <input type="text" name="placas" 
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none uppercase"
                                    placeholder="ABC-1234">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                                <input type="text" name="color" 
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                    placeholder="Ej: Blanco">
                            </div>
                        </div>
                    </fieldset>

                    <!-- 3. Agendar Cita -->
                    <fieldset class="space-y-6 pt-6 border-t-2">
                        <legend class="flex items-center text-2xl font-bold text-gray-800 mb-6">
                            <span class="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">3</span>
                            Agendar Cita
                        </legend>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Fecha *</label>
                                <input type="date" name="fecha" required 
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Hora *</label>
                                <select name="hora" required 
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
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
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Servicio *</label>
                                <select name="servicio" required id="servicio-select"
                                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
                                    <option value="">Selecciona servicio</option>
                                    <option value="mantenimiento">Mantenimiento General</option>
                                    <option value="frenos">Frenos y Suspensión</option>
                                    <option value="electrico">Sistema Eléctrico</option>
                                    <option value="diagnostico">Diagnóstico</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    <!-- 4. Observaciones -->
                    <fieldset class="pt-6 border-t-2">
                        <legend class="flex items-center text-2xl font-bold text-gray-800 mb-6">
                            <span class="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">4</span>
                            Observaciones
                        </legend>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Observaciones adicionales (opcional)</label>
                            <textarea name="observaciones" rows="4" 
                                class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                placeholder="Describe cualquier problema específico o información adicional..."></textarea>
                        </div>
                    </fieldset>

                    <!-- Botones -->
                    <div class="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t-2">
                        <button type="button" id="cancel-btn" 
                            class="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg transition">
                            Cancelar
                        </button>
                        <button type="submit" id="submit-btn" 
                            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg hover:scale-105 transform">
                            📅 Agendar Cita
                        </button>
                    </div>

                </form>
            </div>
        `;
    }

    attachEventListeners() {
        // Generar años dinámicamente
        const anoSelect = this.querySelector('#ano-select');
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= currentYear - 30; year--) {
            anoSelect.innerHTML += `<option value="${year}">${year}</option>`;
        }

        // Manejar envío del formulario
        const form = this.querySelector('#appointment-form');
        const submitBtn = this.querySelector('#submit-btn');
        const cancelBtn = this.querySelector('#cancel-btn');
        const statusDiv = this.querySelector('#form-status');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '⏳ Enviando...';
            
            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                console.log('📝 Datos de la cita:', data);
                
                // Aquí harías la llamada al API
                // const response = await appointmentsService.create(data);
                
                // Simulación de éxito
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                statusDiv.className = 'p-4 bg-green-100 border-2 border-green-500 text-green-700 rounded-lg flex items-center';
                statusDiv.innerHTML = `
                    <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>¡Cita agendada con éxito! Te contactaremos pronto.</span>
                `;
                statusDiv.classList.remove('hidden');
                
                form.reset();
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
                
            } catch (error) {
                console.error('❌ Error:', error);
                statusDiv.className = 'p-4 bg-red-100 border-2 border-red-500 text-red-700 rounded-lg';
                statusDiv.innerHTML = `Error: ${error.message}`;
                statusDiv.classList.remove('hidden');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '📅 Agendar Cita';
            }
        });

        cancelBtn.addEventListener('click', () => {
            if (confirm('¿Seguro que deseas cancelar?')) {
                window.location.href = 'index.html';
            }
        });
    }
}

customElements.define('appointment-form', AppointmentForm);
