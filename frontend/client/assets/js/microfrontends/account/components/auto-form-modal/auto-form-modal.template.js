export const autoFormModalTemplate = (isOpen, data = {}) => {
    if (!isOpen) return '';

    const isEdit = !!data.id_auto;
    const title = isEdit ? 'Editar automóvil' : 'Agregar automóvil';
    const btnText = isEdit ? 'Guardar cambios' : 'Guardar automóvil';

    return `
    <div id="auto-modal" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="modal-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
                <h3>${title}</h3>
                <button data-action="cancel" class="btn-ghost" type="button">Cerrar</button>
            </div>
            
            <form id="auto-form" class="space-y-5">
                <input type="hidden" name="id_auto" value="${data.id_auto || ''}">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="auto-marca" class="block text-sm font-semibold text-gray-700 mb-1">Marca *</label>
                        <select id="auto-marca" name="marca" required autocomplete="off" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none">
                            <option value="">Selecciona marca</option>
                            ${['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Volkswagen', 'Mazda', 'BMW', 'Mercedes-Benz', 'Audi', 'Hyundai', 'Kia', 'Otra'].map(m => `
                                <option value="${m}" ${data.marca === m ? 'selected' : ''}>${m}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div>
                        <label for="auto-modelo" class="block text-sm font-semibold text-gray-700 mb-1">Modelo *</label>
                        <input id="auto-modelo" name="modelo" value="${data.modelo || ''}" placeholder="Ej. Corolla, Civic, etc." autocomplete="off" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" required />
                    </div>
                    
                    <div>
                        <label for="auto-anio" class="block text-sm font-semibold text-gray-700 mb-1">Año *</label>
                        <input id="auto-anio" name="anio" type="number" value="${data.anio || ''}" placeholder="2020" min="1950" max="2025" autocomplete="off" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" required />
                    </div>
                    
                    <div>
                        <label for="auto-color" class="block text-sm font-semibold text-gray-700 mb-1">Color</label>
                        <input id="auto-color" name="color" value="${data.color || ''}" placeholder="Color del vehículo" autocomplete="off" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" />
                    </div>
                    
                    <div>
                        <label for="auto-placas" class="block text-sm font-semibold text-gray-700 mb-1">Placas *</label>
                        <input id="auto-placas" name="placas" value="${data.placas || ''}" placeholder="XXX-123" autocomplete="off" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" required />
                    </div>
                    
                    <div>
                        <label for="auto-numero_serie" class="block text-sm font-semibold text-gray-700 mb-1">Número de serie *</label>
                        <input id="auto-numero_serie" name="numero_serie" value="${data.numero_serie || ''}" placeholder="VIN del vehículo" autocomplete="off" class="w-full px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" required />
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button type="button" data-action="cancel" class="btn-ghost">Cancelar</button>
                    <button type="submit" id="auto-save" class="btn-primary">${btnText}</button>
                </div>
            </form>
        </div>
    </div>
    `;
};
