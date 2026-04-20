import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { useApp } from '../context/AppContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const MONTHS = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December'];

function lineOpts(color, maxY, unit) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a1a',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#f0ede8',
        bodyColor: '#888',
        callbacks: { label: ctx => ` ${ctx.parsed.y} ${unit}` }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#555', font: { family: "'DM Sans'", size: 11 } },
        border: { color: 'rgba(255,255,255,0.06)' },
      },
      y: {
        min: 0, max: maxY,
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#555', font: { family: "'DM Sans'", size: 11 }, stepSize: maxY / 4 },
        border: { color: 'rgba(255,255,255,0.06)' },
      }
    }
  };
}

export default function SlWaterCharts({ year, month }) {
  const { getSlWaterMonth } = useApp();
  const { labels, sleep, water } = getSlWaterMonth(year, month);

  const noData = labels.length === 0;

  const sleepData = {
    labels,
    datasets: [{
      data: sleep,
      borderColor: '#818cf8',
      backgroundColor: 'rgba(129,140,248,0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#818cf8',
      pointBorderColor: 'var(--bg2)',
      pointBorderWidth: 2,
      borderWidth: 2,
    }]
  };

  const waterData = {
    labels,
    datasets: [{
      data: water,
      borderColor: '#38bdf8',
      backgroundColor: 'rgba(56,189,248,0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#38bdf8',
      pointBorderColor: 'var(--bg2)',
      pointBorderWidth: 2,
      borderWidth: 2,
    }]
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      <div className="chart-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px' }}>🌙</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#818cf8' }}>Sleep — hrs/day</span>
        </div>
        {noData ? (
          <div className="no-data">No data for {MONTHS[month]}</div>
        ) : (
          <div style={{ position: 'relative', height: '160px' }}>
            <Line key={`sleep-${year}-${month}`} data={sleepData} options={lineOpts('#818cf8', 12, 'hrs')} />
          </div>
        )}
      </div>

      <div className="chart-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px' }}>💧</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#38bdf8' }}>Water — glasses/day</span>
        </div>
        {noData ? (
          <div className="no-data">No data for {MONTHS[month]}</div>
        ) : (
          <div style={{ position: 'relative', height: '160px' }}>
            <Line key={`water-${year}-${month}`} data={waterData} options={lineOpts('#38bdf8', 12, 'glasses')} />
          </div>
        )}
      </div>
    </div>
  );
}
