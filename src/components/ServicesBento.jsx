import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TiltCard from '@/components/TiltCard';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { servicesData } from '@/components/servicesData';

// Asymmetric bento layout (desktop). Index = position in servicesData.
const SPANS = [
  'lg:col-span-2 lg:row-span-2', // Planung und Entwurf (featured)
  '',
  '',
  'lg:col-span-2',
  '',
  'lg:col-span-2',                // Vermietung (featured)
  '',
  'lg:col-span-3',
];
const TONE = { 0: 'navy', 5: 'warm' };

const CATEGORY_LABEL = { architektur: 'Architektur', immobilien: 'Immobilien' };

function BentoCard({ service, index }) {
  const Icon = service.icon;
  const tone = TONE[index];
  const isNavy = tone === 'navy';
  const isFeatured = Boolean(tone);

  const toneClass = isNavy
    ? 'text-white border-transparent'
    : tone === 'warm'
      ? 'surface-warm border-gray-200 text-gray-900'
      : 'bg-white border-gray-200 text-gray-900 hover:border-gray-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
      className={SPANS[index] || ''}
    >
      <TiltCard className="h-full" max={index === 0 ? 3 : 6}>
      <Link
        to={`/leistungen/${service.slug}`}
        className={`group relative flex h-full min-h-[180px] flex-col justify-between border p-6 md:p-7 transition-colors ${toneClass}`}
        style={isNavy ? { backgroundColor: 'var(--brand-color, #1D3D78)' } : undefined}
      >
        <div className="flex items-start justify-between gap-4">
          <div
            className={`flex h-11 w-11 items-center justify-center ${isNavy ? 'bg-white/10' : 'bg-gray-100'}`}
          >
            <Icon size={20} className={isNavy ? 'text-white' : 'text-[#1D3D78]'} />
          </div>
          <ArrowUpRight
            size={20}
            className={`transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${
              isNavy ? 'text-white/60 group-hover:text-white' : 'text-gray-300 group-hover:text-[#1D3D78]'
            }`}
          />
        </div>

        <div className="mt-8">
          <span
            className={`block text-[10px] font-semibold uppercase tracking-hairline mb-2 ${
              isNavy ? 'text-white/60' : 'text-gray-400'
            }`}
          >
            {CATEGORY_LABEL[service.category]}
          </span>
          <h3
            className={`font-display uppercase font-semibold leading-none tracking-tight ${
              index === 0 ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'
            }`}
          >
            {service.title}
          </h3>
          {isFeatured && (
            <p className={`mt-4 text-sm leading-relaxed line-clamp-3 max-w-md ${isNavy ? 'text-white/75' : 'text-gray-600'}`}>
              {service.shortDescription}
            </p>
          )}
          {index === 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {service.features.map((f) => (
                <span key={f} className="border border-white/25 px-3 py-1 text-xs text-white/85">
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
      </TiltCard>
    </motion.div>
  );
}

/** Services as a modern asymmetric bento grid (21st-style, brand-aligned). */
export default function ServicesBento() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Leistungen</p>
            <h2 className="display-heading uppercase text-4xl md:text-6xl">Alles aus einer Hand</h2>
          </div>
          <p className="text-gray-500 max-w-sm leading-relaxed md:text-right">
            Von der ersten Skizze über den Bau bis zur Vermietung und Bewirtschaftung.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(190px,auto)] gap-3 lg:grid-flow-dense">
          {servicesData.map((s, i) => (
            <BentoCard key={s.slug} service={s} index={i} />
          ))}

          {/* CTA tile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/leistungen"
              className="group flex h-full min-h-[180px] flex-col justify-end border border-gray-900 bg-gray-900 p-6 md:p-7 text-white hover:bg-black transition-colors"
            >
              <span className="text-[10px] font-semibold uppercase tracking-hairline text-white/50 mb-2">Übersicht</span>
              <span className="flex items-center gap-2 font-display uppercase text-xl md:text-2xl font-semibold leading-none">
                Alle Leistungen
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
