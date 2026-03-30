import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { servicesData } from '@/components/servicesData';

/* ─── Cycling "Wir bauen ..." text ──────────────────────────────────────── */
const BAUEN_WORDS = [
  'Wohnhäuser.',
  'Mehrfamilienhäuser.',
  'Ihr Zuhause.',
  'für Generationen.',
  'mit Verantwortung.',
  'Neubauten.',
  'Sanierungen.',
  'Träume.',
];

const WirBauen = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % BAUEN_WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <span className="text-4xl md:text-6xl font-light text-gray-900">Wir bauen</span>
      <span className="relative inline-block min-w-[14rem] md:min-w-[22rem] h-[1.2em] overflow-hidden align-baseline">
        <AnimatePresence mode="wait">
          <motion.span
            key={idx}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 text-4xl md:text-6xl font-black text-gray-900 whitespace-nowrap"
          >
            {BAUEN_WORDS[idx]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
};

/* ─── Minimal SVG Cityscape (jungheim style — silhouettes only) ─────────── */
const Cityscape = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  // Each building as a polyline path (simplified silhouette)
  // Format: SVG path d string, drawn bottom-up from ground line y=100
  const buildings = [
    // x, groundY=100, shape as array of [dx,dy] relative points from bottom-left
    { x: 30,  w: 55,  h: 55,  roof: 'flat' },
    { x: 92,  w: 38,  h: 75,  roof: 'flat' },
    { x: 136, w: 28,  h: 40,  roof: 'gable', rh: 14 },
    { x: 170, w: 22,  h: 58,  roof: 'flat' },
    { x: 198, w: 50,  h: 35,  roof: 'gable', rh: 12 },
    { x: 254, w: 32,  h: 68,  roof: 'flat' },
    { x: 292, w: 18,  h: 90,  roof: 'flat' },  // tall tower
    { x: 316, w: 42,  h: 45,  roof: 'flat' },
    { x: 364, w: 28,  h: 30,  roof: 'gable', rh: 10 },
    { x: 398, w: 55,  h: 50,  roof: 'flat' },
    { x: 459, w: 25,  h: 72,  roof: 'flat' },
    { x: 490, w: 48,  h: 38,  roof: 'gable', rh: 15 },
    { x: 544, w: 20,  h: 82,  roof: 'flat' },
    { x: 570, w: 38,  h: 45,  roof: 'flat' },
    { x: 614, w: 30,  h: 60,  roof: 'gable', rh: 12 },
    { x: 650, w: 52,  h: 42,  roof: 'flat' },
    { x: 708, w: 22,  h: 95,  roof: 'flat' },  // tall tower
    { x: 736, w: 44,  h: 35,  roof: 'flat' },
    { x: 786, w: 28,  h: 55,  roof: 'gable', rh: 14 },
    { x: 820, w: 50,  h: 48,  roof: 'flat' },
    { x: 876, w: 36,  h: 70,  roof: 'flat' },
    { x: 918, w: 26,  h: 40,  roof: 'gable', rh: 11 },
    { x: 950, w: 48,  h: 55,  roof: 'flat' },
  ];

  const G = 110; // ground y
  const W = 1020;

  const buildingPath = (b) => {
    const bx = b.x, by = G - b.h, bw = b.w;
    if (b.roof === 'gable') {
      const rh = b.rh || 12;
      return `M${bx},${G} L${bx},${by} L${bx + bw / 2},${by - rh} L${bx + bw},${by} L${bx + bw},${G}`;
    }
    return `M${bx},${G} L${bx},${by} L${bx + bw},${by} L${bx + bw},${G}`;
  };

  return (
    <div ref={ref} className="w-full" style={{ height: 130 }}>
      <svg viewBox={`0 0 ${W} 130`} preserveAspectRatio="xMidYMax meet" className="w-full h-full">
        {/* Ground line */}
        <motion.line
          x1={0} y1={G} x2={W} y2={G}
          stroke="#d1d5db" strokeWidth="1"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          style={{ transformOrigin: '0 0' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
        {/* Buildings */}
        {buildings.map((b, i) => (
          <motion.path
            key={i}
            d={buildingPath(b)}
            fill="none"
            stroke="#9ca3af"
            strokeWidth="0.8"
            strokeLinejoin="miter"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.04, ease: 'easeOut' }}
          />
        ))}
      </svg>
    </div>
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

      {/* ── Sticky image panel (left) ── */}
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

          {/* Overlay with active service name */}
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

            {/* Progress dots */}
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

      {/* ── Scrollable service list (right) ── */}
      <div className="md:w-1/2">
        {services.map((service, i) => (
          <div
            key={service.slug}
            ref={(el) => (itemRefs.current[i] = el)}
            className="min-h-[60vh] md:min-h-screen flex flex-col justify-center px-8 md:px-16 py-16 border-b border-gray-100 last:border-0"
          >
            {/* Mobile: show image inline */}
            <div className="md:hidden mb-6 overflow-hidden h-52">
              <img
                src={service.coverImage}
                alt={service.title}
                className="w-full h-full object-cover"
              />
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

/* ─── Main Services component ───────────────────────────────────────────── */
const Services = () => {
  const archServices = servicesData.filter((s) => s.category === 'architektur');
  const immServices = servicesData.filter((s) => s.category === 'immobilien');

  return (
    <div className="bg-white">

      {/* ── Hero with cycling text + cityscape ──────────────────── */}
      <section className="pt-12 pb-0 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-6">
              Tätigkeit
            </p>
            <WirBauen />
            <p className="mt-6 text-gray-400 text-base leading-relaxed max-w-xl">
              Architektur mit Verantwortung für Raum, Bestand und Kosten — seit über
              55 Jahren in der Region Bern.
            </p>
          </motion.div>
        </div>
        <div className="mt-10">
          <Cityscape />
        </div>
      </section>

      {/* ── Section label ─────────────────────────────────────── */}
      <div className="container mx-auto px-6 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] font-semibold tracking-[0.22em] text-slate-400 uppercase mb-2">
            Leistungen
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900">
            Architektur —{' '}
            <span className="font-semibold">Von der Vision zur Realität</span>
          </h2>
        </motion.div>
      </div>

      {/* ── Architektur sticky scroll ─────────────────────────── */}
      <StickyScrollServices services={archServices} sectionLabel="Architektur" />

      {/* ── Divider ───────────────────────────────────────────── */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px bg-gray-200" />
          <p className="text-[10px] font-semibold tracking-[0.22em] text-gray-400 uppercase whitespace-nowrap">
            AMONN IMMOBILIEN
          </p>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      </div>

      {/* ── Section label ─────────────────────────────────────── */}
      <div className="container mx-auto px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-light text-gray-900">
            Immobilien —{' '}
            <span className="font-semibold">Ihr Zuhause, Ihr Investment</span>
          </h2>
        </motion.div>
      </div>

      {/* ── Immobilien sticky scroll ──────────────────────────── */}
      <StickyScrollServices services={immServices} sectionLabel="Immobilien" />

      {/* ── CTA strip ─────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gray-900 py-20 px-6"
      >
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-500 uppercase mb-5">
            Kontakt
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Haben Sie ein Projekt im Kopf?
          </h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            Egal ob Neubau, Sanierung oder Immobiliensuche — sprechen Sie uns an.
            Die erste Beratung ist kostenlos.
          </p>
          <Link
            to="/kontakt"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3.5 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors"
          >
            Kostenlose Beratung
            <ArrowRight size={15} />
          </Link>
        </div>
      </motion.section>

    </div>
  );
};

export default Services;
