import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { todayKey } from '../../utils/storage';
import { generateTasks } from '../../data/defaultTasks';
import './Tasks.css';

export default function TasksPage() {
  const { state, dispatch } = useApp();

  const tasks = useMemo(() => generateTasks(state.profile), [state.profile]);

  const today = todayKey();
  const completedIds =
    state.completedTasks.date === today ? state.completedTasks.ids : [];

  const allDone = completedIds.length === tasks.length;

  function handleComplete(task) {
    if (completedIds.includes(task.id)) return;
    dispatch({ type: 'COMPLETE_TASK', payload: task.id });
    dispatch({ type: 'ADD_COINS', payload: task.coins });
  }

  return (
    <div className="tasks-page">
      <h2>Daily Tasks</h2>
      <p className="tasks-subtitle">
        {state.profile?.isAthletic
          ? 'Tailored to your fitness level — let\'s get it!'
          : 'Start easy and build up — you got this!'}
      </p>

      {allDone && (
        <div className="all-done-banner">
          All tasks done for today! Come back tomorrow.
        </div>
      )}

      <div className="tasks-list">
        {tasks.map((task) => {
          const done = completedIds.includes(task.id);
          return (
            <div key={task.id} className={`task-item ${done ? 'completed' : ''}`}>
              <span className="task-emoji">{task.emoji}</span>
              <div className="task-info">
                <span className="task-text">{task.text}</span>
                <span className="task-coins">+{task.coins} coins</span>
              </div>
              <button
                className={`task-check ${done ? 'checked' : ''}`}
                onClick={() => handleComplete(task)}
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
            style={{ width: `${(completedIds.length / tasks.length) * 100}%` }}
          />
        </div>
        <span className="progress-label">
          {completedIds.length} / {tasks.length} done
        </span>
      </div>
    </div>
  );
}
