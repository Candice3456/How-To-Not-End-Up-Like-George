import { createContext, useContext, useReducer, useEffect } from 'react';
import { load, save, KEYS, todayKey } from '../utils/storage';
import { pruneHistory } from '../utils/georgeCheck';
import { XP_PER_COIN, penaltyForStrike } from '../utils/xp';

const AppContext = createContext();

const initialState = {
  profile: load(KEYS.USER_PROFILE, null),
  coins: load(KEYS.COINS, 0),
  vocabLists: load(KEYS.VOCAB_LISTS, []),
  completedTasks: load(KEYS.COMPLETED_TASKS, { date: '', ids: [] }),
  completedSchedule: load(KEYS.COMPLETED_SCHEDULE, { date: '', ids: [] }),
  // { type, name, hunger, updatedAt } — hunger is as of updatedAt; drain is computed on read.
  pet: load(KEYS.PET, null),
  quizRewards: load(KEYS.QUIZ_REWARDS, { date: '', listIds: [] }),
  // { 'YYYY-MM-DD': [completed schedule ids] } for the last two weeks
  scheduleHistory: pruneHistory(load(KEYS.SCHEDULE_HISTORY, {})),
  lastRoastDate: load(KEYS.LAST_ROAST_DATE, ''),
  xp: load(KEYS.XP, 0),
  cheatStrikes: load(KEYS.CHEAT_STRIKES, { date: '', count: 0 }),
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'ADD_COINS':
      return {
        ...state,
        coins: state.coins + action.payload,
        xp: state.xp + action.payload * XP_PER_COIN,
      };
    case 'PENALIZE_CHEAT': {
      const today = todayKey();
      const count = (state.cheatStrikes.date === today ? state.cheatStrikes.count : 0) + 1;
      const penalty = penaltyForStrike(count);
      return {
        ...state,
        coins: Math.max(0, state.coins - penalty.coins),
        xp: Math.max(0, state.xp - penalty.xp),
        cheatStrikes: { date: today, count },
      };
    }
    case 'SPEND_COINS':
      return { ...state, coins: state.coins - action.payload };
    case 'SET_VOCAB_LISTS':
      return { ...state, vocabLists: action.payload };
    case 'ADD_VOCAB_LIST':
      return { ...state, vocabLists: [...state.vocabLists, action.payload] };
    case 'UPDATE_VOCAB_LIST':
      return {
        ...state,
        vocabLists: state.vocabLists.map((l) =>
          l.id === action.payload.id ? action.payload : l
        ),
      };
    case 'DELETE_VOCAB_LIST':
      return {
        ...state,
        vocabLists: state.vocabLists.filter((l) => l.id !== action.payload),
      };
    case 'COMPLETE_TASK': {
      const today = todayKey();
      const current =
        state.completedTasks.date === today
          ? state.completedTasks.ids
          : [];
      if (current.includes(action.payload)) return state;
      return {
        ...state,
        completedTasks: { date: today, ids: [...current, action.payload] },
      };
    }
    case 'COMPLETE_SCHEDULE_ITEM': {
      const today = todayKey();
      const current =
        state.completedSchedule.date === today
          ? state.completedSchedule.ids
          : [];
      if (current.includes(action.payload)) return state;
      const ids = [...current, action.payload];
      return {
        ...state,
        completedSchedule: { date: today, ids },
        scheduleHistory: { ...state.scheduleHistory, [today]: ids },
      };
    }
    case 'MARK_ROASTED':
      return { ...state, lastRoastDate: todayKey() };
    case 'CLAIM_QUIZ_REWARD': {
      const today = todayKey();
      const current =
        state.quizRewards.date === today ? state.quizRewards.listIds : [];
      if (current.includes(action.payload)) return state;
      return {
        ...state,
        quizRewards: { date: today, listIds: [...current, action.payload] },
      };
    }
    case 'SET_PET':
      return { ...state, pet: action.payload };
    case 'FEED_PET': {
      // payload: { cost, fill, hunger } — hunger is the caller's current (drained) value
      if (!state.pet || state.coins < action.payload.cost) return state;
      return {
        ...state,
        coins: state.coins - action.payload.cost,
        pet: {
          ...state.pet,
          hunger: Math.min(100, action.payload.hunger + action.payload.fill),
          updatedAt: Date.now(),
        },
      };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => { save(KEYS.USER_PROFILE, state.profile); }, [state.profile]);
  useEffect(() => { save(KEYS.COINS, state.coins); }, [state.coins]);
  useEffect(() => { save(KEYS.VOCAB_LISTS, state.vocabLists); }, [state.vocabLists]);
  useEffect(() => { save(KEYS.COMPLETED_TASKS, state.completedTasks); }, [state.completedTasks]);
  useEffect(() => { save(KEYS.COMPLETED_SCHEDULE, state.completedSchedule); }, [state.completedSchedule]);
  useEffect(() => { save(KEYS.PET, state.pet); }, [state.pet]);
  useEffect(() => { save(KEYS.QUIZ_REWARDS, state.quizRewards); }, [state.quizRewards]);
  useEffect(() => { save(KEYS.SCHEDULE_HISTORY, state.scheduleHistory); }, [state.scheduleHistory]);
  useEffect(() => { save(KEYS.LAST_ROAST_DATE, state.lastRoastDate); }, [state.lastRoastDate]);
  useEffect(() => { save(KEYS.XP, state.xp); }, [state.xp]);
  useEffect(() => { save(KEYS.CHEAT_STRIKES, state.cheatStrikes); }, [state.cheatStrikes]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
