// Features helpers

export function normalizeFeature(feature = {}) {
  return {
    title: feature.title || feature.nombre || '',
    description: feature.description || feature.desc || feature.descripcion || '',
    icon: feature.icon || feature.image || null,
  };
}

export function sortFeatures(features = []) {
  return (features || []).slice().sort((a,b) => (a.order||0) - (b.order||0));
}
