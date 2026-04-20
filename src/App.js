import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import DailyLog from './components/DailyLog';
import Analytics from './components/Analytics';
import './App.css';

export default function App() {
  const [page, setPage] = useState('log');

  return (
    <AppProvider>
      <div className="app-shell">
        <nav className="topnav">
          <div className="brand">
            <span className="brand-icon">◈</span>
            <span className="brand-name">Discipline</span>
          </div>
          <div className="nav-tabs">
            <button className={`nav-tab ${page === 'log' ? 'active' : ''}`} onClick={() => setPage('log')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Daily log
            </button>
            <button className={`nav-tab ${page === 'analytics' ? 'active' : ''}`} onClick={() => setPage('analytics')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Analytics
            </button>
          </div>
        </nav>
        <main className="main-content">
          {page === 'log' ? <DailyLog /> : <Analytics />}
        </main>
      </div>
    </AppProvider>
  );
}
