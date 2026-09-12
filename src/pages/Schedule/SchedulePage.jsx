import { useMemo, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { todayKey } from '../../utils/storage';
import defaultSchedule from '../../data/defaultSchedule';
import { formatTime, toMinutes, fromMinutes, availability } from '../../utils/time';
import { EXTRAS_PER_DAY_GOAL } from '../../utils/georgeCheck';
import { GeorgePopup } from '../../components/GeorgeRoast';
import { georgePhotos, cheatRoasts, cheatQuestion } from '../../data/georgeRoasts';
import { penaltyForStrike } from '../../utils/xp';
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

  const bedtime = state.profile?.bedtime;
  const wakeTime = state.profile?.wakeTime;

  const visibleItems = useMemo(() => {
    const items = defaultSchedule.filter((item) => {
      if (item.studentOnly && !isStudent) return false;
      if (item.weekendOnly && !isWeekend) return false;
      return true;
    });

    // The sleep schedule from onboarding bookends the day.
    if (wakeTime) {
      items.unshift({
        id: 'sched-wake',
        text: `Get up by ${formatTime(wakeTime)}`,
        coins: 10,
        emoji: '\u23F0',
        // Grace period — check it within half an hour of your wake time.
        availableUntil: fromMinutes(toMinutes(wakeTime) + 30),
      });
    }
    if (bedtime) {
      items.push({
        id: 'sched-bedtime',
        text: `Start winding down for bed by ${formatTime(bedtime)}`,
        coins: 10,
        emoji: '\uD83D\uDE34',
        availableFrom: fromMinutes(toMinutes(bedtime) - 60),
        // Night owls: a bedtime in the small hours keeps the window open past midnight.
        ...(toMinutes(bedtime) < 5 * 60 ? { availableUntil: '05:00' } : {}),
      });
    }

    return items;
  }, [isStudent, isWeekend, bedtime, wakeTime]);

  // Only count items that are actually visible today — a homework item checked
  // off on the weekend must not inflate the weekday progress bar.
  const visibleCompleted = visibleItems.filter((item) =>
    completedIds.includes(item.id)
  );

  const allDone = visibleCompleted.length === visibleItems.length;

  // Re-render every minute so locks open/close while the page is sitting there.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Set when the user tries to check something off at the wrong time of day.
  const [cheatRoast, setCheatRoast] = useState(null);

  const essentials = visibleItems.filter((i) => i.essential);
  const extras = visibleItems.filter((i) => !i.essential);
  const extrasDone = extras.filter((i) => completedIds.includes(i.id)).length;
  const periods = ['Morning', 'Night'];

  function handleComplete(item) {
    if (completedIds.includes(item.id)) return;
    if (availability(item, new Date())) {
      // Caught. No coins, no checkmark — just George.
      const timeStr = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      const line = cheatRoasts[Math.floor(Math.random() * cheatRoasts.length)]
        .replace('{item}', item.text)
        .replace('{time}', timeStr);
      const strike =
        (state.cheatStrikes.date === today ? state.cheatStrikes.count : 0) + 1;
      const penalty = penaltyForStrike(strike);
      dispatch({ type: 'PENALIZE_CHEAT' });
      setCheatRoast({ line, strike, penalty });
      return;
    }
    dispatch({ type: 'COMPLETE_SCHEDULE_ITEM', payload: item.id });
    dispatch({ type: 'ADD_COINS', payload: item.coins });
  }

  function renderItem(item, index) {
    const done = completedIds.includes(item.id);
    const window = !done && availability(item, now);
    return (
      <div key={item.id} className={`schedule-item ${done ? 'completed' : ''}`}>
        <span className="schedule-number">{index + 1}</span>
        <span className="schedule-emoji">{item.emoji}</span>
        <div className="schedule-info">
          <span className="schedule-text">{item.text}</span>
          {item.hint && <span className="schedule-hint">{item.hint}</span>}
          <span className="schedule-coins">
            +{item.coins} coins
            {window && <span className="schedule-window"> · {window.replace('Unlocks at', 'from').replace('Closed after', 'until')}</span>}
          </span>
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
  }

  return (
    <div className="schedule-page">
      {cheatRoast && (
        <GeorgePopup
          roast={cheatRoast.line}
          penalty={
            `Strike ${cheatRoast.strike} today: \u2212${cheatRoast.penalty.coins} coins` +
            (cheatRoast.penalty.xp ? ` and \u2212${cheatRoast.penalty.xp.toLocaleString()} XP` : '')
          }
          photo={georgePhotos.length ? georgePhotos[Math.floor(Math.random() * georgePhotos.length)] : null}
          question={cheatQuestion}
          closeLabel="Okay, okay. I'll do it for real."
          onClose={() => setCheatRoast(null)}
        />
      )}
      <h2>Daily Schedule</h2>
      <p className="schedule-subtitle">
        Essentials are non-negotiable. Knock out at least {EXTRAS_PER_DAY_GOAL} extras a day or George pays you a visit.
        {isStudent && isWeekend && (
          <span className="weekend-note"> (Weekend mode: homework tasks visible)</span>
        )}
      </p>

      {allDone && (
        <div className="all-done-banner">
          Schedule complete for today! Great job.
        </div>
      )}

      <h3 className="schedule-section-title">Essentials</h3>
      {periods.map((period) => {
        const items = essentials.filter((i) => i.period === period);
        if (items.length === 0) return null;
        return (
          <div key={period} className="schedule-group">
            <span className="schedule-period">{period === 'Morning' ? '\u2600\uFE0F' : '\uD83C\uDF19'} {period}</span>
            <div className="schedule-list">{items.map(renderItem)}</div>
          </div>
        );
      })}

      <h3 className="schedule-section-title">
        Extras
        <span className={`extras-count ${extrasDone >= EXTRAS_PER_DAY_GOAL ? 'met' : ''}`}>
          {extrasDone} / {EXTRAS_PER_DAY_GOAL} goal
        </span>
      </h3>
      <div className="schedule-list">{extras.map(renderItem)}</div>

      <div className="tasks-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${(visibleCompleted.length / visibleItems.length) * 100}%`,
            }}
          />
        </div>
        <span className="progress-label">
          {visibleCompleted.length} / {visibleItems.length} done
        </span>
      </div>
    </div>
  );
}
