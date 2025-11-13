const homeHeroTemplate = () => `
  <section class="relative h-[60vh] min-h-[500px] bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white flex items-center">
    <div class="absolute inset-0 bg-black opacity-20"></div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="max-w-2xl">
        <p class="text-sm uppercase tracking-[0.3em] text-blue-200 mb-4">Servicio integral</p>
        <h1 class="text-5xl md:text-6xl font-bold leading-tight mb-6">
          &iexcl;Tu carro en las mejores manos!
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-gray-100">
          Servicio mec&aacute;nico de calidad. M&aacute;s de 4 a&ntilde;os de experiencia al servicio de tu veh&iacute;culo.
        </p>
        <a
          href="agendar-cita.html"
          class="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full text-lg transition duration-300 shadow-2xl hover:scale-105 transform"
        >
          Agendar Cita Ahora &rarr;
        </a>
      </div>
    </div>
  </section>
`;

export default homeHeroTemplate;
export { homeHeroTemplate };
