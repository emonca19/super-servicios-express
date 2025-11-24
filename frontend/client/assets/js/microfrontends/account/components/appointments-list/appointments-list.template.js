export const appointmentsListTemplate = (appointments) => {
    if (!appointments || appointments.length === 0) {
        return `
        <div class="text-center py-10 px-4 bg-white border border-dashed border-gray-200 rounded-2xl">
            <p class="text-gray-800 font-bold mb-2">No hay citas programadas</p>
            <p class="text-sm text-gray-600">Agenda un nuevo servicio para ver tus citas aquí.</p>
        </div>
        `;
    }

    const listHtml = appointments.map(c => {
        const status = (c.estado || 'PENDIENTE').toUpperCase();
        let badgeClass = 'badge-pending';
        if (status === 'CONFIRMADA' || status === 'CONFIRMED') badgeClass = 'badge-confirmed';
        if (status === 'COMPLETADA' || status === 'COMPLETED') badgeClass = 'badge-completed';
        if (status === 'CANCELADA' || status === 'CANCELLED') badgeClass = 'badge-cancelled';

        const date = c.fecha ? new Date(c.fecha).toLocaleDateString() : 'Fecha pendiente';
        const time = c.hora || '';

        return `
        <div class="cita-card">
            <div class="cita-heading mb-2">
                <div class="flex items-center gap-2">
                    <div class="card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <h4 class="font-bold text-gray-800 text-sm">${c.servicio || 'Servicio General'}</h4>
                        <p class="text-xs text-gray-500">${date} ${time}</p>
                    </div>
                </div>
                <span class="badge ${badgeClass}">${status}</span>
            </div>
            <div class="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                <p><strong>Vehículo:</strong> ${c.auto_modelo || 'N/A'} (${c.auto_placas || '---'})</p>
                ${c.motivo ? `<p class="mt-1"><strong>Motivo:</strong> ${c.motivo}</p>` : ''}
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
