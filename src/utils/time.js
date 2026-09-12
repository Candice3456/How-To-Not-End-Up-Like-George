// Formats a "HH:MM" 24-hour string as a friendly 12-hour time, e.g. "10:30 PM".
export function formatTime(time) {
  if (!time) return 'Not set';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  if (Number.isNaN(hour)) return 'Not set';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m} ${ampm}`;
}

/** "HH:MM" -> minutes since midnight. */
export function toMinutes(time) {
  const [h, m] = (time || '0:0').split(':').map((n) => parseInt(n, 10) || 0);
  return h * 60 + m;
}

/** minutes since midnight -> "HH:MM", wrapping around the day. */
export function fromMinutes(total) {
  const t = ((total % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
}

/**
 * Returns null if the item is checkable right now, otherwise a short reason.
 * Items with no window are always available.
 */
export function availability(item, now = new Date()) {
  const cur = now.getHours() * 60 + now.getMinutes();
  // A window like 23:30 -> 04:00 wraps past midnight.
  if (item.availableFrom && item.availableUntil &&
      toMinutes(item.availableFrom) > toMinutes(item.availableUntil)) {
    const open = cur >= toMinutes(item.availableFrom) || cur <= toMinutes(item.availableUntil);
    return open ? null : `Unlocks at ${formatTime(item.availableFrom)}`;
  }
  if (item.availableFrom && cur < toMinutes(item.availableFrom)) {
    return `Unlocks at ${formatTime(item.availableFrom)}`;
  }
  if (item.availableUntil && cur > toMinutes(item.availableUntil)) {
    return `Closed after ${formatTime(item.availableUntil)}`;
  }
  return null;
}
