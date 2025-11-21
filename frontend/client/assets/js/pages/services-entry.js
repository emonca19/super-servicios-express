(async function() {
  try {
    await Promise.all([
      import('../components/header/header-component.js'),
      import('../components/footer-component/footer-component.js'),
      import('../microfrontends/home/index.js')
    ]);

    // If the page was opened with ?openAuth=1 (from service-card when user clicks Agendar without being logged in)
    // trigger the global open-auth event so the header shows the login modal.
    try {
      const params = new URLSearchParams(window.location.search);
      const openAuth = params.get('openAuth');
      if (openAuth === '1' || openAuth === 'login') {
        window.dispatchEvent(new CustomEvent('open-auth', { detail: 'login' }));
      }
    } catch (e) {
      // ignore
    }

  } catch (e) { console.error(e); }
})();
