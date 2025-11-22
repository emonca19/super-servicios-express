let _cachedTailwind = null;

async function _fetchTailwind() {
  if (_cachedTailwind !== null) return _cachedTailwind;
  try {
    const res = await fetch('/assets/css/tailwind.css');
    if (!res.ok) throw new Error('tailwind.css not found');
    const css = await res.text();
    _cachedTailwind = css;
    return css;
  } catch (e) {
    console.warn('[shadow-style-loader] Could not load tailwind.css:', e);
    _cachedTailwind = '';
    return '';
  }
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
