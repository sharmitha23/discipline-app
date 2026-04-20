import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import DailyLog from './components/DailyLog';
import Analytics from './components/Analytics';
import Landing from './components/Landing';
import './App.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
      {theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

function AppInner() {
  const [page, setPage] = useState('log');
  const [showLanding, setShowLanding] = useState(true);

  if (showLanding) {
    return <Landing onGetStarted={() => setShowLanding(false)} />;
  }

  return (
    <AppProvider>
      <div className="app-shell">
        <nav className="topnav">
          <div className="brand" onClick={() => setShowLanding(true)} style={{ cursor: 'pointer' }}>
            <span className="brand-icon">◈</span>
            <span className="brand-name">Dayo</span>
          </div>
          <div className="nav-tabs">
            <button className={`nav-tab ${page === 'log' ? 'active' : ''}`} onClick={() => setPage('log')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Daily log
            </button>
            <button className={`nav-tab ${page === 'analytics' ? 'active' : ''}`} onClick={() => setPage('analytics')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              Analytics
            </button>
          </div>
          <ThemeToggle />
        </nav>
        <main className="main-content">
          {page === 'log' ? <DailyLog /> : <Analytics />}
        </main>
      </div>
    </AppProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
