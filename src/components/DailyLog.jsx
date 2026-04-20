import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import DatePicker from './DatePicker';
import './DailyLog.css';

const MONTHS = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December'];

export default function DailyLog() {
  const { habits, addHabit, deleteHabit, currentLog, saveLog, selectedDate } = useApp();

  const [habitChecks, setHabitChecks] = useState({});
  const [sleep, setSleep] = useState(7);
  const [water, setWater] = useState(6);
  const [newHabitName, setNewHabitName] = useState('');
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [saved, setSaved] = useState(false);
  const [score, setScore] = useState(0);

  // Reset form when date changes
  useEffect(() => {
    setHabitChecks(currentLog.habits || {});
    setSleep(currentLog.sleep ?? 7);
    setWater(currentLog.water ?? 6);
    setScore(currentLog.score ?? 0);
    setSaved(false);
  }, [selectedDate.year, selectedDate.month, selectedDate.day]);

  // Live score calc
  useEffect(() => {
    const habitCount = habits.length;
    if (habitCount === 0) { setScore(0); return; }
    const habitScore = habits.filter(h => habitChecks[h.id]).length / habitCount * 60;
    const sleepScore = Math.min(sleep / 8, 1) * 20;
    const waterScore = Math.min(water / 8, 1) * 20;
    setScore(Math.round(habitScore + sleepScore + waterScore));
  }, [habitChecks, sleep, water, habits]);

  function toggleHabit(id) {
    setHabitChecks(prev => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  }

  function handleSave() {
    saveLog(habitChecks, sleep, water);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleAddHabit() {
    if (!newHabitName.trim()) return;
    addHabit(newHabitName.trim());
    setNewHabitName('');
    setShowAddHabit(false);
  }

  const scoreColor = score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Low';
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (score / 100) * circumference;

  const { year, month, day } = selectedDate;
  const dayName = new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="daily-log fade-in">
      <div className="log-left">
        <DatePicker />

        {/* Score ring */}
        <div className="score-card">
          <div className="score-ring-wrap">
            <svg width="104" height="104" viewBox="0 0 104 104">
              <circle cx="52" cy="52" r="44" fill="none" stroke="var(--bg4)" strokeWidth="8" />
              <circle
                cx="52" cy="52" r="44" fill="none"
                stroke={scoreColor} strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 52 52)"
                style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.3s' }}
              />
            </svg>
            <div className="score-inner">
              <span className="score-num" style={{ color: scoreColor }}>{score}</span>
              <span className="score-sub">/ 100</span>
            </div>
          </div>
          <div className="score-meta">
            <span className="score-label-text" style={{ color: scoreColor }}>{scoreLabel}</span>
            <span className="score-date">{dayName}, {MONTHS[month]} {day}</span>
          </div>
        </div>
      </div>

      <div className="log-right">
        {/* Habits */}
        <div className="section-header">
          <span className="section-title">Habits</span>
          <button className="add-btn" onClick={() => setShowAddHabit(v => !v)}>
            {showAddHabit ? '✕ Cancel' : '+ Add habit'}
          </button>
        </div>

        {showAddHabit && (
          <div className="add-habit-row">
            <input
              className="habit-input"
              value={newHabitName}
              onChange={e => setNewHabitName(e.target.value)}
              placeholder="Habit name..."
              onKeyDown={e => e.key === 'Enter' && handleAddHabit()}
              autoFocus
            />
            <button className="confirm-btn" onClick={handleAddHabit}>Add</button>
          </div>
        )}

        <div className="habits-list">
          {habits.length === 0 && (
            <div className="empty-habits">No habits yet — add one above</div>
          )}
          {habits.map(h => (
            <div key={h.id} className={`habit-row ${habitChecks[h.id] ? 'checked' : ''}`}>
              <input
                type="checkbox"
                checked={!!habitChecks[h.id]}
                onChange={() => toggleHabit(h.id)}
                id={`habit-${h.id}`}
              />
              <label htmlFor={`habit-${h.id}`} className="habit-name">
                {h.name}
              </label>
              <button className="delete-habit-btn" onClick={() => deleteHabit(h.id)} title="Delete habit">
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Sleep */}
        <div className="section-header" style={{ marginTop: '20px' }}>
          <span className="section-title">Sleep & Water</span>
        </div>

        <div className="sliders-card">
          <div className="slider-block">
            <div className="slider-top">
              <span className="slider-icon">🌙</span>
              <span className="slider-label">Sleep</span>
              <span className="slider-val">{Number(sleep).toFixed(1)} <span className="slider-unit">hrs</span></span>
            </div>
            <input
              type="range" min="0" max="12" step="0.5"
              value={sleep}
              onChange={e => { setSleep(parseFloat(e.target.value)); setSaved(false); }}
              style={{ '--pct': `${(sleep / 12) * 100}%`, accentColor: '#818cf8' }}
            />
            <div className="slider-ticks">
              <span>0h</span><span>4h</span><span>8h</span><span>12h</span>
            </div>
          </div>

          <div className="slider-block">
            <div className="slider-top">
              <span className="slider-icon">💧</span>
              <span className="slider-label">Water</span>
              <span className="slider-val">{water} <span className="slider-unit">glasses</span></span>
            </div>
            <input
              type="range" min="0" max="12" step="1"
              value={water}
              onChange={e => { setWater(parseInt(e.target.value)); setSaved(false); }}
              style={{ accentColor: '#38bdf8' }}
            />
            <div className="slider-ticks">
              <span>0</span><span>4</span><span>8</span><span>12</span>
            </div>
          </div>
        </div>

        <button className={`save-log-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save log'}
        </button>
      </div>
    </div>
  );
}
