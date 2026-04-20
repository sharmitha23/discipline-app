import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

const DEFAULT_HABITS = [
  { id: 'h1', name: 'Morning workout' },
  { id: 'h2', name: 'Read 30 min' },
  { id: 'h3', name: 'Meditate' },
  { id: 'h4', name: 'No social media' },
  { id: 'h5', name: 'Journal' },
];

function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function todayKey() {
  const d = new Date();
  return dateKey(d.getFullYear(), d.getMonth(), d.getDate());
}

export function AppProvider({ children }) {
  const [habits, setHabits] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dd_habits')) || DEFAULT_HABITS; } catch { return DEFAULT_HABITS; }
  });

  // logs: { [dateKey]: { habits: {id: bool}, sleep: number, water: number, score: number } }
  const [logs, setLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('dd_logs')) || {}; } catch { return {}; }
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
  });

  useEffect(() => { localStorage.setItem('dd_habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('dd_logs', JSON.stringify(logs)); }, [logs]);

  const key = dateKey(selectedDate.year, selectedDate.month, selectedDate.day);

  const currentLog = logs[key] || { habits: {}, sleep: 7, water: 6, score: 0 };

  function calcScore(habitChecks, sleep, water) {
    const habitCount = habits.length;
    if (habitCount === 0) return 0;
    const habitScore = habits.filter(h => habitChecks[h.id]).length / habitCount * 60;
    const sleepScore = Math.min(sleep / 8, 1) * 20;
    const waterScore = Math.min(water / 8, 1) * 20;
    return Math.round(habitScore + sleepScore + waterScore);
  }

  function saveLog(habitChecks, sleep, water) {
    const score = calcScore(habitChecks, sleep, water);
    setLogs(prev => ({ ...prev, [key]: { habits: habitChecks, sleep, water, score } }));
    return score;
  }

  function addHabit(name) {
    const id = 'h' + Date.now();
    setHabits(prev => [...prev, { id, name }]);
  }

  function deleteHabit(id) {
    setHabits(prev => prev.filter(h => h.id !== id));
  }

  // Get all days in a month with scores
  function getMonthData(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const k = dateKey(year, month, i + 1);
      return { day: i + 1, date: k, score: logs[k]?.score || 0, logged: !!logs[k] };
    });
  }

  // Get all weeks in a month (Mon–Sun)
  function getWeeklyData(year, month) {
    const monthData = getMonthData(year, month);
    const weeks = [];
    let week = [];
    const firstDay = new Date(year, month, 1).getDay();
    const offset = (firstDay + 6) % 7; // Mon=0
    for (let i = 0; i < offset; i++) week.push(null);
    monthData.forEach(d => {
      week.push(d);
      if (week.length === 7) { weeks.push(week); week = []; }
    });
    if (week.length > 0) weeks.push(week);
    return weeks.map((w, i) => ({
      label: `W${i + 1}`,
      avg: Math.round(w.filter(Boolean).reduce((s, d) => s + d.score, 0) / Math.max(w.filter(Boolean).length, 1))
    }));
  }

  // Heatmap: full year data
  function getYearHeatmap(year) {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    const result = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const k = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      result.push({ date: k, count: logs[k] ? Math.ceil(logs[k].score / 25) : 0 });
    }
    return result;
  }

  // Habit completion for the month
  function getHabitMonthStats(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return habits.map(h => {
      let count = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const k = dateKey(year, month, d);
        if (logs[k]?.habits?.[h.id]) count++;
      }
      const loggedDays = Object.keys(logs).filter(k => k.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)).length;
      return { name: h.name, count, total: Math.max(loggedDays, 1), pct: loggedDays ? Math.round(count / loggedDays * 100) : 0 };
    });
  }

  // Sleep/water line data for a month
  function getSlWaterMonth(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const labels = [], sleep = [], water = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const k = dateKey(year, month, d);
      if (logs[k]) {
        labels.push(d);
        sleep.push(logs[k].sleep);
        water.push(logs[k].water);
      }
    }
    return { labels, sleep, water };
  }

  return (
    <AppContext.Provider value={{
      habits, addHabit, deleteHabit,
      logs, saveLog, currentLog,
      selectedDate, setSelectedDate,
      calcScore,
      getMonthData, getWeeklyData, getYearHeatmap,
      getHabitMonthStats, getSlWaterMonth,
      todayKey
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext); }
