import React, { useEffect, useRef } from 'react';
import './Landing.css';

const features = [
  {
    icon: '☑',
    title: 'Daily habit tracking',
    desc: 'Check off your habits every day. Add, remove and customise your list anytime.'
  },
  {
    icon: '◎',
    title: 'Discipline score',
    desc: 'Every day gets a score based on your habits, sleep and water. See it grow over time.'
  },
  {
    icon: '▦',
    title: 'GitHub-style heatmap',
    desc: 'A full-year view of your consistency. The more you show up, the brighter it glows.'
  },
  {
    icon: '↗',
    title: 'Trend analytics',
    desc: 'Weekly, monthly and yearly charts show exactly where your discipline is heading.'
  },
  {
    icon: '🌙',
    title: 'Sleep & water tracking',
    desc: 'Log your sleep and hydration daily. Line charts show your patterns over the month.'
  },
  {
    icon: '◑',
    title: 'Light & dark mode',
    desc: 'Your dashboard, your way. Switch between light and dark with one tap.'
  },
];

const steps = [
  { num: '01', title: 'Pick your habits', desc: 'Add the habits that matter to you. No templates, no pressure — just yours.' },
  { num: '02', title: 'Log every day', desc: 'Open Dayo, check off what you did, slide your sleep and water. Takes 30 seconds.' },
  { num: '03', title: 'Watch the pattern', desc: 'Your heatmap fills up. Your score climbs. The streak speaks for itself.' },
];

export default function Landing({ onGetStarted }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="landing" data-theme="light">

      {/* NAV */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <span className="landing-brand-icon">◈</span>
            <span className="landing-brand-name">Dayo</span>
          </div>
          <button className="landing-cta-small" onClick={onGetStarted}>
            Get started →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <div className="hero-inner">
          <div className="hero-badge">Habit tracker · Discipline dashboard</div>
          <h1 className="hero-headline">
            For the ones<br />who show up.
          </h1>
          <p className="hero-sub">
            Dayo helps you build real discipline — one logged day at a time.<br />
            Track habits, score your day, and watch your consistency compound.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={onGetStarted}>Start for free</button>
            <span className="hero-note">No sign up needed right now · Your data stays local</span>
          </div>

          {/* Mini heatmap preview */}
          <div className="hero-heatmap">
            {Array.from({ length: 7 * 22 }).map((_, i) => {
              const rand = Math.sin(i * 9.7 + 3) * 0.5 + 0.5;
              const level = rand > 0.85 ? 4 : rand > 0.65 ? 3 : rand > 0.4 ? 2 : rand > 0.2 ? 1 : 0;
              return <div key={i} className={`hm-cell hm-${level}`} />;
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-inner">
          <div className="section-tag reveal">Everything you need</div>
          <h2 className="section-heading reveal">Built for daily use.<br />Designed to last.</h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card reveal" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="section-inner">
          <div className="section-tag reveal">How it works</div>
          <h2 className="section-heading reveal">Three steps.<br />That's it.</h2>
          <div className="steps">
            {steps.map((s, i) => (
              <div className="step reveal" key={i}>
                <span className="step-num">{s.num}</span>
                <div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-section">
        <div className="section-inner">
          <div className="cta-card reveal">
            <h2 className="cta-heading">Your streak starts today.</h2>
            <p className="cta-sub">Join Dayo and build the discipline you've always wanted.</p>
            <button className="btn-primary btn-large" onClick={onGetStarted}>Open Dayo →</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-nav-inner">
          <span className="landing-brand">
            <span className="landing-brand-icon">◈</span>
            <span className="landing-brand-name">Dayo</span>
          </span>
          <span className="footer-tagline">For the ones who show up.</span>
        </div>
      </footer>

    </div>
  );
}
