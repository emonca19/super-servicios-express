// Page entry for agendar-cita
(async function () {
  try {
    // Ensure apiClient is available globally for pages that expect it
    try {
      const apiMod = await import('../services/api-client.js');
      // default export is the singleton instance
      window.apiClient = window.apiClient || (apiMod && (apiMod.default || apiMod.ApiClient || apiMod));
      // Also expose the class if needed
      window.ApiClient = window.ApiClient || (apiMod && apiMod.ApiClient);
      console.debug('[bootstrap] apiClient exposed', !!window.apiClient, 'baseURL=', window.apiClient && window.apiClient.baseURL);
    } catch (e) {
      console.warn('[bootstrap] could not import api-client', e);
    }

    await Promise.all([
      import('../components/header/header-component.js'),
      import('../components/footer-component/footer-component.js'),
      import('../microfrontends/appointments/index.js')
    ]);
    console.log('[appointments] Microfrontends cargados');
  } catch (error) {
    console.error('[appointments] Error iniciando microfrontends:', error);
  }

  // Host: show a simple toast or redirect on appointment saved
  window.addEventListener('appointment-saved', (ev) => {
    try {
      const detail = ev?.detail || {};
      // Simple UX: alert then redirect to home — replace with nicer toast/modal if desired
      const appointmentId = detail?.appointment?.id || detail?.appointment?._id || '';
      const msg = appointmentId ? 'Cita agendada con éxito. ID: ' + appointmentId : 'Cita agendada con éxito.';
      // Use a minimal non-blocking toast
      const toast = document.createElement('div');
      toast.className = 'fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
      toast.textContent = msg;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3500);
      // After a short delay redirect to home (optional)
      setTimeout(() => { window.location.href = 'index.html'; }, 1800);
    } catch (e) {
      console.warn('[host] appointment-saved handler error', e);
    }
  });
})();
