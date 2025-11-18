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
  <section id="servicios-populares" class="py-12 bg-gray-50">
    <div class="container mx-auto px-6">
      <style>
        /* Critical carousel CSS (inline to guarantee layout even if external styles load later) */
        .carousel { overflow: hidden; position: relative; }
        .carousel-track { display:flex; gap:1.5rem; overflow-x:auto; scroll-snap-type:x mandatory; scroll-behavior:smooth; -webkit-overflow-scrolling:touch; padding-bottom:4px; }
        .carousel-item { flex:0 0 100%; scroll-snap-align:start; }
        @media (min-width:640px){ .carousel-item { flex:0 0 50%; } }
        @media (min-width:1024px){ .carousel-item { flex:0 0 33.3333%; } }
        .carousel-prev, .carousel-next { position:absolute; top:50%; transform:translateY(-50%); width:44px;height:44px;border-radius:999px;border:none;background:rgba(255,255,255,0.95);box-shadow:0 6px 18px rgba(2,6,23,0.06); z-index:30 }
        .carousel-prev{ left:8px } .carousel-next{ right:8px }
        .carousel-dots{ display:flex; justify-content:center; gap:.5rem }
        /* Pagination button styles (applies to numeric/page buttons and prev/next container children) */
        .carousel-dots button { display:inline-flex; align-items:center; justify-content:center; padding:0.5rem 1rem; min-width:72px; height:42px; border-radius:0.5rem; border:1px solid #e5e7eb; background:#ffffff; color:#111827; font-size:0.95rem; cursor:pointer; white-space:nowrap; }
        .carousel-dots button:hover { background:#f8fafc; }
        .carousel-dots button.active { background:#2563eb; color:#fff; border-color:transparent; }
        .carousel-dots .page-number { min-width:44px; }
        /* Push pagination a bit lower so it doesn't overlap other content (reduced) */
        .carousel-dots { margin-top: 0.75rem; }
      </style>
      <div class="text-center mb-4">
        <p class="text-sm uppercase tracking-[0.3em] text-blue-500 mb-3">Top servicios</p>
        <h2 class="text-4xl font-bold text-gray-800 mb-3">Servicios M&aacute;s Populares</h2>
        <p class="text-lg text-gray-600">Conoce los servicios m&aacute;s solicitados por nuestros clientes</p>
      </div>

      <div class="relative mb-12">
        <div class="carousel">
          <div class="carousel-track" data-services-container aria-live="polite"></div>
        </div>

        <button class="carousel-prev" aria-label="Anterior servicio" type="button">‹</button>
        <button class="carousel-next" aria-label="Siguiente servicio" type="button">›</button>

        <div class="carousel-dots mt-6 w-full flex justify-center items-center gap-3" data-carousel-dots aria-hidden="false"></div>
      </div>

      <div class="text-center">
        <a data-show-all href="#servicios-populares" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg hover:scale-105 transform">Ver Todos los Servicios &rarr;</a>
      </div>
    </div>
  </section>
`;

export { popularServicesTemplate, loadingState, emptyState, errorState };
