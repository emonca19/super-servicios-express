// Footer helpers

export function currentYear() {
  return new Date().getFullYear();
}

export function sanitizeText(txt) {
  return String(txt || '').replace(/[<>]/g, '');
}
