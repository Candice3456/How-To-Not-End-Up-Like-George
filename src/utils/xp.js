// 10 XP for every coin earned. Coins get spent; XP is the permanent record.
export const XP_PER_COIN = 10;

// Escalating penalties for getting caught cheating, by strike number that day.
export const CHEAT_PENALTIES = [
  { coins: 25, xp: 0 },
  { coins: 50, xp: 0 },
  { coins: 200, xp: 1000 }, // 3rd strike and every one after
];

export function penaltyForStrike(strike) {
  return CHEAT_PENALTIES[Math.min(strike, CHEAT_PENALTIES.length) - 1];
}

/** XP needed to go from `level` to `level + 1`. Level 1→2 is 1,000, then grows. */
export function xpForLevel(level) {
  return 1000 + (level - 1) * 500;
}

/** Turns a total XP number into { level, into, needed } for a progress bar. */
export function levelInfo(xp) {
  let level = 1;
  let remaining = Math.max(0, xp);
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return { level, into: remaining, needed: xpForLevel(level) };
}
