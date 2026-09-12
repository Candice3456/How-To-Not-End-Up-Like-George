import { useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { shouldRoast } from '../utils/georgeCheck';
import { georgePhotos, georgeRoasts, georgeQuestion } from '../data/georgeRoasts';
import { todayKey } from '../utils/storage';
import './GeorgeRoast.css';

// Shows George once a day when the user has been skipping extras all week.
export default function GeorgeRoast() {
  const { state, dispatch } = useApp();

  const due =
    state.lastRoastDate !== todayKey() && shouldRoast(state.scheduleHistory);

  // Pick once per mount so the line doesn't change on re-render.
  const pick = useMemo(
    () => ({
      roast: georgeRoasts[Math.floor(Math.random() * georgeRoasts.length)],
      photo: georgePhotos.length
        ? georgePhotos[Math.floor(Math.random() * georgePhotos.length)]
        : null,
    }),
    []
  );

  // Mark as shown the moment it appears so a refresh doesn't re-roast.
  useEffect(() => {
    if (due) dispatch({ type: 'MARK_ROASTED' });
  }, [due, dispatch]);

  if (!due) return null;

  return <GeorgePopup roast={pick.roast} photo={pick.photo} />;
}

export function GeorgePopup({ roast, photo, onClose, penalty, question = georgeQuestion, closeLabel = 'No. Let me fix this.' }) {
  const { dispatch } = useApp();
  function close() {
    if (onClose) onClose();
    else dispatch({ type: 'MARK_ROASTED' });
  }
  return (
    <div className="george-overlay">
      <div className="george-card">
        {photo ? (
          <img className="george-photo" src={`/george/${photo}`} alt="George" />
        ) : (
          <div className="george-photo placeholder">
            <span>\uD83D\uDCF7</span>
            <span>Photo of George goes here</span>
          </div>
        )}
        <p className="george-roast">{roast}</p>
        {penalty && <p className="george-penalty">{penalty}</p>}
        <h3 className="george-question">{question}</h3>
        <button className="btn-primary" onClick={close}>
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
