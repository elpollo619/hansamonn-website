import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { servicesData } from '@/components/servicesData';

/* ─── Animated SVG Cityscape ────────────────────────────────────────────── */
const Cityscape = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const buildings = [
    { x: 0,   w: 48,  h: 180, floors: 5, cols: 2 },
    { x: 54,  w: 36,  h: 240, floors: 7, cols: 2 },
    { x: 96,  w: 60,  h: 140, floors: 3, cols: 3 },
    { x: 162, w: 42,  h: 320, floors: 9, cols: 2, spire: true },
    { x: 210, w: 30,  h: 200, floors: 6, cols: 2 },
    { x: 246, w: 72,  h: 160, floors: 4, cols: 4 },
    { x: 324, w: 36,  h: 280, floors: 8, cols: 2 },
    { x: 366, w: 48,  h: 120, floors: 3, cols: 3 },
    { x: 420, w: 54,  h: 260, floors: 7, cols: 3 },
    { x: 480, w: 42,  h: 180, floors: 5, cols: 2 },
    { x: 528, w: 66,  h: 140, floors: 3, cols: 4 },
    { x: 600, w: 36,  h: 300, floors: 9, cols: 2, spire: true },
    { x: 642, w: 54,  h: 200, floors: 6, cols: 3 },
    { x: 702, w: 42,  h: 160, floors: 4, cols: 2 },
    { x: 750, w: 30,  h: 220, floors: 7, cols: 2 },
    { x: 786, w: 60,  h: 140, floors: 3, cols: 3 },
    { x: 852, w: 48,  h: 260, floors: 8, cols: 2 },
    { x: 906, w: 36,  h: 180, floors: 5, cols: 2 },
    { x: 948, w: 54,  h: 120, floors: 3, cols: 3 },
  ];

  const SVG_H = 340;

  return (
    <div ref={ref} className="w-full overflow-hidden" style={{ height: SVG_H }}>
      <svg viewBox={`0 0 1002 ${SVG_H}`} preserveAspectRatio="xMidYMax meet" className="w-full h-full">
        {buildings.map((b, i) => {
          const y = SVG_H - b.h;
          const delay = i * 0.05;
          const wGap = 6;
          const wH = Math.min(10, (b.h / b.floors) * 0.45);
          const wW = (b.w - (b.cols + 1) * wGap) / b.cols;
          const windows = [];
          for (let row = 0; row < b.floors; row++) {
            const rowY = y + 8 + row * (b.h / b.floors);
            for (let col = 0; col < b.cols; col++) {
              const wx = b.x + wGap + col * (wW + wGap);
              windows.push(
                <motion.rect key={`w-${i}-${row}-${col}`} x={wx} y={rowY} width={wW} height={wH}
                  fill="none" stroke="#94a3b8" strokeWidth="0.6"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.3, delay: delay + 0.3 + row * 0.04 }}
                />
              );
            }
          }
          return (
            <g key={i}>
              <motion.rect x={b.x} width={b.w} y={SVG_H} height={0}
                fill="none" stroke="#334155" strokeWidth="1"
                animate={inView ? { y, height: b.h } : { y: SVG_H, height: 0 }}
                transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
              />
              {b.spire && (
                <motion.line x1={b.x + b.w / 2} x2={b.x + b.w / 2} y1={SVG_H} y2={SVG_H}
                  stroke="#334155" strokeWidth="1"
                  animate={inView ? { y1: y - 30, y2: y } : { y1: SVG_H, y2: SVG_H }}
                  transition={{ duration: 0.4, delay: delay + 0.5, ease: 'easeOut' }}
                />
              )}
              {windows}
            </g>
          );
        })}
        <motion.line x1={0} y1={SVG_H} x2={1002} y2={SVG_H}
          stroke="#334155" strokeWidth="1.5"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          style={{ transformOrigin: '0 0' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
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

      {/* ── Hero with cityscape ─────────────────────────────────── */}
      <section className="pt-10 pb-0 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mb-6"
          >
            <p className="text-[10px] font-semibold tracking-[0.25em] text-slate-400 uppercase mb-4">
              AMONN ARCHITEKTUR
            </p>
            <h1 className="text-4xl md:text-6xl font-light text-gray-900 leading-tight">
              Wir bauen
              <br />
              <span className="font-black">mehr als Häuser.</span>
            </h1>
            <p className="mt-5 text-gray-500 text-base leading-relaxed max-w-lg">
              Planung, Bauleitung, Neubauten, Sanierungen — und die professionelle
              Begleitung rund um Ihre Immobilie. Alles aus einer Hand, seit über 55 Jahren
              in der Region Bern.
            </p>
          </motion.div>
        </div>
        <div className="mt-8">
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
