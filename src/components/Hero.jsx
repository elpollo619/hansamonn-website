import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AmonnLogo from '@/components/AmonnLogo';

const SECTIONS = [
  {
    to: '/immobilien',
    logoVariant: 'immobilien',
    title: 'Wohnen & Mieten',
    sub: 'Long Stay · Short Stay · Apartments · Verkauf',
    image: '/images/kerzers/titel.jpg',
  },
  {
    to: '/architektur',
    logoVariant: 'architektur',
    title: 'Bauen & Gestalten',
    sub: 'Planung · Neubauten · Sanierungen · Projektbegleitung',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/3d1fb89de8fe0a9a5680ca4ecc5b8897.jpg',
  },
  {
    to: '/uber-uns',
    logoVariant: 'main',
    title: 'Über uns',
    sub: 'Team · Geschichte · Kontakt — seit 1968 in Muri bei Bern',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/40ccd8d190aeb0a543c3ff4ab8cdf19d.jpg',
  },
];

const Hero = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="min-h-screen flex flex-col bg-white">

      {/* ── Editorial header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 pt-10 pb-8"
      >
        <p className="text-[10px] font-semibold tracking-[0.28em] text-gray-400 uppercase mb-3">
          Seit 1968
        </p>
        <h1 className="text-4xl md:text-6xl font-light text-gray-900 leading-none">
          Hans Amonn AG
          <br />
          <span className="font-black">Bau & Immobilien.</span>
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mt-3 max-w-sm">
          Ihr Partner für Architektur und Immobilien in der Region Bern.
        </p>
      </motion.div>

      {/* ── Split panel ── */}
      <div className="flex-1 flex flex-col md:flex-row border-t border-gray-100" style={{ minHeight: 520 }}>

        {/* Left: stacked nav */}
        <div className="flex flex-col md:w-[38%] divide-y divide-gray-100 border-r border-gray-100">
          {SECTIONS.map((s, i) => (
            <motion.div
              key={s.to}
              className="flex-1"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
            >
              <Link
                to={s.to}
                className={`h-full flex flex-col justify-center px-8 py-9 transition-colors block ${
                  activeIdx === i ? 'bg-gray-50' : 'bg-white hover:bg-gray-50/60'
                }`}
                onMouseEnter={() => setActiveIdx(i)}
              >
                <div className="mb-3">
                  <AmonnLogo variant={s.logoVariant} size="sm" />
                </div>
                <h2
                  className="text-2xl md:text-3xl font-light leading-tight transition-colors duration-300"
                  style={{ color: activeIdx === i ? '#111' : '#9ca3af' }}
                >
                  {s.title}
                </h2>
                <p
                  className="text-sm mt-1.5 leading-relaxed transition-colors duration-300"
                  style={{ color: activeIdx === i ? '#6b7280' : '#d1d5db' }}
                >
                  {s.sub}
                </p>
                <motion.div
                  className="flex items-center gap-2 text-sm font-medium mt-4"
                  style={{ color: activeIdx === i ? '#1D3D78' : '#d1d5db' }}
                  animate={{ x: activeIdx === i ? 4 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Mehr erfahren
                  <ArrowRight size={13} />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right: changing image */}
        <div className="flex-1 relative overflow-hidden bg-gray-100 min-h-[320px] md:min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${SECTIONS[activeIdx].image})` }}
            />
          </AnimatePresence>
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/20 pointer-events-none" />

          {/* Section indicator dots */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            {SECTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="transition-all duration-300"
                style={{
                  width: activeIdx === i ? 24 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: activeIdx === i ? '#fff' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
