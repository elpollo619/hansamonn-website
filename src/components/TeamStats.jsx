import React from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { number: '9', label: 'Teammitglieder' },
  { number: '133+', label: 'Jahre Gesamterfahrung' },
  { number: '55+', label: 'Jahre Firmengeschichte' },
  { number: '100%', label: 'Engagement' },
];

const TeamStats = () => {
  return (
    <section className="bg-[#0B1220] text-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="container mx-auto px-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`py-12 md:py-16 px-4 md:px-8 text-center border-white/10 ${
                i % 2 === 0 ? 'border-r' : 'md:border-r'
              } ${i === STATS.length - 1 ? 'md:border-r-0' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''}`}
            >
              <div className="font-display text-5xl md:text-6xl font-semibold leading-none tabular-nums">
                {s.number}
              </div>
              <div className="mt-3 text-[10px] md:text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TeamStats;
