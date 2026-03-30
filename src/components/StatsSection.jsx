import React, { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 25,  suffix: '+', label: 'Jahre Erfahrung' },
  { value: 200, suffix: '+', label: 'Objekte verwaltet' },
  { value: 500, suffix: '+', label: 'Zufriedene Kunden' },
  { value: 4,   suffix: '',  label: 'Standorte Schweiz' },
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
      <span className="text-5xl md:text-6xl font-black text-white tabular-nums leading-none">
        {count}{suffix}
      </span>
      <span className="mt-3 text-white/40 text-[10px] font-medium uppercase tracking-[0.2em]">
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
