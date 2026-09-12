// availableFrom / availableUntil are 'HH:MM' windows so items can't be
// checked off at the wrong time of day (no 'winding down for bed' at 7 AM).
// Essentials are the non-negotiable hygiene basics, split into morning and
// night. Everything else is an "extra" — nice to do, and tracked over the week
// to decide whether George needs to pay the user a visit.
const defaultSchedule = [
  // --- Morning essentials ---
  { id: 'sched-teeth-am', text: 'Brush your teeth', coins: 5, emoji: '🪷', essential: true, period: 'Morning', availableUntil: '14:00' },
  { id: 'sched-face-am', text: 'Wash your face', hint: 'Rinse the toothpaste foam off your lips too', coins: 5, emoji: '🧑', essential: true, period: 'Morning', availableUntil: '14:00' },
  { id: 'sched-bed', text: 'Make your bed', coins: 5, emoji: '🛏️', essential: true, period: 'Morning', availableUntil: '14:00' },
  // --- Night essentials ---
  { id: 'sched-teeth-pm', text: 'Brush your teeth', coins: 5, emoji: '🪷', essential: true, period: 'Night', availableFrom: '18:00' },
  { id: 'sched-face-pm', text: 'Wash your face', hint: 'Same deal — after brushing', coins: 5, emoji: '🧑', essential: true, period: 'Night', availableFrom: '18:00' },

  // --- Extras ---
  { id: 'sched-3', text: 'Drink some water', coins: 5, emoji: '💧' },
  { id: 'sched-6', text: 'Finish your homework', coins: 20, emoji: '📚', studentOnly: true, weekendOnly: true },
  { id: 'sched-7', text: 'Review your notes', coins: 10, emoji: '🗒️', studentOnly: true, weekendOnly: true },
  { id: 'sched-8', text: 'Read for 15 minutes', coins: 10, emoji: '📖' },
  { id: 'sched-9', text: 'Tidy up your space', coins: 5, emoji: '🧹' },
  { id: 'sched-10', text: 'Plan tomorrow', coins: 5, emoji: '📅' },
];

export default defaultSchedule;
