let _cachedTailwind = null;

async function _fetchTailwind() {
  if (_cachedTailwind !== null) return _cachedTailwind;

  // Probamos varias rutas posibles según desde dónde sirvas el proyecto
  const candidates = [
    // Cuando el servidor arranca dentro de /frontend/client
    "/assets/css/tailwind.css",
    // Cuando sirves todo el repo y los archivos están en /frontend/client/...
    "/frontend/client/assets/css/tailwind.css",
    // Cuando el HTML está en /frontend/admin y subimos a /frontend/client/...
    "../client/assets/css/tailwind.css",
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const css = await res.text();
      _cachedTailwind = css;
      return css;
    } catch (e) {
      // probamos la siguiente ruta
      continue;
    }
  }

  console.warn(
    "[shadow-style-loader] Could not load tailwind.css from any candidate path"
  );
  _cachedTailwind = "";
  return "";
}

export async function injectStyles(root, componentStyles = "") {
  const tw = await _fetchTailwind();
  const style = document.createElement("style");
  style.textContent = `${tw}\n${componentStyles}`;
  root.appendChild(style);
}

export async function getTailwindCss() {
  return await _fetchTailwind();
}
