export const petChoices = [
  { id: 'cat', name: 'Cat', emoji: '🐱' },
  { id: 'dog', name: 'Dog', emoji: '🐶' },
  { id: 'frog', name: 'Frog', emoji: '🐸' },
  { id: 'dragon', name: 'Dragon', emoji: '🐉' },
];

// Feeding options — coins in, hunger out.
export const foods = [
  { id: 'snack', name: 'Snack', emoji: '🍪', cost: 10, fill: 15 },
  { id: 'meal', name: 'Meal', emoji: '🍖', cost: 25, fill: 40 },
  { id: 'feast', name: 'Feast', emoji: '🎂', cost: 50, fill: 100 },
];

// Hunger is 0-100 and drains this many points per hour, so a full pet is
// empty in roughly a day if ignored.
export const HUNGER_DRAIN_PER_HOUR = 4;

// Hours the bar can sit at zero before George gets involved.
export const STARVING_HOURS_BEFORE_ROAST = 24;

export function moodFor(hunger) {
  if (hunger > 70) return { key: 'happy', label: 'Happy', face: '😊', line: 'is thriving. Keep it up!' };
  if (hunger > 40) return { key: 'fine', label: 'Content', face: '🙂', line: 'is doing fine.' };
  if (hunger > 15) return { key: 'hungry', label: 'Hungry', face: '😟', line: 'is getting hungry...' };
  if (hunger > 0) return { key: 'starving', label: 'Starving', face: '😫', line: 'is STARVING. Feed it!' };
  return { key: 'empty', label: 'Empty', face: '💀', line: "hasn't eaten in ages. Seriously." };
}

/** Applies time-based drain to a stored pet and returns the current hunger. */
export function currentHunger(pet, now = Date.now()) {
  if (!pet) return 0;
  const hours = Math.max(0, (now - pet.updatedAt) / 3_600_000);
  return Math.max(0, Math.min(100, pet.hunger - hours * HUNGER_DRAIN_PER_HOUR));
}

/** Timestamp when hunger hit zero, or null if it hasn't yet. */
export function emptySince(pet, now = Date.now()) {
  if (!pet) return null;
  const hoursToEmpty = pet.hunger / HUNGER_DRAIN_PER_HOUR;
  const emptyAt = pet.updatedAt + hoursToEmpty * 3_600_000;
  return emptyAt <= now ? emptyAt : null;
}
