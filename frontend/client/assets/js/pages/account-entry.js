(async function () {
  try {
    await Promise.all([
      import('../components/header/header-component.js'),
      import('../components/footer-component/footer-component.js'),
      import('../microfrontends/account/index.js')
    ]);
    console.log('[account] Microfrontend cargado');
  } catch (err) {
    console.error('[account] Error cargando microfrontend', err);
  }
})();
