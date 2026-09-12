import { useState } from 'react';
import { useApp } from '../context/AppContext';
import './Onboarding.css';

export default function Onboarding() {
  const { dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isStudent, setIsStudent] = useState(null);
  // 'regular' | 'moderate' | 'none'
  const [fitnessTier, setFitnessTier] = useState(null);
  const [fitness, setFitness] = useState({ pushups: '', situps: '', squats: '', pullups: '' });
  const [bedtime, setBedtime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  // Array of equipment ids; empty means bodyweight only.
  const [equipment, setEquipment] = useState([]);

  // Anyone who works out at all gets the fitness numbers step.
  const isAthletic = fitnessTier !== null && fitnessTier !== 'none';

  // Named steps so we can insert/skip without renumbering everything.
  const steps = [
    'account',
    'student',
    'tier',
    ...(isAthletic ? ['fitness'] : []),
    'equipment',
    'sleep',
  ];
  const stepKey = steps[step];
  const totalSteps = steps.length;

  function goNext() {
    setStep(Math.min(step + 1, totalSteps - 1));
  }

  function validateEmail(value) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  }

  function handleEmailNext() {
    if (!name.trim()) return;
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    goNext();
  }

  function handleBack() {
    setStep(Math.max(step - 1, 0));
  }

  function toggleEquipment(id) {
    if (id === 'none') {
      setEquipment([]);
      return;
    }
    setEquipment(
      equipment.includes(id) ? equipment.filter((e) => e !== id) : [...equipment, id]
    );
  }

  function handleSubmit() {
    const fitnessLevel = isAthletic
      ? {
          pushups: parseInt(fitness.pushups) || 0,
          situps: parseInt(fitness.situps) || 0,
          squats: parseInt(fitness.squats) || 0,
          pullups: parseInt(fitness.pullups) || 0,
        }
      : null;

    dispatch({
      type: 'SET_PROFILE',
      payload: {
        name: name.trim(),
        email: email.trim(),
        isStudent,
        isAthletic,
        fitnessTier,
        fitnessLevel,
        equipment,
        bedtime,
        wakeTime,
      },
    });
  }

  function dotSteps() {
    return Array.from({ length: totalSteps }, (_, i) => i);
  }

  return (
    <div className="onboarding">
      <div className="onboarding-card">
        <h1>Welcome!</h1>
        <p className="onboarding-subtitle">
          Let's make sure you don't end up like George.
        </p>

        <div className="step-dots">
          {dotSteps().map((s) => (
            <span key={s} className={`dot ${step >= s ? 'active' : ''}`} />
          ))}
        </div>

        {stepKey === 'account' && (
          <div className="step-content">
            <label className="field-label">What's your name?</label>
            <input
              type="text"
              className="field-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />

            <label className="field-label">Email address</label>
            <input
              type="email"
              className="field-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
            />
            {emailError && <p className="field-error">{emailError}</p>}

            <button
              className="submit-btn"
              onClick={handleEmailNext}
              disabled={!name.trim() || !email.trim()}
            >
              Next
            </button>
          </div>
        )}

        {stepKey === 'student' && (
          <div className="step-content">
            <label className="field-label">Are you a student?</label>
            <div className="choice-row">
              <button
                type="button"
                className={`choice-btn ${isStudent === true ? 'selected' : ''}`}
                onClick={() => setIsStudent(true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`choice-btn ${isStudent === false ? 'selected' : ''}`}
                onClick={() => setIsStudent(false)}
              >
                Nope
              </button>
            </div>
            <button
              className="submit-btn"
              onClick={goNext}
              disabled={isStudent === null}
            >
              Next
            </button>
          </div>
        )}

        {stepKey === 'tier' && (
          <div className="step-content">
            <label className="field-label">How often do you work out?</label>
            <div className="choice-row stacked">
              {[
                { value: 'regular', label: 'Regularly', hint: 'Several times a week' },
                { value: 'moderate', label: 'Kind of / sometimes', hint: 'On and off, when I feel like it' },
                { value: 'none', label: 'Not really', hint: 'Start me off easy' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`choice-btn ${fitnessTier === opt.value ? 'selected' : ''}`}
                  onClick={() => setFitnessTier(opt.value)}
                >
                  <span className="choice-label">{opt.label}</span>
                  <span className="choice-hint">{opt.hint}</span>
                </button>
              ))}
            </div>
            <button
              className="submit-btn"
              onClick={goNext}
              disabled={fitnessTier === null}
            >
              Next
            </button>
          </div>
        )}

        {stepKey === 'fitness' && (
          <div className="step-content">
            <label className="field-label">How many can you do in one set?</label>
            <p className="field-hint">Rough numbers are fine — this helps us tailor your tasks.</p>

            <div className="fitness-grid">
              <div className="fitness-field">
                <label className="fitness-label">Push-ups</label>
                <input
                  type="number"
                  className="field-input"
                  placeholder="0"
                  min="0"
                  value={fitness.pushups}
                  onChange={(e) => setFitness({ ...fitness, pushups: e.target.value })}
                />
              </div>
              <div className="fitness-field">
                <label className="fitness-label">Sit-ups</label>
                <input
                  type="number"
                  className="field-input"
                  placeholder="0"
                  min="0"
                  value={fitness.situps}
                  onChange={(e) => setFitness({ ...fitness, situps: e.target.value })}
                />
              </div>
              <div className="fitness-field">
                <label className="fitness-label">Squats</label>
                <input
                  type="number"
                  className="field-input"
                  placeholder="0"
                  min="0"
                  value={fitness.squats}
                  onChange={(e) => setFitness({ ...fitness, squats: e.target.value })}
                />
              </div>
              <div className="fitness-field">
                <label className="fitness-label">Pull-ups</label>
                <input
                  type="number"
                  className="field-input"
                  placeholder="0"
                  min="0"
                  value={fitness.pullups}
                  onChange={(e) => setFitness({ ...fitness, pullups: e.target.value })}
                />
              </div>
            </div>

            <button className="submit-btn" onClick={goNext}>
              Next
            </button>
          </div>
        )}

        {stepKey === 'equipment' && (
          <div className="step-content">
            <label className="field-label">Got any equipment at home?</label>
            <p className="field-hint">Pick everything you have. We'll only give you exercises you can actually do.</p>
            <div className="choice-row stacked">
              {[
                { id: 'pullup-bar', label: 'Pull-up bar', emoji: '\uD83E\uDD38' },
                { id: 'weights', label: 'Dumbbells / weights', emoji: '\uD83C\uDFCB\uFE0F' },
                { id: 'bands', label: 'Resistance bands', emoji: '\uD83E\uDE80' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`choice-btn ${equipment.includes(opt.id) ? 'selected' : ''}`}
                  onClick={() => toggleEquipment(opt.id)}
                >
                  <span className="choice-label">{opt.emoji} {opt.label}</span>
                </button>
              ))}
              <button
                type="button"
                className={`choice-btn ${equipment.length === 0 ? 'selected' : ''}`}
                onClick={() => toggleEquipment('none')}
              >
                <span className="choice-label">Nothing, just me</span>
              </button>
            </div>
            <button className="submit-btn" onClick={goNext}>
              Next
            </button>
          </div>
        )}

        {stepKey === 'sleep' && (
          <div className="step-content">
            <label className="field-label">What's your sleep schedule?</label>
            <div className="time-row">
              <div className="time-field">
                <span className="fitness-label">Bedtime</span>
                <input
                  type="time"
                  className="field-input time-input"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                />
              </div>
              <div className="time-field">
                <span className="fitness-label">Wake up</span>
                <input
                  type="time"
                  className="field-input time-input"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                />
              </div>
            </div>
            <button className="submit-btn" onClick={handleSubmit}>
              Let's Go!
            </button>
          </div>
        )}

        {step > 0 && (
          <button className="back-link" onClick={handleBack}>
            &larr; Back
          </button>
        )}
      </div>
    </div>
  );
}
