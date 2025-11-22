// Helpers for ubicacion component

export function buildGoogleMapsQuery(lat, lng) {
  if (!lat || !lng) return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`;
}

export function formatAddress(addr = {}) {
  return [addr.street, addr.city, addr.state, addr.postal].filter(Boolean).join(', ');
}
