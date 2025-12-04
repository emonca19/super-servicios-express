(async function () {
  try {
    await Promise.all([
      import('../components/header/header-component.js'),
      import('../components/footer-component/footer-component.js'),
      import('../microfrontends/home/index.js')
    ]);

  } catch (error) {
    console.error('[home] Error iniciando microfrontends:', error);
  }

  // Host-level event handlers: when a card dispatches `service-selected`, navigate to booking
  document.addEventListener('service-selected', (ev) => {
    try {
      const serviceId = ev?.detail?.serviceId || ev?.detail?.id || ev?.detail?.service;
      if (serviceId) {
        const url = new URL('agendar-cita.html', location.href);
        url.searchParams.set('service', serviceId);
        location.href = url.toString();
      }
    } catch (e) {
      console.warn('[host] service-selected handler error', e);
    }
  });
})();
