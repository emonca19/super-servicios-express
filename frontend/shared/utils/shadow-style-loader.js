// shared/utils/shadow-style-loader.js

let _cachedTailwind = null;

// Rutas donde buscar tailwind.css (client y admin)
const TAILWIND_PATHS = [
  '/client/assets/css/tailwind.css',
  '/admin/assets/css/tailwind.css',
  '/assets/css/tailwind.css'
];

async function _fetchTailwind() {
  if (_cachedTailwind !== null) return _cachedTailwind;

  for (const path of TAILWIND_PATHS) {
    try {
      const res = await fetch(path);
      if (res.ok) {
        const css = await res.text();
        _cachedTailwind = css;
        return css;
      }
    } catch (error) {
    }
  }

  console.warn('[shadow-style-loader] Could not load tailwind.css from any known path');
  _cachedTailwind = '';
  return '';
}

export async function injectStyles(root, componentStyles = '') {
  const tw = await _fetchTailwind();
  const style = document.createElement('style');
  style.textContent = `${tw}\n${componentStyles}`;
  root.appendChild(style);
}

export async function getTailwindCss() {
  return await _fetchTailwind();
}
