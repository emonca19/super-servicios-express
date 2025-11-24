export const autosListTemplate = (autos, currentPage, totalPages, filter) => {
    const controls = `
    <div class="list-controls">
        <div class="search">
            <input id="autos-search" type="search" placeholder="Buscar por marca, modelo o placas" value="${filter}" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 5a6 6 0 100 12 6 6 0 000-12z" />
            </svg>
        </div>
        <div class="pager">
            <span id="autos-page-info" class="page-indicator">Página ${currentPage} de ${totalPages}</span>
            <button id="autos-prev" ${currentPage <= 1 ? 'disabled' : ''}>←</button>
            <button id="autos-next" ${currentPage >= totalPages ? 'disabled' : ''}>→</button>
        </div>
    </div>
    `;

    if (!autos || autos.length === 0) {
        return `
        ${controls}
        <div class="text-center py-10 px-4 bg-white border border-dashed border-gray-200 rounded-2xl">
            <p class="text-gray-800 font-bold mb-2">No hay autos que coincidan</p>
            <p class="text-sm text-gray-600">Ajusta tu búsqueda o agrega un nuevo vehículo.</p>
        </div>
        `;
    }

    const listHtml = autos.map(a => `
        <div class="autos-item auto-card">
            <div class="auto-header">
                <div class="auto-main">
                    <div class="car-chip">
                        <svg xmlns="http://www.w3.org/2000/svg" class="car-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </div>
                    <div>
                        <p class="auto-name">${a.marca} ${a.modelo} ${a.anio}</p>
                        <div class="auto-meta">
                            <span class="auto-badge">${a.placas}</span>
                            <span class="auto-badge" style="background:${a.color ? '#f3f4f6' : 'transparent'};">${a.color || ''}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="fields">
                <div class="field-tile">
                    <p class="field-label">N. Serie</p>
                    <p class="field-value text-xs font-mono">${a.numero_serie || 'N/A'}</p>
                </div>
            </div>
        </div>
    `).join('');

    return `
    ${controls}
    <div id="autos-list">
        ${listHtml}
    </div>
    `;
};
