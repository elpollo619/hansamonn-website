import React, { useState } from 'react';
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
    image: '/images/kerzers/titel.jpg',
  },
  {
    to: '/architektur',
    index: '02',
    eyebrow: 'Architektur',
    title: 'Bauen & Gestalten',
    sub: 'Planung · Neubauten · Sanierungen · Projektbegleitung',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/3d1fb89de8fe0a9a5680ca4ecc5b8897.jpg',
  },
  {
    to: '/uber-uns',
    index: '03',
    eyebrow: 'Über uns',
    title: 'Menschen & Geschichte',
    sub: 'Team · Geschichte · Kontakt — seit 1968 in Muri bei Bern',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/40ccd8d190aeb0a543c3ff4ab8cdf19d.jpg',
  },
];

const BRAND = 'var(--brand-color, #1D3D78)';

const Hero = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const settings = getSettings();
  const stripText = settings.heroSubtitle || 'Architektur & Immobilien in der Region Bern.';

  return (
    <section className="relative flex flex-col bg-white" style={{ minHeight: 'calc(100vh - 5rem)' }}>

      {/* ── Top strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 pt-10 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3"
      >
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-semibold tracking-hairline text-gray-800 uppercase">
            Hans Amonn AG
          </span>
          <span className="h-px w-10 bg-gray-300" />
          <span className="text-[11px] font-semibold tracking-hairline text-gray-400 uppercase">
            Seit 1968 · Muri bei Bern
          </span>
        </div>
        <p className="text-gray-500 text-sm max-w-sm md:text-right leading-relaxed">
          {stripText}
        </p>
      </motion.div>

      {/* ── Split panel ── */}
      <div className="flex-1 flex flex-col md:flex-row border-t border-gray-200" style={{ minHeight: 560 }}>

        {/* Left: stacked nav */}
        <div className="flex flex-col md:w-[42%] divide-y divide-gray-200 border-r border-gray-200">
          {SECTIONS.map((s, i) => {
            const active = activeIdx === i;
            return (
              <motion.div
                key={s.to}
                className="flex-1"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              >
                <Link
                  to={s.to}
                  className={`group relative h-full flex items-start gap-5 px-8 py-8 md:py-10 transition-colors block ${
                    active ? 'bg-gray-50' : 'bg-white hover:bg-gray-50/70'
                  }`}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  {/* Active accent bar */}
                  <span
                    className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-300"
                    style={{ backgroundColor: active ? BRAND : 'transparent' }}
                  />

                  {/* Index number */}
                  <span
                    className="font-display text-2xl md:text-3xl font-semibold tabular-nums pt-1 transition-colors duration-300"
                    style={{ color: active ? BRAND : '#d1d5db' }}
                  >
                    {s.index}
                  </span>

                  <div className="flex-1">
                    <span
                      className="block text-[10px] font-semibold tracking-hairline uppercase mb-2 transition-colors duration-300"
                      style={{ color: active ? BRAND : '#c4c9d2' }}
                    >
                      {s.eyebrow}
                    </span>
                    <h2
                      className="font-display uppercase tracking-tight leading-[0.95] text-3xl md:text-[2.6rem] font-semibold transition-colors duration-300"
                      style={{ color: active ? '#0F1B2D' : '#9ca3af' }}
                    >
                      {s.title}
                    </h2>
                    <p
                      className="text-sm mt-3 leading-relaxed max-w-xs transition-colors duration-300"
                      style={{ color: active ? '#6b7280' : '#cbd0d8' }}
                    >
                      {s.sub}
                    </p>
                    <motion.div
                      className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mt-5"
                      style={{ color: active ? BRAND : '#d1d5db' }}
                      animate={{ x: active ? 4 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Mehr erfahren
                      <ArrowRight size={14} />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Right: changing image */}
        <div className="flex-1 relative overflow-hidden bg-gray-100 min-h-[340px] md:min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${SECTIONS[activeIdx].image})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent pointer-events-none" />

          {/* Active caption */}
          <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <span className="block text-white/70 text-[10px] font-semibold tracking-hairline uppercase mb-1">
                  {SECTIONS[activeIdx].eyebrow}
                </span>
                <span className="font-display text-white text-2xl md:text-3xl font-semibold uppercase leading-none">
                  {SECTIONS[activeIdx].title}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Indicator dots */}
            <div className="flex gap-2 pb-1">
              {SECTIONS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Bereich ${i + 1}`}
                  className="transition-all duration-300"
                  style={{
                    width: activeIdx === i ? 26 : 7,
                    height: 7,
                    borderRadius: 4,
                    backgroundColor: activeIdx === i ? '#fff' : 'rgba(255,255,255,0.45)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
