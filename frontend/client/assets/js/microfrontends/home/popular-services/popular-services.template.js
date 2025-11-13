const loadingState = () => `
  <div class="col-span-3 text-center py-12">
    <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <p class="mt-4 text-gray-600">Cargando servicios...</p>
  </div>
`;

const emptyState = () => `
  <div class="col-span-3 text-center py-12">
    <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
    </svg>
    <p class="text-gray-600 text-lg">No hay servicios disponibles</p>
    <p class="text-gray-500 text-sm mt-2">Verifica que el backend est&aacute; corriendo en puerto 8000</p>
  </div>
`;

const errorState = (message) => `
  <div class="col-span-3 text-center py-12">
    <div class="bg-red-50 border-2 border-red-200 rounded-lg p-8 inline-block max-w-md">
      <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="text-red-600 font-semibold text-lg mb-2">Error al cargar servicios</p>
      <p class="text-red-500 text-sm mb-4"></p>
      <div class="bg-white p-4 rounded mb-4 text-left">
        <p class="text-gray-700 text-sm font-semibold mb-2">Verifica:</p>
        <ul class="text-gray-600 text-xs space-y-1">
          <li>&bull; Backend corriendo en: <code class="bg-gray-100 px-1">http://localhost:8000</code></li>
          <li>&bull; Archivo existe: <code class="bg-gray-100 px-1">assets/js/services/api-client.js</code></li>
          <li>&bull; CORS habilitado en el backend</li>
        </ul>
      </div>
      <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition" data-retry>
        Reintentar
      </button>
    </div>
  </div>
`;

const popularServicesTemplate = () => `
  <section id="servicios-populares" class="py-20 bg-gray-50">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <p class="text-sm uppercase tracking-[0.3em] text-blue-500 mb-4">Top servicios</p>
        <h2 class="text-4xl font-bold text-gray-800 mb-4">Servicios M&aacute;s Populares</h2>
        <p class="text-lg text-gray-600">Conoce los servicios m&aacute;s solicitados por nuestros clientes</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12" data-services-container>
        
      </div>

      <div class="text-center">
        <a
          href="#servicios-populares"
          class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg hover:scale-105 transform"
        >
          Ver Todos los Servicios &rarr;
        </a>
      </div>
    </div>
  </section>
`;

export { popularServicesTemplate, loadingState, emptyState, errorState };
