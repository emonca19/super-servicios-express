/*
  logic.js

  Funciones auxiliares (puras) usadas por `appointment-form.component.js`.
  - Están separadas porque no dependen del DOM: son fáciles de probar y
    mantener.
  - Aquí hay helpers para formatear horas, parsear fechas y filtrar
    horarios especiales (p. ej. sábados y domingos).
*/

/**
 * formatDisplayHour(slot)
 * - slot: string en formato "HH:MM" (p. ej. "09:00")
 * Devuelve una cadena legible con AM/PM, p. ej. "09:00 AM".
 */
export function formatDisplayHour(slot) {
  if (!slot) return '';
  const [hhStr, mm = '00'] = String(slot).split(':');
  const hh = Number(hhStr);
  if (Number.isNaN(hh)) return slot;
  const ampm = hh >= 12 ? 'PM' : 'AM';
  const displayHour = ((hh + 11) % 12) + 1;
  return `${String(displayHour).padStart(2, '0')}:${mm} ${ampm}`;
}

/**
 * parseDateParts(dateStr)
 * - dateStr: 'YYYY-MM-DD'
 * Devuelve un objeto { year, month, day } o null si el string no es válido.
 */
export function parseDateParts(dateStr) {
  if (!dateStr) return null;
  const parts = String(dateStr).split('-').map((p) => Number(p));
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return null;
  return { year: parts[0], month: parts[1], day: parts[2] };
}

/**
 * isSunday(dateStr)
 * - Retorna true si la fecha indicada cae en domingo.
 */
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

/**
 * isSaturday(dateStr)
 * - Retorna true si la fecha indicada es sábado.
 */
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

/**
 * getDefaultSlots()
 * - Devuelve la lista de horas por defecto cuando el backend no responde.
 */
export function getDefaultSlots() {
  return [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];
}

/**
 * filterSaturdaySlots(slots)
 * - Filtra las franjas horarias para ajustarlas al horario de sábados
 *   (p. ej. sólo hasta las 14:00).
 */
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

/**
 * safeJsonParse(str, fallback)
 * - Intenta parsear JSON de forma segura devolviendo `fallback` en error.
 */
export function safeJsonParse(str, fallback = null) {
  try { return JSON.parse(str); } catch (e) { return fallback; }
}
