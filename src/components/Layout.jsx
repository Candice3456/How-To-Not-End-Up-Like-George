import { NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Layout.css';

export default function Layout() {
  const { state } = useApp();

  return (
    <div className="app-layout">
      <header className="app-header">
        <h1 className="app-title">Don't Be George</h1>
        <div className="coin-display">
          <span className="coin-icon">&#x1FA99;</span>
          <span className="coin-count">{state.coins}</span>
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
        <NavLink to="/rewards" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">&#x1F3C6;</span>
          <span className="nav-label">Rewards</span>
        </NavLink>
      </nav>
    </div>
  );
}
