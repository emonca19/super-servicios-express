// Pure helpers for sse-button component

export function normalizeLabel(label) {
  return String(label || '').trim();
}

export function buildButtonAttrs({ type = 'button', disabled = false } = {}) {
  return { type, disabled };
}
