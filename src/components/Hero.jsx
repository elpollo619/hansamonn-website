import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getSettings } from '@/data/settingsStore';

const SECTIONS = [
  {
    to: '/immobilien',
    index: '01',
    eyebrow: 'Immobilien',
    title: 'Wohnen & Mieten',
    sub: 'Long Stay · Short Stay · Apartments · Verkauf',
    image: '/images/ns-hotel/aussen.jpg',
  },
  {
    to: '/architektur',
    index: '02',
    eyebrow: 'Architektur',
    title: 'Bauen & Gestalten',
    sub: 'Planung · Neubauten · Sanierungen',
    image: '/images/projekte/hoeheweg/drohne-2024.jpg',
  },
  {
    to: '/uber-uns',
    index: '03',
    eyebrow: 'Über uns',
    title: 'Menschen & Geschichte',
    sub: 'Team · Geschichte · Kontakt',
    image: '/images/ns-hotel/drohne-1.jpg',
  },
];

const ROTATE_MS = 6000;

const Hero = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const settings = getSettings();
  const subline = settings.heroSubtitle || 'Architektur, Immobilien und Gastfreundschaft in der Region Bern und im Tessin.';

  const reduceMotion = useRef(false);
  useEffect(() => {
    reduceMotion.current =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Auto-rotate the background through the sections
  useEffect(() => {
    if (paused || reduceMotion.current) return;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % SECTIONS.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  const active = SECTIONS[activeIdx];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0B1220] text-white"
      style={{ height: 'calc(100vh - 5rem)', minHeight: 560 }}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Cinematic background ── */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center kenburns"
              style={{ backgroundImage: `url(${active.image})` }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic gradients for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative h-full container mx-auto px-6 flex flex-col">

        {/* Top eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-10 flex items-center gap-4"
        >
          <span className="text-[11px] font-semibold tracking-hairline uppercase text-white/90 whitespace-nowrap">
            Hans Amonn AG
          </span>
          <span className="h-px w-10 bg-white/40 hidden sm:block" />
          <span className="text-[11px] font-semibold tracking-hairline uppercase text-white/60 whitespace-nowrap hidden sm:inline">
            Seit 1968 · Muri bei Bern
          </span>
        </motion.div>

        {/* Headline */}
        <div className="flex-1 flex flex-col justify-center max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display uppercase font-semibold leading-[0.92] tracking-tight text-white"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.5rem)' }}
          >
            Bauen. Wohnen.<br />Bleiben.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-lg md:text-xl text-white/85 leading-relaxed max-w-xl"
          >
            {subline}
          </motion.p>
        </div>

        {/* Destination band */}
        <div className="pb-20 md:pb-14">
          {/* Indicator dots (kept clear of the floating buttons) */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {SECTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActiveIdx(i); setPaused(true); }}
                aria-label={`Bild ${i + 1} von ${SECTIONS.length} anzeigen`}
                aria-current={activeIdx === i || undefined}
                className="transition-[width,background-color] duration-300"
                style={{
                  width: activeIdx === i ? 26 : 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: activeIdx === i ? '#fff' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/15 border-t border-white/15">
            {SECTIONS.map((s, i) => {
              const isActive = activeIdx === i;
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  onMouseEnter={() => { setActiveIdx(i); setPaused(true); }}
                  className="group relative flex items-center gap-4 px-5 py-5 transition-colors"
                  style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.10)' : 'rgba(11,18,32,0.55)' }}
                >
                  {/* top active bar */}
                  <span
                    className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                    style={{ backgroundColor: '#fff', opacity: isActive ? 1 : 0 }}
                  />
                  <span className="font-display text-xl font-semibold tabular-nums text-white/60 group-hover:text-white transition-colors">
                    {s.index}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[10px] font-semibold tracking-widest uppercase text-white/50 mb-0.5">
                      {s.eyebrow}
                    </span>
                    <span className="font-display uppercase text-lg md:text-xl font-semibold text-white leading-none truncate block">
                      {s.title}
                    </span>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
