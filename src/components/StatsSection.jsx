import React, { useEffect, useRef, useState } from 'react';

// Only figures the site itself backs up: founding year (company history),
// the places with our own properties and the projects documented on /projekte.
const STATS = [
  { value: new Date().getFullYear() - 1968, suffix: '', label: 'Jahre seit der Gründung 1968' },
  { value: 4, suffix: '', label: 'Orte mit eigenen Liegenschaften' },
  { value: 3, suffix: '', label: 'Wohnformen: Long Stay, Hotel, Ferienhaus' },
  { value: 5, suffix: '', label: 'Projekte mit 3D-Modell' },
];

function useCountUp(target, duration = 1500, started = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!started) return;
    let startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, started]);
  return count;
}

function StatCard({ value, suffix, label, started, last }) {
  const count = useCountUp(value, 1500, started);
  return (
    <div className={`flex flex-col items-center text-center px-8 py-10 ${!last ? 'border-r border-white/10' : ''}`}>
      <span className="font-display text-6xl md:text-7xl font-semibold text-white tabular-nums leading-none">
        {count}{suffix}
      </span>
      <span className="mt-3 text-white/75 text-[10px] font-semibold uppercase tracking-[0.22em]">
        {label}
      </span>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 divide-white/10">
          {STATS.map((s, i) => (
            <StatCard key={s.label} {...s} started={started} last={i === STATS.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
