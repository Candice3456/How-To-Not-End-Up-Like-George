import defaultSchedule from '../data/defaultSchedule';

const EXTRA_IDS = new Set(defaultSchedule.filter((i) => !i.essential).map((i) => i.id));
// Profile-driven extras that aren't in the static list.
EXTRA_IDS.add('sched-wake');
EXTRA_IDS.add('sched-bedtime');

export const EXTRAS_PER_DAY_GOAL = 2;
export const MIN_DAYS_BEFORE_ROAST = 3;

function dateKeyDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

/**
 * Looks back over the past 7 days (not counting today, which is still in
 * progress) and decides whether George needs to show up.
 *
 * Roast when the user has at least MIN_DAYS_BEFORE_ROAST days of history and
 * did NOT hit the extras goal on any of them.
 */
export function shouldRoast(scheduleHistory) {
  const days = Array.from({ length: 7 }, (_, i) => dateKeyDaysAgo(i + 1));
  const daysWithHistory = days.filter((d) => scheduleHistory[d]);
  if (daysWithHistory.length < MIN_DAYS_BEFORE_ROAST) return false;

  const goodDays = daysWithHistory.filter((d) => {
    const extras = scheduleHistory[d].filter((id) => EXTRA_IDS.has(id));
    return extras.length >= EXTRAS_PER_DAY_GOAL;
  });
  return goodDays.length === 0;
}

/** Drops history older than 14 days so localStorage doesn't grow forever. */
export function pruneHistory(history) {
  const cutoff = dateKeyDaysAgo(14);
  return Object.fromEntries(Object.entries(history).filter(([d]) => d >= cutoff));
}
