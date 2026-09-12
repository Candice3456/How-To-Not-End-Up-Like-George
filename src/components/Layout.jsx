import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import GeorgeRoast from './GeorgeRoast';
import { levelInfo } from '../utils/xp';
import { petChoices } from '../data/pets';
import './Layout.css';

export default function Layout() {
  const { state } = useApp();
  const navigate = useNavigate();
  const { level, into, needed } = levelInfo(state.xp);

  return (
    <div className="app-layout">
      <GeorgeRoast />
      <header className="app-header">
        <h1 className="app-title">Don't Be George</h1>
        <div className="header-right">
          <div className="level-badge" title={`${into.toLocaleString()} / ${needed.toLocaleString()} XP`}>
            <span className="level-label">Lv {level}</span>
            <div className="level-bar">
              <div className="level-fill" style={{ width: `${(into / needed) * 100}%` }} />
            </div>
          </div>
          <div className="coin-display">
            <span className="coin-icon">&#x1FA99;</span>
            <span className="coin-count">{state.coins}</span>
          </div>
          <button className="profile-btn" onClick={() => navigate('/profile')}>
            {state.profile?.name?.charAt(0)?.toUpperCase() || '?'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink to="/quiz" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">&#x1F4DA;</span>
          <span className="nav-label">Quiz</span>
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">&#x1F4AA;</span>
          <span className="nav-label">Tasks</span>
        </NavLink>
        <NavLink to="/schedule" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">&#x1F4C5;</span>
          <span className="nav-label">Schedule</span>
        </NavLink>
        <NavLink to="/pet" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">{state.pet ? petChoices.find((p) => p.id === state.pet.type)?.emoji : '\uD83E\uDD5A'}</span>
          <span className="nav-label">Pet</span>
        </NavLink>
      </nav>
    </div>
  );
}
