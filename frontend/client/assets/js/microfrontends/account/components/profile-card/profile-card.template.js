export const profileCardTemplate = (profile) => {
    if (!profile) {
        return `
        <div class="text-center py-6">
            <p class="text-gray-600 font-medium mb-2">No autenticado</p>
            <p class="text-sm text-gray-500">Inicia sesión para ver tu perfil</p>
        </div>`;
    }

    return `
    <div class="profile-grid">
        <div class="info-block">
            <div class="soft-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>
            <div>
                <p class="info-label">Nombre completo</p>
                <p class="info-value">${profile.nombre || 'Sin nombre'}</p>
            </div>
            <button data-action="edit" data-field="nombre" class="text-blue-600 hover:text-blue-800 text-sm ml-auto">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </button>
        </div>
        <div class="info-block">
            <div class="soft-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14v7" />
                </svg>
            </div>
            <div>
                <p class="info-label">Correo electrónico</p>
                <p class="info-value">${profile.email || 'Agrega tu correo'}</p>
            </div>
            <button data-action="edit" data-field="email" class="text-blue-600 hover:text-blue-800 text-sm ml-auto">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </button>
        </div>
        <div class="info-block">
            <div class="soft-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5h2l3 7-1.35 2.7a1 1 0 00.9 1.45H17" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11a1 1 0 100-2 1 1 0 000 2zM7 20a1 1 0 110-2 1 1 0 010 2zM15 20a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            </div>
            <div>
                <p class="info-label">Teléfono</p>
                <p class="info-value">${profile.telefono || 'Agrega tu teléfono'}</p>
            </div>
            <button data-action="edit" data-field="telefono" class="text-blue-600 hover:text-blue-800 text-sm ml-auto">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </button>
        </div>
        <div class="info-block">
            <div class="soft-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
            <div>
                <p class="info-label">Dirección</p>
                <p class="info-value">${profile.direccion || 'Comparte una dirección para recordatorios'}</p>
            </div>
            <button data-action="edit" data-field="direccion" class="text-blue-600 hover:text-blue-800 text-sm ml-auto">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </button>
        </div>
    </div>
    `;
};
