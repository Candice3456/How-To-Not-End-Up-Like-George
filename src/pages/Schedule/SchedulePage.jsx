import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { todayKey } from '../../utils/storage';
import defaultSchedule from '../../data/defaultSchedule';
import './Schedule.css';

export default function SchedulePage() {
  const { state, dispatch } = useApp();

  const today = todayKey();
  const completedIds =
    state.completedSchedule.date === today ? state.completedSchedule.ids : [];

  const isWeekend = useMemo(() => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  }, []);

  const isStudent = state.profile?.isStudent ?? false;

  const visibleItems = useMemo(() => {
    return defaultSchedule.filter((item) => {
      if (item.studentOnly && !isStudent) return false;
      if (item.weekendOnly && !isWeekend) return false;
      return true;
    });
  }, [isStudent, isWeekend]);

  const allDone = visibleItems.every((item) => completedIds.includes(item.id));

  function handleComplete(item) {
    if (completedIds.includes(item.id)) return;
    dispatch({ type: 'COMPLETE_SCHEDULE_ITEM', payload: item.id });
    dispatch({ type: 'ADD_COINS', payload: item.coins });
  }

  return (
    <div className="schedule-page">
      <h2>Daily Schedule</h2>
      <p className="schedule-subtitle">
        Your daily routine — check them off as you go!
        {isStudent && isWeekend && (
          <span className="weekend-note"> (Weekend mode: homework tasks visible)</span>
        )}
      </p>

      {allDone && (
        <div className="all-done-banner">
          Schedule complete for today! Great job.
        </div>
      )}

      <div className="schedule-list">
        {visibleItems.map((item, index) => {
          const done = completedIds.includes(item.id);
          return (
            <div key={item.id} className={`schedule-item ${done ? 'completed' : ''}`}>
              <span className="schedule-number">{index + 1}</span>
              <span className="schedule-emoji">{item.emoji}</span>
              <div className="schedule-info">
                <span className="schedule-text">{item.text}</span>
                <span className="schedule-coins">+{item.coins} coins</span>
              </div>
              <button
                className={`task-check ${done ? 'checked' : ''}`}
                onClick={() => handleComplete(item)}
                disabled={done}
              >
                {done ? '\u2713' : ''}
              </button>
            </div>
          );
        })}
      </div>

      <div className="tasks-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(completedIds.length / visibleItems.length) * 100}%`,
            }}
          />
        </div>
        <span className="progress-label">
          {completedIds.length} / {visibleItems.length} done
        </span>
      </div>
    </div>
  );
}
