// Generates personalized tasks based on the user's profile
export function generateTasks(profile) {
  const tasks = [];
  const isAthletic = profile?.isAthletic;
  const fitness = profile?.fitnessLevel;

  if (isAthletic && fitness) {
    // Athletic: use ~75% of their max for a challenging-but-doable workout
    const pushupTarget = Math.max(5, Math.round(fitness.pushups * 0.75));
    const situpTarget = Math.max(5, Math.round(fitness.situps * 0.75));
    const squatTarget = Math.max(5, Math.round(fitness.squats * 0.75));
    const pullupTarget = Math.max(1, Math.round(fitness.pullups * 0.75));

    tasks.push(
      { id: 'task-pushups', text: `Do ${pushupTarget} strict push-ups`, coins: 15, emoji: '\uD83D\uDCAA' },
      { id: 'task-situps', text: `Do ${situpTarget} sit-ups`, coins: 15, emoji: '\uD83E\uDDD8' },
      { id: 'task-squats', text: `Do ${squatTarget} squats`, coins: 15, emoji: '\uD83C\uDFCB\uFE0F' },
      { id: 'task-pullups', text: `Do ${pullupTarget} pull-ups`, coins: 20, emoji: '\uD83E\uDD38' },
    );
  } else {
    // Beginner: easy progressions
    tasks.push(
      { id: 'task-pushups', text: 'Do 10 knee push-ups', coins: 15, emoji: '\uD83D\uDCAA' },
      { id: 'task-situps', text: 'Do 10 crunches', coins: 15, emoji: '\uD83E\uDDD8' },
      { id: 'task-squats', text: 'Do 10 assisted squats (hold a chair)', coins: 15, emoji: '\uD83C\uDFCB\uFE0F' },
      { id: 'task-pullups', text: 'Do a 15-second dead hang', coins: 20, emoji: '\uD83E\uDD38' },
    );
  }

  // These are the same for everyone
  tasks.push(
    { id: 'task-water', text: 'Drink a full cup of water', coins: 10, emoji: '\uD83D\uDCA7' },
    { id: 'task-stretch', text: 'Stretch for 2 minutes', coins: 10, emoji: '\u2B50' },
    { id: 'task-walk', text: 'Take a 5-minute walk', coins: 10, emoji: '\uD83D\uDEB6' },
    { id: 'task-fruit', text: 'Eat a piece of fruit', coins: 10, emoji: '\uD83C\uDF4E' },
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
  { id: 'task-fruit', text: 'Eat a piece of fruit', coins: 10, emoji: '\uD83C\uDF4E' },
];

export default defaultTasks;
