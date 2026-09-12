// Generates personalized tasks based on the user's profile
export function generateTasks(profile) {
  const tasks = [];
  const isAthletic = profile?.isAthletic;
  const fitness = profile?.fitnessLevel;
  const equipment = profile?.equipment ?? [];
  const hasBar = equipment.includes('pullup-bar');
  const hasWeights = equipment.includes('weights');
  const hasBands = equipment.includes('bands');

  if (isAthletic && fitness) {
    // A daily task is a quick check-in, not a max-effort set. Take a slice of
    // their max and cap it so someone who can do 200 squats isn't asked for 150.
    const fraction = profile.fitnessTier === 'moderate' ? 0.4 : 0.5;
    const target = (max, floor, cap) =>
      Math.min(cap, Math.max(floor, Math.round(max * fraction)));

    const pushupTarget = target(fitness.pushups, 5, 25);
    const situpTarget = target(fitness.situps, 5, 40);
    const squatTarget = target(fitness.squats, 5, 40);
    const pullupTarget = target(fitness.pullups, 1, 8);

    tasks.push(
      { id: 'task-pushups', text: `Do ${pushupTarget} strict push-ups`, coins: 15, emoji: '\uD83D\uDCAA' },
      { id: 'task-situps', text: `Do ${situpTarget} sit-ups`, coins: 15, emoji: '\uD83E\uDDD8' },
      { id: 'task-squats', text: `Do ${squatTarget} squats`, coins: 15, emoji: '\uD83C\uDFCB\uFE0F' },
      hasBar
        ? { id: 'task-pullups', text: `Do ${pullupTarget} pull-ups`, coins: 20, emoji: '\uD83E\uDD38' }
        : hasBands
          ? { id: 'task-pullups', text: 'Do 15 band pull-aparts', coins: 15, emoji: '\uD83E\uDE80' }
          : { id: 'task-pullups', text: 'Do a 30-second superman hold', coins: 15, emoji: '\uD83E\uDDB8' },
    );
  } else {
    // Beginner: easy progressions
    tasks.push(
      { id: 'task-pushups', text: 'Do 10 knee push-ups', coins: 15, emoji: '\uD83D\uDCAA' },
      { id: 'task-situps', text: 'Do 10 crunches', coins: 15, emoji: '\uD83E\uDDD8' },
      { id: 'task-squats', text: 'Do 10 assisted squats (hold a chair)', coins: 15, emoji: '\uD83C\uDFCB\uFE0F' },
      hasBar
        ? { id: 'task-pullups', text: 'Do a 15-second dead hang', coins: 20, emoji: '\uD83E\uDD38' }
        : hasBands
          ? { id: 'task-pullups', text: 'Do 10 band pull-aparts', coins: 15, emoji: '\uD83E\uDE80' }
          : { id: 'task-pullups', text: 'Do a 20-second superman hold', coins: 15, emoji: '\uD83E\uDDB8' },
    );
  }

  // Bonus task for anyone with weights
  if (hasWeights) {
    tasks.push({
      id: 'task-weights',
      text: isAthletic ? 'Do 12 dumbbell shoulder presses' : 'Do 10 light dumbbell curls',
      coins: 15,
      emoji: '\uD83C\uDFCB\uFE0F',
    });
  }

  // These are the same for everyone
  tasks.push(
    { id: 'task-water', text: 'Drink a full cup of water', coins: 10, emoji: '\uD83D\uDCA7' },
    { id: 'task-stretch', text: 'Stretch for 2 minutes', coins: 10, emoji: '\u2B50' },
    { id: 'task-walk', text: 'Take a 5-minute walk', coins: 10, emoji: '\uD83D\uDEB6' },
  );

  return tasks;
}

// Fallback static list (used if no profile loaded yet)
const defaultTasks = [
  { id: 'task-pushups', text: 'Do 10 knee push-ups', coins: 15, emoji: '\uD83D\uDCAA' },
  { id: 'task-situps', text: 'Do 10 crunches', coins: 15, emoji: '\uD83E\uDDD8' },
  { id: 'task-squats', text: 'Do 10 assisted squats (hold a chair)', coins: 15, emoji: '\uD83C\uDFCB\uFE0F' },
  { id: 'task-pullups', text: 'Do a 15-second dead hang', coins: 20, emoji: '\uD83E\uDD38' },
  { id: 'task-water', text: 'Drink a full cup of water', coins: 10, emoji: '\uD83D\uDCA7' },
  { id: 'task-stretch', text: 'Stretch for 2 minutes', coins: 10, emoji: '\u2B50' },
  { id: 'task-walk', text: 'Take a 5-minute walk', coins: 10, emoji: '\uD83D\uDEB6' },
];

export default defaultTasks;
