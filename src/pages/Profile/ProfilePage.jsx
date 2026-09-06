import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Profile.css';

export default function ProfilePage() {
  const { state, dispatch } = useApp();
  const [showReset, setShowReset] = useState(false);
  const profile = state.profile;

  function handleReset() {
    localStorage.clear();
    window.location.reload();
  }

  function formatBedtime(time) {
    if (!time) return 'Not set';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const display = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${display}:${m} ${ampm}`;
  }

  return (
    <div className="profile-page">
      <h2>Profile</h2>

      <div className="profile-card">
        <div className="profile-avatar">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <h3 className="profile-name">{profile.name}</h3>
        <p className="profile-email">{profile.email}</p>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">&#x1FA99; {state.coins}</span>
          <span className="stat-label">Coins</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{state.ownedTickets.length}</span>
          <span className="stat-label">Tickets</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{state.vocabLists.length}</span>
          <span className="stat-label">Custom Lists</span>
        </div>
      </div>

      <div className="profile-details">
        <div className="detail-row">
          <span className="detail-label">Student</span>
          <span className="detail-value">{profile.isStudent ? 'Yes' : 'No'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Athletic</span>
          <span className="detail-value">{profile.isAthletic ? 'Yes' : 'No'}</span>
        </div>
        {profile.isAthletic && profile.fitnessLevel && (
          <>
            <div className="detail-row">
              <span className="detail-label">Push-ups</span>
              <span className="detail-value">{profile.fitnessLevel.pushups}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Sit-ups</span>
              <span className="detail-value">{profile.fitnessLevel.situps}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Squats</span>
              <span className="detail-value">{profile.fitnessLevel.squats}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Pull-ups</span>
              <span className="detail-value">{profile.fitnessLevel.pullups}</span>
            </div>
          </>
        )}
        <div className="detail-row">
          <span className="detail-label">Bedtime</span>
          <span className="detail-value">{formatBedtime(profile.bedtime)}</span>
        </div>
      </div>

      <div className="profile-danger">
        {!showReset ? (
          <button className="btn-danger" onClick={() => setShowReset(true)}>
            Reset All Data
          </button>
        ) : (
          <div className="reset-confirm">
            <p>This will delete all your data — coins, lists, tickets, everything. Are you sure?</p>
            <div className="reset-actions">
              <button className="btn-secondary" onClick={() => setShowReset(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleReset}>
                Yes, Reset Everything
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
