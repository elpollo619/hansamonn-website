import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { servicesData } from '@/components/servicesData';

/* ─── Data: each service gets a building slot in the SVG ────────────────── */
// 8 services → 8 buildings, each linked
const ALL_SERVICES = servicesData; // 4 architektur + 4 immobilien

/* ─── Interactive Cityscape ─────────────────────────────────────────────── */
// 8 buildings, one per service. Hovering/active fills the building.
const BUILDINGS = [
  { x: 60,  w: 70,  h: 70,  roof: 'flat' },
  { x: 140, w: 45,  h: 100, roof: 'flat' },
  { x: 195, w: 38,  h: 55,  roof: 'gable', rh: 18 },
  { x: 243, w: 28,  h: 130, roof: 'flat' },   // tall
  { x: 281, w: 55,  h: 60,  roof: 'flat' },
  { x: 346, w: 40,  h: 85,  roof: 'gable', rh: 16 },
  { x: 396, w: 28,  h: 110, roof: 'flat' },   // tall
  { x: 434, w: 62,  h: 68,  roof: 'flat' },
];

const G = 150; // ground y
const SVG_W = 560;

const buildingPath = (b) => {
  const { x, w, h, roof, rh = 14 } = b;
  const top = G - h;
  if (roof === 'gable')
    return `M${x},${G} L${x},${top} L${x + w / 2},${top - rh} L${x + w},${top} L${x + w},${G}`;
  return `M${x},${G} L${x},${top} L${x + w},${top} L${x + w},${G}`;
};

const InteractiveCityscape = ({ activeIdx, onHover, onLeave, onSelect }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className="w-full flex justify-center" style={{ height: 170 }}>
      <svg
        viewBox={`0 0 ${SVG_W} 170`}
        preserveAspectRatio="xMidYMax meet"
        className="h-full"
        style={{ width: '100%', maxWidth: 600 }}
      >
        {/* Ground */}
        <motion.line
          x1={20} y1={G} x2={SVG_W - 20} y2={G}
          stroke="#d1d5db" strokeWidth="1"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          style={{ transformOrigin: '20px 0' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />

        {/* Buildings */}
        {BUILDINGS.map((b, i) => {
          const isActive = activeIdx === i;
          return (
            <motion.path
              key={i}
              d={buildingPath(b)}
              fill={isActive ? '#e2e8f0' : 'transparent'}
              stroke={isActive ? '#334155' : '#cbd5e1'}
              strokeWidth={isActive ? 1.2 : 0.8}
              strokeLinejoin="miter"
              style={{ cursor: 'pointer' }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.07, ease: 'easeOut' }}
              whileHover={{ fill: '#f1f5f9' }}
              onHoverStart={() => onHover(i)}
              onHoverEnd={onLeave}
              onClick={() => onSelect(i)}
            />
          );
        })}

        {/* Active building label */}
        {activeIdx !== null && (
          <motion.text
            key={activeIdx}
            x={BUILDINGS[activeIdx].x + BUILDINGS[activeIdx].w / 2}
            y={G - BUILDINGS[activeIdx].h - 10}
            textAnchor="middle"
            fontSize="7"
            fill="#64748b"
            fontFamily="sans-serif"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {ALL_SERVICES[activeIdx]?.title}
          </motion.text>
        )}
      </svg>
    </div>
  );
};

