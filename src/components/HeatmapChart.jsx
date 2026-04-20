import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { useApp } from '../context/AppContext';

export default function HeatmapChart({ year }) {
  const { getYearHeatmap } = useApp();
  const data = getYearHeatmap(year);
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={data}
        classForValue={(val) => {
          if (!val || val.count === 0) return 'color-empty';
          return `color-scale-${val.count}`;
        }}
        tooltipDataAttrs={(val) => {
          if (!val || !val.date) return {};
          return { 'data-tip': `${val.date}: score level ${val.count}` };
        }}
        showWeekdayLabels={true}
        gutterSize={2}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '11px', color: 'var(--text3)', justifyContent: 'flex-end' }}>
        <span>Less</span>
        {['var(--bg4)', '#1e3a5f', '#1e4d9e', '#2563eb', '#60a5fa'].map((c, i) => (
          <div key={i} style={{ width: 11, height: 11, borderRadius: 2, background: c, border: i === 0 ? '1px solid var(--border)' : 'none' }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
