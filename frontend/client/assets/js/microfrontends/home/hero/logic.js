// Hero helpers

export function heroTitle(data) {
  return data?.title || data?.heading || 'Bienvenido';
}

export function heroSubtitle(data) {
  return data?.subtitle || data?.sub || '';
}
