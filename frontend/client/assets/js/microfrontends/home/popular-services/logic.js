// Helpers for popular-services

export function topServices(services = [], limit = 3) {
  if (!Array.isArray(services)) return [];
  return services.slice(0, limit);
}

export function normalizeService(s) {
  return {
    id: s.id_servicio || s.id || s._id,
    nombre: s.nombre || s.name || '',
    precio: s.precio || s.price || 0,
  };
}
