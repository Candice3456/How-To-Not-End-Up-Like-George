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
  const [isAthletic, setIsAthletic] = useState(null);
  const [fitness, setFitness] = useState({ pushups: '', situps: '', squats: '', pullups: '' });
  const [bedtime, setBedtime] = useState('22:00');

  // Steps: 0=name/email, 1=student, 2=athletic, 3=fitness (only if athletic), 4=bedtime
  const totalSteps = isAthletic ? 5 : 4;

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
    setStep(1);
  }

  function handleAthleticNext() {
    if (isAthletic) {
      setStep(3); // go to fitness questions
    } else {
      setStep(4); // skip to bedtime
    }
  }

  function handleBack() {
    if (step === 4 && !isAthletic) {
      setStep(2); // skip back over fitness step
    } else {
      setStep(step - 1);
    }
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
        fitnessLevel,
        bedtime,
      },
    });
  }

  function dotSteps() {
    // Show correct number of dots based on path
    return Array.from({ length: totalSteps }, (_, i) => i);
  }

  function currentDotIndex() {
    if (step <= 2) return step;
    if (step === 3) return 3; // fitness step (athletic only)
    return isAthletic ? 4 : 3; // bedtime
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
            <span key={s} className={`dot ${currentDotIndex() >= s ? 'active' : ''}`} />
          ))}
        </div>

        {step === 0 && (
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

        {step === 1 && (
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
              onClick={() => setStep(2)}
              disabled={isStudent === null}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <label className="field-label">Are you athletic?</label>
            <div className="choice-row">
              <button
                type="button"
                className={`choice-btn ${isAthletic === true ? 'selected' : ''}`}
                onClick={() => setIsAthletic(true)}
              >
                Yeah, I work out
              </button>
              <button
                type="button"
                className={`choice-btn ${isAthletic === false ? 'selected' : ''}`}
                onClick={() => setIsAthletic(false)}
              >
                Not really
              </button>
            </div>
            <button
              className="submit-btn"
              onClick={handleAthleticNext}
              disabled={isAthletic === null}
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
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

            <button className="submit-btn" onClick={() => setStep(4)}>
              Next
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="step-content">
            <label className="field-label">When do you usually go to sleep?</label>
            <input
              type="time"
              className="field-input time-input"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
            />
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
