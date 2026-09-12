const KEYS = {
  USER_PROFILE: 'george_user_profile',
  COINS: 'george_coins',
  VOCAB_LISTS: 'george_vocab_lists',
  COMPLETED_TASKS: 'george_completed_tasks',
  COMPLETED_SCHEDULE: 'george_completed_schedule',
  PET: 'george_pet',
  QUIZ_REWARDS: 'george_quiz_rewards',
  SCHEDULE_HISTORY: 'george_schedule_history',
  LAST_ROAST_DATE: 'george_last_roast_date',
  XP: 'george_xp',
  CHEAT_STRIKES: 'george_cheat_strikes',
  LAST_TASK_DATE: 'george_last_task_date',
  LAST_SCHEDULE_DATE: 'george_last_schedule_date',
};

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export { KEYS };
