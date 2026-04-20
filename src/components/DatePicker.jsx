import React from 'react';
import { useApp } from '../context/AppContext';
import './DatePicker.css';

const MONTHS = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December'];

export default function DatePicker() {
  const { selectedDate, setSelectedDate, logs } = useApp();
  const { year, month, day } = selectedDate;

  const today = new Date();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0

  function prevMonth() {
    if (month === 0) setSelectedDate(p => ({ ...p, month: 11, year: p.year - 1, day: 1 }));
    else setSelectedDate(p => ({ ...p, month: p.month - 1, day: 1 }));
  }
  function nextMonth() {
    if (month === 11) setSelectedDate(p => ({ ...p, month: 0, year: p.year + 1, day: 1 }));
    else setSelectedDate(p => ({ ...p, month: p.month + 1, day: 1 }));
  }
  function setYear(delta) {
    setSelectedDate(p => ({ ...p, year: p.year + delta }));
  }

  function selectDay(d) {
    setSelectedDate(p => ({ ...p, day: d }));
  }

  function dateKey(d) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  function isToday(d) {
    return year === today.getFullYear() && month === today.getMonth() && d === today.getDate();
  }

  // Build calendar grid
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="datepicker">
      <div className="dp-header">
        <div className="dp-year-nav">
          <button className="dp-nav-btn" onClick={() => setYear(-1)}>‹</button>
          <span className="dp-year">{year}</span>
          <button className="dp-nav-btn" onClick={() => setYear(1)}>›</button>
        </div>
        <div className="dp-month-nav">
          <button className="dp-nav-btn" onClick={prevMonth}>‹</button>
          <span className="dp-month-name">{MONTHS[month]}</span>
          <button className="dp-nav-btn" onClick={nextMonth}>›</button>
        </div>
      </div>

      <div className="dp-day-labels">
        {['M','T','W','T','F','S','S'].map((l, i) => (
          <span key={i} className="dp-day-label">{l}</span>
        ))}
      </div>

      <div className="dp-grid">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} className="dp-cell empty" />;
          const k = dateKey(d);
          const logged = !!logs[k];
          const score = logs[k]?.score || 0;
          const isSelected = d === day;
          const todayMark = isToday(d);
          return (
            <button
              key={d}
              onClick={() => selectDay(d)}
              className={`dp-cell${isSelected ? ' selected' : ''}${todayMark ? ' today' : ''}${logged ? ' logged' : ''}`}
              title={logged ? `Score: ${score}` : 'No log'}
            >
              <span className="dp-cell-num">{d}</span>
              {logged && (
                <span
                  className="dp-dot"
                  style={{ background: score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
