import { createContext, useContext, useReducer, useEffect } from 'react';
import { load, save, KEYS, todayKey } from '../utils/storage';

const AppContext = createContext();

const initialState = {
  profile: load(KEYS.USER_PROFILE, null),
  coins: load(KEYS.COINS, 0),
  vocabLists: load(KEYS.VOCAB_LISTS, []),
  completedTasks: load(KEYS.COMPLETED_TASKS, { date: '', ids: [] }),
  completedSchedule: load(KEYS.COMPLETED_SCHEDULE, { date: '', ids: [] }),
  ownedTickets: load(KEYS.OWNED_TICKETS, []),
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'ADD_COINS':
      return { ...state, coins: state.coins + action.payload };
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
      return {
        ...state,
        completedSchedule: { date: today, ids: [...current, action.payload] },
      };
    }
    case 'ADD_TICKET':
      return { ...state, ownedTickets: [...state.ownedTickets, action.payload] };
    case 'USE_TICKET':
      return {
        ...state,
        ownedTickets: state.ownedTickets.filter((t) => t.id !== action.payload),
      };
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
  useEffect(() => { save(KEYS.OWNED_TICKETS, state.ownedTickets); }, [state.ownedTickets]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
