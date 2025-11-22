// Small helpers for feature-card

export function clampText(text, max = 140) {
  if (!text) return '';
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}

export function buildImageAttrs(src, alt = '') {
  return { src: src || '', alt: alt || '' };
}
