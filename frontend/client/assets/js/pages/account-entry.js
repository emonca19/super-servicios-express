(async function () {
  try {
    await Promise.all([
      import('../components/header/header-component.js'),
      import('../components/footer-component/footer-component.js'),
      import('../microfrontends/account/index.js')
    ]);
  } catch (err) {
    // ignore
  }
})();
