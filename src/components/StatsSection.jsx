import React, { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 25, suffix: '+', label: 'Jahre Erfahrung' },
  { value: 200, suffix: '+', label: 'Objekte verwaltet' },
  { value: 500, suffix: '+', label: 'Zufriedene Kunden' },
  { value: 4, suffix: '', label: 'Standorte in der Schweiz' },
];

function useCountUp(target, duration = 1500, started = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!started) return;
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, started]);

  return count;
}

function StatCard({ value, suffix, label, started }) {
  const count = useCountUp(value, 1500, started);

  return (
    <div className="flex flex-col items-center text-center px-6 py-8">
      <span className="text-5xl md:text-6xl font-black text-white tabular-nums leading-none">
        {count}{suffix}
      </span>
      <span className="mt-3 text-gray-400 text-sm font-medium uppercase tracking-widest leading-snug">
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-gray-900 py-16 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-800 border border-gray-800 rounded-2xl overflow-hidden">
          {STATS.map((stat) => (
            <StatCard
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              started={started}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
