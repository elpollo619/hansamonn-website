import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { servicesData } from '@/components/servicesData';

const archServices = servicesData.filter((s) => s.category === 'architektur');
const immServices  = servicesData.filter((s) => s.category === 'immobilien');

/* ─── Reusable service card grid ───────────────────────────────────────── */
const ServiceGrid = ({ services, indexOffset = 0 }) => (
  <div className="grid md:grid-cols-2 gap-px bg-gray-100 border border-gray-100">
    {services.map((s, i) => (
      <motion.div
        key={s.slug}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: i * 0.07 }}
      >
        <Link
          to={`/leistungen/${s.slug}`}
          className="group block bg-white p-8 hover:bg-gray-50 transition-colors h-full"
        >
          <div className="flex items-start justify-between mb-4">
            <span className="text-[10px] font-semibold tracking-widest text-gray-300 uppercase">
              {String(indexOffset + i + 1).padStart(2, '0')}
            </span>
            <ArrowRight
              size={14}
              className="text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all"
            />
          </div>
          <h3 className="text-xl font-light text-gray-900 mb-3">{s.title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{s.shortDescription}</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {s.features.map((f) => (
              <span key={f} className="text-[11px] text-gray-400 border border-gray-200 px-2.5 py-1 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </Link>
      </motion.div>
    ))}
  </div>
);

/* ─── Section header ────────────────────────────────────────────────────── */
const SectionHeader = ({ label, title, bold }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mb-8"
  >
    <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-2">
      {label}
    </p>
    <h2 className="text-3xl font-light text-gray-900">
      {title} <span className="font-black">{bold}</span>
    </h2>
  </motion.div>
);

/* ─── Main ───────────────────────────────────────────────────────────────── */
const Services = () => (
  <div className="bg-white">

    {/* ── Header ── */}
    <section className="pt-16 pb-12 border-b border-gray-100">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-3">
              Leistungen
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-none">
              Was wir <span className="font-black">anbieten.</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs md:text-right">
            Architektur und Immobilien aus einer Hand —
            seit über 55 Jahren in der Region Bern.
          </p>
        </motion.div>
      </div>
    </section>

    {/* ── Architektur ── */}
    <section className="py-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <SectionHeader label="Architektur" title="Von der Planung" bold="zum Bau." />
        <ServiceGrid services={archServices} indexOffset={0} />
      </div>
    </section>

    {/* ── Divider ── */}
    <div className="container mx-auto px-6 max-w-5xl">
      <div className="h-px bg-gray-100" />
    </div>

    {/* ── Immobilien ── */}
    <section className="py-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <SectionHeader label="Immobilien" title="Wohnen, Mieten" bold="& Investieren." />
        <ServiceGrid services={immServices} indexOffset={4} />
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="py-20 px-6" style={{ backgroundColor: '#1D3D78' }}>
      <div className="container mx-auto max-w-3xl text-center">
        <p className="text-[10px] font-semibold tracking-[0.25em] text-white/40 uppercase mb-5">
          Kontakt
        </p>
        <h2 className="text-3xl font-light text-white mb-4">
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

export default Services;
