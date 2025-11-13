
const headerTemplate = () => `
  <header class="bg-white shadow-md sticky top-0 z-50">
    <nav class="container mx-auto px-6 py-4">
      <div class="flex justify-between items-center">
        <a href="index.html" class="text-2xl font-bold text-gray-800">
          Auto Servicios <span class="text-blue-600">Express</span>
        </a>
        <div class="hidden md:flex items-center space-x-6">
          <a href="index.html" class="text-gray-600 hover:text-blue-600 transition">Inicio</a>
          <a href="#servicios" class="text-gray-600 hover:text-blue-600 transition">Servicios</a>
          <a href="#contacto" class="text-gray-600 hover:text-blue-600 transition">Contacto</a>
          <a href="agendar-cita.html" class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-5 rounded-full transition shadow">
            Agendar Cita
          </a>
        </div>
      </div>
    </nav>
  </header>
`;

export { headerTemplate };
