// Helpers for service-card

export function priceToString(price) {
  const n = Number(price);
  if (Number.isNaN(n)) return '';
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' }).replace('US$', '$');
}

export function serviceTitle(obj) {
  return obj && (obj.nombre || obj.name || obj.title) || '';
}