/* ─── Service pills ──────────────────────────────────────────────────────── */
const ServicePills = ({ activeIdx, onHover, onLeave, onSelect }) => {
  const arch = ALL_SERVICES.filter((s) => s.category === 'architektur');
  const immo = ALL_SERVICES.filter((s) => s.category === 'immobilien');

  const PillGroup = ({ label, services, offset }) => (
    <div className="flex flex-wrap justify-center gap-2">
      {services.map((s, i) => {
        const globalIdx = offset + i;
        const active = activeIdx === globalIdx;
        return (
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.4 + globalIdx * 0.05 }}
          >
            <Link
              to={`/leistungen/${s.slug}`}
              onMouseEnter={() => onHover(globalIdx)}
              onMouseLeave={onLeave}
              className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                active
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              {s.title}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col gap-3 items-center">
      <PillGroup label="Architektur" services={arch} offset={0} />
      <div className="flex items-center gap-3 w-full max-w-lg">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-[9px] tracking-widest text-gray-300 uppercase">Immobilien</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      <PillGroup label="Immobilien" services={immo} offset={4} />
    </div>
  );
};

/* ─── Hero section ───────────────────────────────────────────────────────── */
const Hero = () => {
  const [activeIdx, setActiveIdx] = useState(null);
  const navigate = useNavigate();

  return (
    <section className="pt-12 pb-10 bg-white">
      <div className="container mx-auto px-6">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-4">
            Tätigkeit
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
            Architektur mit Verantwortung
            <br />
            <span className="font-black">für Raum, Bestand und Kosten.</span>
          </h1>
        </motion.div>

        {/* Interactive cityscape */}
        <InteractiveCityscape
          activeIdx={activeIdx}
          onHover={setActiveIdx}
          onLeave={() => setActiveIdx(null)}
          onSelect={(i) => navigate(`/leistungen/${ALL_SERVICES[i].slug}`)}
        />

        {/* Pills */}
        <div className="mt-6">
          <ServicePills
            activeIdx={activeIdx}
            onHover={setActiveIdx}
            onLeave={() => setActiveIdx(null)}
            onSelect={(i) => navigate(`/leistungen/${ALL_SERVICES[i].slug}`)}
          />
        </div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-center text-[11px] text-gray-300 mt-4 tracking-wide"
        >
          Klicken Sie auf ein Gebäude oder einen Bereich, um mehr zu erfahren
        </motion.p>
      </div>
    </section>
  );
};

/* ─── Sticky scroll section ─────────────────────────────────────────────── */
const StickyScrollServices = ({ services, sectionLabel }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef([]);

  useEffect(() => {
    const observers = services.map((_, i) => {
      const el = itemRefs.current[i];
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i); },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, [services]);

  const active = services[activeIndex];

  return (
    <div className="relative flex flex-col md:flex-row">
      {/* Sticky image panel */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${active.coverImage})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug + '-label'}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-[10px] font-semibold tracking-[0.22em] text-white/60 uppercase mb-1">
                  {sectionLabel}
                </p>
                <h3 className="text-2xl font-light text-white">{active.title}</h3>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-1.5 mt-5">
              {services.map((_, i) => (
                <button
                  key={i}
                  onClick={() => itemRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className={`h-0.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="md:w-1/2">
        {services.map((service, i) => (
          <div
            key={service.slug}
            ref={(el) => (itemRefs.current[i] = el)}
            className="min-h-[60vh] md:min-h-screen flex flex-col justify-center px-8 md:px-16 py-16 border-b border-gray-100 last:border-0"
          >
            <div className="md:hidden mb-6 overflow-hidden h-52">
              <img src={service.coverImage} alt={service.title} className="w-full h-full object-cover" />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-[10px] font-semibold tracking-[0.22em] text-slate-400 uppercase mb-3">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="text-2xl md:text-3xl font-light text-gray-900 mb-4 leading-snug">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md">
                {service.shortDescription}
              </p>
              <ul className="space-y-2 mb-8">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="w-4 h-px bg-slate-300 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={`/leistungen/${service.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 border-b border-gray-300 pb-px hover:border-gray-900 transition-colors w-fit group"
              >
                Mehr erfahren
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main ───────────────────────────────────────────────────────────────── */
const Services = () => {
  const archServices = servicesData.filter((s) => s.category === 'architektur');
  const immServices = servicesData.filter((s) => s.category === 'immobilien');

  return (
    <div className="bg-white">
      <Hero />

      {/* Architektur */}
      <div className="container mx-auto px-6 pt-8 pb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-[10px] font-semibold tracking-[0.22em] text-slate-400 uppercase mb-2">Leistungen</p>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900">
            Architektur — <span className="font-semibold">Von der Vision zur Realität</span>
          </h2>
        </motion.div>
      </div>
      <StickyScrollServices services={archServices} sectionLabel="Architektur" />

      {/* Divider */}
      <div className="container mx-auto px-6 py-10">
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px bg-gray-200" />
          <p className="text-[10px] font-semibold tracking-[0.22em] text-gray-400 uppercase whitespace-nowrap">AMONN IMMOBILIEN</p>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      </div>

      {/* Immobilien */}
      <div className="container mx-auto px-6 pb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900">
            Immobilien — <span className="font-semibold">Ihr Zuhause, Ihr Investment</span>
          </h2>
        </motion.div>
      </div>
      <StickyScrollServices services={immServices} sectionLabel="Immobilien" />

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        className="bg-gray-900 py-20 px-6"
      >
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-500 uppercase mb-5">Kontakt</p>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">Haben Sie ein Projekt im Kopf?</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            Egal ob Neubau, Sanierung oder Immobiliensuche — sprechen Sie uns an. Die erste Beratung ist kostenlos.
          </p>
          <Link to="/kontakt" className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3.5 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors">
            Kostenlose Beratung <ArrowRight size={15} />
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Services;
