import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    to: '/immobilien',
    label: 'AMONN IMMOBILIEN',
    title: 'Wohnen & Mieten',
    sub: 'Long Stay, Short Stay, Apartments, Verkauf',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80',
    span: 'md:col-span-1',
  },
  {
    to: '/architektur',
    label: 'AMONN ARCHITEKTUR',
    title: 'Bauen & Gestalten',
    sub: 'Planung, Neubauten, Sanierungen, Projektbegleitung',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80',
    span: 'md:col-span-1',
  },
  {
    to: '/uber-uns',
    label: 'HANS AMONN AG',
    title: 'Über uns',
    sub: 'Team, Geschichte, Kontakt — seit 1968 in Muri bei Bern',
    image: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/40ccd8d190aeb0a543c3ff4ab8cdf19d.jpg',
    span: 'md:col-span-1',
  },
];

const SectionCard = ({ section, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 + index * 0.12 }}
      className={`${section.span} group relative overflow-hidden`}
      style={{ minHeight: 420 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={section.to} className="block h-full w-full absolute inset-0 z-10" />

      {/* Background image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${section.image})` }}
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* Gradient overlay — stronger at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <motion.p
          className="text-[10px] font-semibold tracking-[0.22em] text-white/50 uppercase mb-2"
          animate={{ opacity: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          {section.label}
        </motion.p>
        <h2 className="text-2xl md:text-3xl font-light text-white leading-tight mb-2">
          {section.title}
        </h2>
        <p className="text-white/60 text-sm leading-relaxed mb-5">
          {section.sub}
        </p>
        <motion.div
          className="flex items-center gap-2 text-white text-sm font-medium"
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.6 }}
          transition={{ duration: 0.25 }}
        >
          Mehr erfahren
          <ArrowRight size={14} />
        </motion.div>
      </div>
    </motion.div>
  );
};

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col bg-white">

      {/* ── Top bar: company name + tagline ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 pt-10 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <p className="text-[10px] font-semibold tracking-[0.28em] text-gray-400 uppercase mb-3">
            Seit 1968
          </p>
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 leading-none">
            Hans Amonn AG
            <br />
            <span className="font-black">Bau & Immobilien.</span>
          </h1>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs md:text-right">
          Ihr Partner für Architektur und Immobilien<br />
          in der Region Bern — seit über 55 Jahren.
        </p>
      </motion.div>

      {/* ── 3-panel grid ── */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100 border-t border-gray-100">
        {SECTIONS.map((s, i) => (
          <SectionCard key={s.to} section={s} index={i} />
        ))}
      </div>

    </section>
  );
};

export default Hero;
