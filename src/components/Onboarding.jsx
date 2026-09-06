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
  const [bedtime, setBedtime] = useState('22:00');

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

  function handleSubmit() {
    dispatch({
      type: 'SET_PROFILE',
      payload: {
        name: name.trim(),
        email: email.trim(),
        isStudent,
        isAthletic,
        bedtime,
      },
    });
  }

  return (
    <div className="onboarding">
      <div className="onboarding-card">
        <h1>Welcome!</h1>
        <p className="onboarding-subtitle">
          Let's make sure you don't end up like George.
        </p>

        <div className="step-dots">
          {[0, 1, 2, 3].map((s) => (
            <span key={s} className={`dot ${step >= s ? 'active' : ''}`} />
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
              onClick={() => setStep(3)}
              disabled={isAthletic === null}
            >
              Next
            </button>
          </div>
        )}

        {step === 3 && (
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
          <button className="back-link" onClick={() => setStep(step - 1)}>
            &larr; Back
          </button>
        )}
      </div>
    </div>
  );
}
