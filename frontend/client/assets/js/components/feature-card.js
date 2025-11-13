/**
 * FeatureCard Web Component
 * Componente para mostrar características del servicio
 * Uso: <feature-card icon-type="clock" title="Rapidez" description="Servicio rápido"></feature-card>
 */

/**
 * FeatureCard Web Component
 * Componente para mostrar características del servicio
 * Uso: <feature-card icon-type="clock" title="Rapidez" description="Servicio rápido"></feature-card>
 */

class FeatureCard extends HTMLElement {
    connectedCallback() {
        // Obtener atributos del componente
        const title = this.getAttribute('title') || 'Feature';
        const description = this.getAttribute('description') || 'Description';
        const iconType = this.getAttribute('icon-type') || 'clock';

        // Iconos SVG disponibles
        const icons = {
            clock: '<svg class="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
            check: '<svg class="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
            shield: '<svg class="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>',
            star: '<svg class="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>',
            wrench: '<svg class="h-12 w-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>'
        };

        // Renderizar el HTML del componente
        this.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow-lg border border-gray-100 text-center hover:shadow-xl transition hover:scale-105 transform duration-300">
                <div class="bg-blue-100 rounded-full p-4 inline-flex mb-4">
                    ${icons[iconType] || icons.clock}
                </div>
                <h3 class="text-2xl font-semibold text-gray-800 mb-3">${title}</h3>
                <p class="text-gray-600 leading-relaxed">${description}</p>
            </div>
        `;
    }
}

// Registrar el Custom Element (si no está ya definido)
if (!customElements.get('feature-card')) {
    customElements.define('feature-card', FeatureCard);
}
