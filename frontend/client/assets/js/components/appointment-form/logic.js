// Utility functions for appointment-form
// These are pure helpers intended to be imported from the component

export function formatDisplayHour(slot) {
  if (!slot) return '';
  const [hhStr, mm = '00'] = String(slot).split(':');
  const hh = Number(hhStr);
  if (Number.isNaN(hh)) return slot;
  const ampm = hh >= 12 ? 'PM' : 'AM';
  const displayHour = ((hh + 11) % 12) + 1;
  return `${String(displayHour).padStart(2, '0')}:${mm} ${ampm}`;
}

export function parseDateParts(dateStr) {
  if (!dateStr) return null;
  const parts = String(dateStr).split('-').map((p) => Number(p));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  return { year: parts[0], month: parts[1], day: parts[2] };
}

export function isSunday(dateStr) {
  try {
    const p = parseDateParts(dateStr);
    if (!p) return false;
    const d = new Date(p.year, p.month - 1, p.day);
    return d.getDay() === 0;
  } catch (e) {
    return false;
  }
}

export function isSaturday(dateStr) {
  try {
    const p = parseDateParts(dateStr);
    if (!p) return false;
    const d = new Date(p.year, p.month - 1, p.day);
    return d.getDay() === 6;
  } catch (e) {
    return false;
  }
}

export function getDefaultSlots() {
  return [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];
}

export function filterSaturdaySlots(slots = []) {
  return (Array.isArray(slots) ? slots : []).filter((s) => {
    try {
      const [hh] = String(s).split(':').map(Number);
      if (Number.isNaN(hh)) return false;
      const minutes = hh * 60;
      return minutes >= (8 * 60) && minutes < (14 * 60);
    } catch (e) { return false; }
  });
}

export function safeJsonParse(str, fallback = null) {
  try { return JSON.parse(str); } catch (e) { return fallback; }
}
