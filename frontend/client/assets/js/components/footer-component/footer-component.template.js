
const footerTemplate = (year = new Date().getFullYear()) => `
  <footer class="bg-gray-900 text-gray-300 pt-16 pb-8">
    <div class="container mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
        <div>
          <h4 class="text-xl font-bold text-white mb-4">Auto Servicios <span class="text-blue-400">Express</span></h4>
          <p class="text-gray-400">Tu taller de confianza con más de 4 años de experiencia.</p>
        </div>
        <div>
          <h4 class="text-xl font-bold text-white mb-4">Contacto</h4>
          <p>📞 644-xxx-xxxx</p>
          <p>📧 autoserviciosexpress@gmail.com</p>
          <p>📍 Ciudad Obregón, Sonora</p>
        </div>
        <div>
          <h4 class="text-xl font-bold text-white mb-4">Horario</h4>
          <p>Lun - Vie: 8am - 7pm</p>
          <p>Sábado: 8am - 2pm</p>
        </div>
      </div>
      <div class="border-t border-gray-700 pt-8 text-center text-gray-500">
        <p>&copy; ${year} Auto Servicios Express. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
`;

export { footerTemplate };
