import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { servicesData } from '@/components/servicesData';
import { AmonnLogoBlock } from '@/components/AmonnLogo';

/* ─── Service row (hover → brand navy) ──────────────────────────────────── */
const ServiceRow = ({ service, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        to={`/leistungen/${service.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex items-center gap-5 px-7 py-5 border-b border-gray-100 transition-colors duration-200 group"
        style={{ backgroundColor: hovered ? '#1D3D78' : 'transparent' }}
      >
        <span
          className="text-[10px] font-mono flex-shrink-0 transition-colors duration-200"
          style={{ color: hovered ? 'rgba(255,255,255,0.4)' : '#d1d5db' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium transition-colors duration-200 leading-snug"
            style={{ color: hovered ? '#fff' : '#111827' }}
          >
            {service.title}
          </p>
          <p
            className="text-xs mt-0.5 transition-colors duration-200 line-clamp-1"
            style={{ color: hovered ? 'rgba(255,255,255,0.55)' : '#9ca3af' }}
          >
            {service.features.slice(0, 3).join(' · ')}
          </p>
        </div>
        <ArrowUpRight
          size={14}
          className="flex-shrink-0 transition-all duration-200"
          style={{
            color: hovered ? 'rgba(255,255,255,0.7)' : '#e5e7eb',
            transform: hovered ? 'translate(1px, -1px)' : 'none',
          }}
        />
      </Link>
    </motion.div>
  );
};

/* ─── Services grid (two columns) ───────────────────────────────────────── */
const ServicesGrid = () => {
  const arch = servicesData.filter((s) => s.category === 'architektur');
  const immo = servicesData.filter((s) => s.category === 'immobilien');

  return (
    <div className="border-t border-gray-100">
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {/* Architektur column */}
        <div>
          <div className="px-7 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
              Architektur
            </span>
            <Link
              to="/architektur"
              className="text-[10px] font-semibold tracking-[0.15em] text-[#1D3D78] uppercase hover:underline"
            >
              Übersicht →
            </Link>
          </div>
          {arch.map((s, i) => (
            <ServiceRow key={s.slug} service={s} index={i} />
          ))}
        </div>

        {/* Immobilien column */}
        <div>
          <div className="px-7 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
              Immobilien
            </span>
            <Link
              to="/immobilien"
              className="text-[10px] font-semibold tracking-[0.15em] text-[#1D3D78] uppercase hover:underline"
            >
              Übersicht →
            </Link>
          </div>
          {immo.map((s, i) => (
            <ServiceRow key={s.slug} service={s} index={i + 4} />
          ))}
        </div>
      </div>
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
                  className="h-0.5 transition-all duration-300"
                  style={{
                    width: i === activeIndex ? 24 : 8,
                    backgroundColor: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.3)',
                  }}
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
              <p className="text-[10px] font-semibold tracking-[0.22em] text-gray-300 uppercase mb-3">
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
                  <li key={f} className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="w-4 h-px bg-gray-200 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={`/leistungen/${service.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 border-b border-gray-300 pb-px hover:border-gray-900 transition-colors group"
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
  const immServices  = servicesData.filter((s) => s.category === 'immobilien');

  return (
    <div className="bg-white">

      {/* ── Page header ── */}
      <section className="pt-12 pb-10 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-3">
                Leistungen
              </p>
              <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                Was wir
                <br />
                <span className="font-black">anbieten.</span>
              </h1>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs md:text-right">
              Architektur und Immobilien aus einer Hand —
              seit über 55 Jahren in der Region Bern.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Interactive service grid ── */}
      <section className="py-0">
        <div className="container mx-auto px-6 max-w-5xl">
          <ServicesGrid />
        </div>
      </section>

      {/* ── Architektur sticky scroll ── */}
      <section className="border-t border-gray-100 mt-16">
        <div className="container mx-auto px-6 max-w-5xl py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <AmonnLogoBlock variant="architektur" />
            </div>
            <h2 className="text-3xl font-light text-gray-900">
              Von der Vision <span className="font-black">zur Realität.</span>
            </h2>
          </motion.div>
        </div>
        <StickyScrollServices services={archServices} sectionLabel="Architektur" />
      </section>

      {/* ── Divider ── */}
      <div className="container mx-auto px-6 max-w-5xl py-10">
        <div className="flex items-center gap-6">
          <div className="flex-1 h-px bg-gray-100" />
          <p className="text-[10px] font-semibold tracking-[0.22em] text-gray-300 uppercase whitespace-nowrap">
            Amonn Immobilien
          </p>
          <div className="flex-1 h-px bg-gray-100" />
        </div>
      </div>

      {/* ── Immobilien sticky scroll ── */}
      <section className="border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <AmonnLogoBlock variant="immobilien" />
            </div>
            <h2 className="text-3xl font-light text-gray-900">
              Ihr Zuhause, <span className="font-black">Ihr Investment.</span>
            </h2>
          </motion.div>
        </div>
        <StickyScrollServices services={immServices} sectionLabel="Immobilien" />
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6" style={{ backgroundColor: '#1D3D78' }}>
        <div className="container mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-white/40 uppercase mb-5">Kontakt</p>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
            Haben Sie ein <span className="font-black">Projekt?</span>
          </h2>
          <p className="text-white/60 mb-10 max-w-xl mx-auto">
            Egal ob Neubau, Sanierung oder Immobiliensuche — sprechen Sie uns an.
            Die erste Beratung ist kostenlos.
          </p>
          <Link
            to="/kontakt"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-3.5 text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            Kostenlose Beratung <ArrowRight size={15} />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Services;
