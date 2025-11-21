(async function() {
  try {
    await Promise.all([
      import('../components/header/header-component.js'),
      import('../components/footer-component/footer-component.js'),
      import('../components/contact/contact-component.js')
    ]);
  } catch (e) { console.error(e); }
})();
