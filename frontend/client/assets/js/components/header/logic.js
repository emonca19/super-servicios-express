// Header helpers

export function buildNavItems(items = []) {
  if (!Array.isArray(items)) return [];
  return items.map((it) => ({
    title: it.title || it.name || '',
    href: it.href || it.link || '#',
  }));
}
