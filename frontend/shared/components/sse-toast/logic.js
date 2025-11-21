// Helpers for sse-toast

export function buildToastOptions({ duration = 3000, type = 'info' } = {}) {
  return { duration: Number(duration) || 3000, type };
}
