// Helpers for account microfrontend (pure functions)

export function formatUserName(user = {}) {
  if (!user) return '';
  return `${user.nombre || user.name || ''}`.trim();
}

export function safeProfileData(data) {
  if (!data) return {};
  return {
    nombre: data.nombre || data.name || '',
    email: data.email || data.mail || '',
    telefono: data.telefono || data.phone || '',
  };
}
