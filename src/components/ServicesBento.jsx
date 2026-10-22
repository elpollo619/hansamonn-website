import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { servicesData } from '@/components/servicesData';

// The two halves of the company, each with its own services.
const GROUPS = [
  { key: 'architektur', title: 'Architektur', intro: 'Vom ersten Entwurf bis zur Bauabnahme.', to: '/architektur' },
  { key: 'immobilien', title: 'Immobilien', intro: 'Kaufen, vermieten und Liegenschaften pflegen.', to: '/immobilien' },
];

function ServiceRow({ service }) {
  const Icon = service.icon;
  return (
    <li>
      <Link
        to={`/leistungen/${service.slug}`}
        className="group flex items-start gap-4 py-4 border-t border-gray-200 hover:border-[#1F497D] transition-colors"
      >
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-blue-50 text-[#1F497D]">
          <Icon size={17} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg md:text-xl font-semibold leading-snug text-[#121D2B] group-hover:text-[#1F497D] transition-colors">
            {service.title}
          </span>
          <span className="block mt-0.5 text-sm text-gray-500 leading-snug">{service.features.join(' · ')}</span>
        </span>
        <ArrowUpRight
          size={18}
          className="mt-1 shrink-0 text-gray-300 transition-all group-hover:text-[#1F497D] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

/** Services grouped by the two business areas, as compact link lists. */
export default function ServicesBento() {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Leistungen</p>
            <h2 className="display-heading text-3xl md:text-4xl">Alles aus einer Hand</h2>
          </div>
          <p className="text-gray-500 max-w-sm leading-relaxed md:text-right">
            Von der ersten Skizze über den Bau bis zur Vermietung und Bewirtschaftung.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {GROUPS.map((g, gi) => (
            <motion.div
              key={g.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: gi * 0.08 }}
            >
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold text-[#1F497D]">{g.title}</h3>
                <Link to={g.to} className="text-sm font-semibold text-gray-600 hover:text-[#1F497D] inline-flex items-center gap-1">
                  Übersicht <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <p className="mb-5 text-gray-600">{g.intro}</p>
              <ul className="border-b border-gray-200">
                {servicesData.filter((s) => s.category === g.key).map((s) => (
                  <ServiceRow key={s.slug} service={s} />
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/leistungen"
            className="inline-flex items-center gap-2 bg-[#1F497D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#173963] transition-colors"
          >
            Alle Leistungen im Detail <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
