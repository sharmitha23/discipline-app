import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { useApp } from '../context/AppContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function barOptions(horizontal) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a1a',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#f0ede8',
        bodyColor: '#888',
        callbacks: { label: ctx => ` ${ctx.parsed[horizontal ? 'x' : 'y']}%` }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#666', font: { family: "'DM Sans'", size: 11 }, maxRotation: 35 },
        border: { color: 'rgba(255,255,255,0.06)' },
        max: horizontal ? 100 : undefined,
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#666', font: { family: "'DM Sans'", size: 11 } },
        border: { color: 'rgba(255,255,255,0.06)' },
        max: horizontal ? undefined : 100,
        min: 0,
      }
    }
  };
}

export default function HabitCharts({ year, month }) {
  const { habits, logs, getWeeklyData, getHabitMonthStats } = useApp();
  const [tab, setTab] = useState('monthly');

  // Monthly: habit completion % for selected month
  function monthlyData() {
    const stats = getHabitMonthStats(year, month);
    return {
      labels: stats.map(s => s.name.length > 14 ? s.name.slice(0, 13) + '…' : s.name),
      datasets: [{
        data: stats.map(s => s.pct),
        backgroundColor: stats.map(s => s.pct >= 80 ? '#2563eb' : s.pct >= 50 ? '#3b82f6' : '#1e3a5f'),
        borderRadius: 5,
        borderSkipped: false,
      }]
    };
  }

  // Weekly: avg score per week of month
  function weeklyData() {
    const weeks = getWeeklyData(year, month);
    return {
      labels: weeks.map(w => w.label),
      datasets: [{
        data: weeks.map(w => w.avg),
        backgroundColor: '#2563eb',
        borderRadius: 5,
        borderSkipped: false,
      }]
    };
  }

  // Yearly: habit completion % per month
  function yearlyData() {
    const habitCompletionByMonth = MONTHS.map((_, m) => {
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      let total = 0, completed = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const k = `${year}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        if (logs[k]) {
          const habitVals = Object.values(logs[k].habits || {});
          total += habitVals.length;
          completed += habitVals.filter(Boolean).length;
        }
      }
      return total > 0 ? Math.round(completed / total * 100) : 0;
    });
    return {
      labels: MONTHS,
      datasets: [{
        data: habitCompletionByMonth,
        backgroundColor: habitCompletionByMonth.map(v => v >= 80 ? '#2563eb' : v >= 50 ? '#3b82f6' : '#1e3a5f'),
        borderRadius: 5,
        borderSkipped: false,
      }]
    };
  }

  const chartData = tab === 'monthly' ? monthlyData() : tab === 'weekly' ? weeklyData() : yearlyData();
  const isMonthly = tab === 'monthly';
  const height = isMonthly ? Math.max(180, habits.length * 40 + 60) : 220;

  return (
    <div className="chart-card">
      <div className="chart-tabs">
        <button className={`chart-tab ${tab === 'weekly' ? 'active' : ''}`} onClick={() => setTab('weekly')}>Weekly</button>
        <button className={`chart-tab ${tab === 'monthly' ? 'active' : ''}`} onClick={() => setTab('monthly')}>Monthly</button>
        <button className={`chart-tab ${tab === 'yearly' ? 'active' : ''}`} onClick={() => setTab('yearly')}>Yearly</button>
      </div>
      {habits.length === 0 ? (
        <div className="no-data">No habits to display</div>
      ) : (
        <div style={{ position: 'relative', width: '100%', height }}>
          <Bar
            key={tab + year + month}
            data={chartData}
            options={barOptions(isMonthly)}
          />
        </div>
      )}
    </div>
  );
}
