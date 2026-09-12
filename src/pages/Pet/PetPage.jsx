import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  petChoices, foods, moodFor, currentHunger, emptySince,
  STARVING_HOURS_BEFORE_ROAST,
} from '../../data/pets';
import { GeorgePopup } from '../../components/GeorgeRoast';
import { georgePhotos, petRoasts, petQuestion } from '../../data/georgeRoasts';
import { todayKey } from '../../utils/storage';
import './Pet.css';

export default function PetPage() {
  const { state, dispatch } = useApp();
  const pet = state.pet;

  // Tick every minute so the bar drains while you watch.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!pet) return <ChoosePet onChoose={(p) => dispatch({ type: 'SET_PET', payload: p })} />;

  const hunger = currentHunger(pet, now);
  const mood = moodFor(hunger);
  const choice = petChoices.find((p) => p.id === pet.type) ?? petChoices[0];

  return (
    <div className="pet-page">
      <PetRoastCheck pet={pet} now={now} />

      <div className={`pet-stage ${mood.key}`}>
        <span className="pet-emoji">{choice.emoji}</span>
        <span className="pet-face">{mood.face}</span>
      </div>

      <h2 className="pet-name">{pet.name}</h2>
      <p className="pet-line">{pet.name} {mood.line}</p>

      <div className="hunger">
        <div className="hunger-head">
          <span>Hunger</span>
          <span className={`hunger-label ${mood.key}`}>{mood.label} · {Math.round(hunger)}%</span>
        </div>
        <div className="progress-bar">
          <div className={`progress-fill ${mood.key}`} style={{ width: `${hunger}%` }} />
        </div>
      </div>

      <h3 className="feed-title">Feed {pet.name}</h3>
      <div className="food-grid">
        {foods.map((food) => {
          const canAfford = state.coins >= food.cost;
          const full = hunger >= 100;
          return (
            <button
              key={food.id}
              className="food-card"
              disabled={!canAfford || full}
              onClick={() => dispatch({ type: 'FEED_PET', payload: { cost: food.cost, fill: food.fill, hunger } })}
            >
              <span className="food-emoji">{food.emoji}</span>
              <span className="food-name">{food.name}</span>
              <span className="food-fill">+{food.fill}%</span>
              <span className="food-cost"><span className="coin-icon">&#x1FA99;</span> {food.cost}</span>
            </button>
          );
        })}
      </div>
      {hunger >= 100 && <p className="pet-note">{pet.name} is completely full. Come back later!</p>}
      {hunger < 100 && state.coins < foods[0].cost && (
        <p className="pet-note">Not enough coins. Finish some tasks to feed {pet.name}.</p>
      )}
    </div>
  );
}

// Once a day, if the pet has been at zero for a full day, George appears.
function PetRoastCheck({ pet, now }) {
  const { state, dispatch } = useApp();
  const [show, setShow] = useState(false);
  const since = emptySince(pet, now);
  const starvedLongEnough =
    since !== null && now - since >= STARVING_HOURS_BEFORE_ROAST * 3_600_000;
  const due = starvedLongEnough && state.lastRoastDate !== todayKey();

  useEffect(() => {
    if (due) {
      dispatch({ type: 'MARK_ROASTED' });
      setShow(true);
    }
  }, [due, dispatch]);

  const roast = useMemo(
    () => petRoasts[Math.floor(Math.random() * petRoasts.length)].replaceAll('{pet}', pet.name),
    [pet.name]
  );

  if (!show) return null;
  return (
    <GeorgePopup
      roast={roast}
      photo={georgePhotos.length ? georgePhotos[Math.floor(Math.random() * georgePhotos.length)] : null}
      question={petQuestion}
      closeLabel="Feeding it right now."
      onClose={() => setShow(false)}
    />
  );
}

function ChoosePet({ onChoose }) {
  const [type, setType] = useState(null);
  const [name, setName] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!type || !name.trim()) return;
    onChoose({ type, name: name.trim(), hunger: 80, updatedAt: Date.now() });
  }

  return (
    <form className="pet-page choose-pet" onSubmit={submit}>
      <h2>Pick your pet</h2>
      <p className="pet-line">It eats the coins you earn. Skip your tasks and it goes hungry.</p>
      <div className="pet-choices">
        {petChoices.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`pet-choice ${type === p.id ? 'selected' : ''}`}
            onClick={() => setType(p.id)}
          >
            <span className="pet-choice-emoji">{p.emoji}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>
      <input
        className="field-input"
        placeholder="Name your pet"
        value={name}
        maxLength={20}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="btn-primary" type="submit" disabled={!type || !name.trim()}>
        Adopt
      </button>
    </form>
  );
}
