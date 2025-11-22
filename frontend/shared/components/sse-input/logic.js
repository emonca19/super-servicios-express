// Helpers for sse-input

export function sanitizeValue(val) {
  return val == null ? '' : String(val);
}

export function isEmpty(val) {
  return sanitizeValue(val).trim().length === 0;
}
