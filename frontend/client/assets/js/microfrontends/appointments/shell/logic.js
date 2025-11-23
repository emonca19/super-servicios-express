// Helpers for appointment shell

export function slotToDisplay(slot) {
  if (!slot) return '';
  const [hh, mm = '00'] = String(slot).split(':');
  const h = Number(hh);
  if (Number.isNaN(h)) return slot;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const disp = ((h + 11) % 12) + 1;
  return `${String(disp).padStart(2,'0')}:${mm} ${ampm}`;
}

export function isPastSlot(dateStr, slot) {
  try {
    const d = new Date(`${dateStr}T${slot}:00`);
    return d.getTime() < Date.now();
  } catch (e) { return false; }
}
