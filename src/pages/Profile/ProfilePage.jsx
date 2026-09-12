import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatTime } from '../../utils/time';
import { GeorgePopup } from '../../components/GeorgeRoast';
import { georgeRoasts, georgePhotos } from '../../data/georgeRoasts';
import { levelInfo } from '../../utils/xp';
import { currentHunger, moodFor, petChoices } from '../../data/pets';
import './Profile.css';

export default function ProfilePage() {
  const { state } = useApp();
  const [showReset, setShowReset] = useState(false);
  const [previewGeorge, setPreviewGeorge] = useState(false);
  const profile = state.profile;
  const lvl = levelInfo(state.xp);

  function handleReset() {
    localStorage.clear();
    window.location.reload();
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
          <span className="stat-value">Lv {lvl.level}</span>
          <span className="stat-label">{lvl.into.toLocaleString()} / {lvl.needed.toLocaleString()} XP</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {state.pet ? petChoices.find((p) => p.id === state.pet.type)?.emoji : '\uD83E\uDD5A'}
          </span>
          <span className="stat-label">
            {state.pet ? `${state.pet.name} · ${moodFor(currentHunger(state.pet)).label}` : 'No pet yet'}
          </span>
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
          <span className="detail-value">
            {{ regular: 'Works out regularly', moderate: 'Works out sometimes', none: 'Not really' }[profile.fitnessTier]
              ?? (profile.isAthletic ? 'Yes' : 'No')}
          </span>
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
          <span className="detail-label">Equipment</span>
          <span className="detail-value">
            {profile.equipment?.length
              ? profile.equipment
                  .map((e) => ({ 'pullup-bar': 'Pull-up bar', weights: 'Weights', bands: 'Bands' }[e]))
                  .join(', ')
              : 'None'}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Bedtime</span>
          <span className="detail-value">{formatTime(profile.bedtime)}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Wake up</span>
          <span className="detail-value">{formatTime(profile.wakeTime)}</span>
        </div>
      </div>

      {previewGeorge && (
        <GeorgePopup
          roast={georgeRoasts[Math.floor(Math.random() * georgeRoasts.length)]}
          photo={georgePhotos.length ? georgePhotos[0] : null}
          onClose={() => setPreviewGeorge(false)}
        />
      )}

      <button className="btn-secondary preview-george" onClick={() => setPreviewGeorge(true)}>
        Preview a George roast
      </button>

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
