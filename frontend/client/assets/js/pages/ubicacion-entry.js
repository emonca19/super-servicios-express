(async function() {
  try {
    await Promise.all([
      import('../components/header/header-component.js'),
      import('../components/footer-component/footer-component.js'),
      import('../components/ubicacion/ubicacion-component.js')
    ]);
  } catch (e) { console.error(e); }
})();
