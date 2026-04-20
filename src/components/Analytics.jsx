import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import HeatmapChart from './HeatmapChart';
import HabitCharts from './HabitCharts';
import SlWaterCharts from './SlWaterCharts';
import './Analytics.css';

const MONTHS = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December'];

export default function Analytics() {
  const { selectedDate, setSelectedDate } = useApp();
  const { year, month } = selectedDate;

  function prevMonth() {
    if (month === 0) setSelectedDate(p => ({ ...p, month: 11, year: p.year - 1 }));
    else setSelectedDate(p => ({ ...p, month: p.month - 1 }));
  }
  function nextMonth() {
    if (month === 11) setSelectedDate(p => ({ ...p, month: 0, year: p.year + 1 }));
    else setSelectedDate(p => ({ ...p, month: p.month + 1 }));
  }
  function setYear(delta) {
    setSelectedDate(p => ({ ...p, year: p.year + delta }));
  }

  return (
    <div className="analytics fade-in">
      {/* Month/year picker */}
      <div className="analytics-header">
        <h1 className="analytics-title">Analytics</h1>
        <div className="analytics-date-nav">
          <div className="ana-year-nav">
            <button className="ana-nav-btn" onClick={() => setYear(-1)}>‹</button>
            <span className="ana-year">{year}</span>
            <button className="ana-nav-btn" onClick={() => setYear(1)}>›</button>
          </div>
          <div className="ana-month-nav">
            <button className="ana-nav-btn" onClick={prevMonth}>‹</button>
            <span className="ana-month-name">{MONTHS[month]}</span>
            <button className="ana-nav-btn" onClick={nextMonth}>›</button>
          </div>
        </div>
      </div>

      {/* Yearly heatmap */}
      <section className="analytics-section">
        <div className="section-label">Discipline heatmap — {year}</div>
        <HeatmapChart year={year} />
      </section>

      {/* Habit charts */}
      <section className="analytics-section">
        <div className="section-label">Habit completion</div>
        <HabitCharts year={year} month={month} />
      </section>

      {/* Sleep & Water */}
      <section className="analytics-section">
        <div className="section-label">Sleep & water — {MONTHS[month]}</div>
        <SlWaterCharts year={year} month={month} />
      </section>
    </div>
  );
}
