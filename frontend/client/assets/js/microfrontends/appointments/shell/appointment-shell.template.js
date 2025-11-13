const appointmentShellTemplate = () => `
  <section class="py-16">
    <div class="container mx-auto px-6">
      <div class="text-center mb-12">
        <p class="text-sm uppercase tracking-[0.3em] text-blue-500 mb-4">Agenda en minutos</p>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Agendar tu Cita</h1>
        <p class="text-xl text-gray-600">Completa el formulario para programar tu servicio automotriz</p>
      </div>

      <appointment-form></appointment-form>
    </div>
  </section>
`;

export default appointmentShellTemplate;
export { appointmentShellTemplate };
