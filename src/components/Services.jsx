import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { servicesData } from '@/components/servicesData';
import PageHero from '@/components/PageHero';

const archServices = servicesData.filter((s) => s.category === 'architektur');
const immServices  = servicesData.filter((s) => s.category === 'immobilien');

/* ─── Reusable service card grid ───────────────────────────────────────── */
const ServiceGrid = ({ services, indexOffset = 0 }) => (
  <div className="grid md:grid-cols-2 gap-3">
    {services.map((s, i) => (
      <motion.div
        key={s.slug}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: i * 0.07 }}
      >
        <Link
          to={`/leistungen/${s.slug}`}
          className="group flex flex-col bg-white border border-gray-100 hover:border-gray-300 p-8 transition-colors h-full"
        >
          <div className="flex items-start justify-between mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {String(indexOffset + i + 1).padStart(2, '0')}
            </span>
            <ArrowRight
              size={16}
              className="text-gray-300 group-hover:text-gray-700 group-hover:translate-x-1 transition-all"
            />
          </div>
          <h3 className="font-display uppercase text-2xl font-semibold text-[#0F1B2D] mb-3">{s.title}</h3>
          <p className="text-gray-600 leading-relaxed">{s.shortDescription}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {s.features.map((f) => (
              <span key={f} className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 border border-gray-200 px-2.5 py-1">
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
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="mb-10"
  >
    <p className="eyebrow mb-3">{label}</p>
    <h2 className="display-heading uppercase text-4xl md:text-5xl">
      {title} {bold}
    </h2>
  </motion.div>
);

/* ─── Main ───────────────────────────────────────────────────────────────── */
const Services = () => (
  <div className="bg-white text-gray-900">

    {/* ── Header ── */}
    <PageHero
      eyebrow="Leistungen"
      title="Was wir anbieten."
      subtitle={<>Architektur und Immobilien aus einer Hand — seit über 55 Jahren in der Region Bern.</>}
    />

    {/* ── Architektur ── */}
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-6">
        <SectionHeader label="Architektur" title="Von der Planung" bold="zum Bau." />
        <ServiceGrid services={archServices} indexOffset={0} />
      </div>
    </section>

    {/* ── Immobilien ── */}
    <section className="surface-warm py-20 md:py-24">
      <div className="container mx-auto px-6">
        <SectionHeader label="Immobilien" title="Wohnen, Mieten" bold="& Investieren." />
        <ServiceGrid services={immServices} indexOffset={4} />
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="bg-[#0B1220] text-white py-20 md:py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div>
            <p className="text-[11px] font-semibold tracking-hairline text-white/60 uppercase mb-3">
              Kontakt
            </p>
            <h2 className="font-display uppercase text-4xl md:text-5xl font-semibold leading-none">
              Haben Sie ein Projekt?
            </h2>
            <p className="text-white/60 mt-4 max-w-xl leading-relaxed">
              Egal ob Neubau, Sanierung oder Immobiliensuche — sprechen Sie uns an.
              Die erste Beratung ist kostenlos.
            </p>
          </div>
          <Link
            to="/kontakt"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 text-sm font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap self-start md:self-auto"
          >
            Kostenlose Beratung <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>

  </div>
);

export default Services;
