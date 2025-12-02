let _cachedTailwind = null;

async function _fetchTailwind() {
  if (_cachedTailwind !== null) return _cachedTailwind;

  try {
    const res = await fetch('../assets/css/tailwind.css');
    if (!res.ok) throw new Error();
    const css = await res.text();
    _cachedTailwind = css;
    return css;
  } catch (e) {
    console.warn('[shadow-style-loader] Admin could not load tailwind.css');
    _cachedTailwind = '';
    return '';
  }
}

export async function injectStyles(componentStyles = '') {
  const tw = await _fetchTailwind();
  return `${tw}\n${componentStyles}`;
}
