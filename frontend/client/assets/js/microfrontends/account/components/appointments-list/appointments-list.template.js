export const appointmentsListTemplate = (appointments) => {
    if (!appointments || appointments.length === 0) {
        return `
        <div class="text-center py-10 px-4 bg-white border border-dashed border-gray-200 rounded-2xl">
            <p class="text-gray-800 font-bold mb-2">No hay citas programadas</p>
            <p class="text-sm text-gray-600">Agenda un nuevo servicio para ver tus citas aquí.</p>
        </div>
        `;
    }

    // Filtrar citas canceladas
    const activeCitas = appointments.filter(c => {
        const status = (c.estado || 'PENDIENTE').toUpperCase();
        return status !== 'CANCELADA' && status !== 'CANCELLED';
    });

    if (activeCitas.length === 0) {
        return `
        <div class="text-center py-10 px-4 bg-white border border-dashed border-gray-200 rounded-2xl">
            <p class="text-gray-800 font-bold mb-2">No hay citas activas</p>
            <p class="text-sm text-gray-600">Todas tus citas han sido canceladas o completadas.</p>
        </div>
        `;
    }

    const listHtml = activeCitas.map(c => {
        const status = (c.estado || 'PENDIENTE').toUpperCase();
        let badgeClass = 'badge-pending';
        if (status === 'CONFIRMADA' || status === 'CONFIRMED') badgeClass = 'badge-confirmed';
        if (status === 'COMPLETADA' || status === 'COMPLETED') badgeClass = 'badge-completed';
        if (status === 'CANCELADA' || status === 'CANCELLED') badgeClass = 'badge-cancelled';

        // Backend devuelve 'inicio' como fecha/hora
        const date = c.inicio ? new Date(c.inicio).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Fecha pendiente';
        const time = c.inicio ? new Date(c.inicio).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '';

        // Extraer info del automóvil (objeto completo)
        const autoMarca = c.automovil?.marca || '';
        const autoModelo = c.automovil?.modelo || '';
        const autoPlacas = c.automovil?.placas || '---';
        const vehiculo = autoMarca && autoModelo ? `${autoMarca} ${autoModelo}` : 'N/A';

        // Extraer servicios (array de detalles con servicio)
        const servicios = c.detalles?.map(d => d.servicio?.nombre).filter(Boolean).join(', ') || 'Servicio General';

        const canEdit = ['PENDIENTE', 'CONFIRMADA'].includes(status);

        return `
        <div class="cita-card" data-cita-id="${c.id_cita}">
            <div class="cita-heading mb-2">
                <div class="flex items-center gap-2">
                    <div class="card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-800 text-sm">${servicios}</h4>
                        <p class="text-xs text-gray-500">${date} • ${time}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="badge ${badgeClass}">${status}</span>
                    ${canEdit ? `
                    <button class="btn-icon btn-icon-danger" data-action="cancel" data-id="${c.id_cita}" title="Cancelar cita">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                    ` : ''}
                </div>
            </div>
            <div class="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                <p><strong>Vehículo:</strong> ${vehiculo} (${autoPlacas})</p>
                ${c.motivo ? `<p class="mt-1"><strong>Motivo:</strong> ${c.motivo}</p>` : ''}
                ${c.observaciones ? `<p class="mt-1"><strong>Observaciones:</strong> ${c.observaciones}</p>` : ''}
            </div>
        </div>
        `;
    }).join('');

    return `
    <div id="citas-list" class="space-y-4">
        ${listHtml}
    </div>
    `;
};
