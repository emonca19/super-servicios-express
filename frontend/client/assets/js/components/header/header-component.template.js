
const headerTemplate = () => `
  <header class="bg-white shadow-md sticky top-0 z-50">
    <nav class="container mx-auto px-6 py-4">
      <div class="flex justify-between items-center">
        <a href="/pages/index.html" class="text-2xl font-bold text-gray-800">
          Auto Servicios <span class="text-blue-600">Express</span>
        </a>
        <div class="hidden md:flex items-center space-x-6">
          <a href="/pages/index.html" class="text-gray-600 hover:text-blue-600 transition">Inicio</a>
          <a href="/pages/servicios.html" class="text-gray-600 hover:text-blue-600 transition">Servicios</a>
          <a href="/pages/contacto.html" class="text-gray-600 hover:text-blue-600 transition">Contacto</a>
          <a href="/pages/ubicacion.html" class="text-gray-600 hover:text-blue-600 transition">Ubicación</a>
          <a id="btn-agendar" href="/pages/agendar-cita.html" class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-5 rounded-full transition shadow">
            Agendar Cita
          </a>
          <div id="header-auth" class="ml-2"></div>
        </div>
        <!-- Mobile auth area (visible on small screens) -->
        <div id="header-auth-mobile" class="flex items-center md:hidden ml-2"></div>
      </div>
    </nav>

    <!-- Global Auth Modal (hidden by default) -->
    <div id="global-auth-modal" class="fixed inset-0 hidden z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border">
        <div id="global-auth-forms"></div>
      </div>
    </div>
  </header>
`;

export { headerTemplate };
