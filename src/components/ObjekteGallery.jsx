import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { getVisibleProperties } from '@/data/propertiesStore';

const TYPE_LABEL = {
  'long-stay': 'Long Stay',
  'short-stay': 'Hotel · Short Stay',
  ferienhaus: 'Ferienhaus',
  apartment: 'Apartment',
};

/**
 * ObjekteGallery — expanding-panel gallery (21st-style) of the visible
 * properties. Desktop: hovered/focused panel expands; mobile: stacked cards.
 */
export default function ObjekteGallery() {
  const items = useMemo(
    () => getVisibleProperties().filter((p) => Array.isArray(p.images) && p.images[0]),
    []
  );
  const [active, setActive] = useState(0);

  if (items.length === 0) return null;

  return (
    <section className="py-24 surface-warm border-y border-gray-200">
      <div className="container mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Unsere Objekte</p>
            <h2 className="display-heading uppercase text-3xl md:text-4xl">Wohnen bei Amonn</h2>
          </div>
          <Link
            to="/immobilien"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#1D3D78] transition-colors"
          >
            Alle Immobilien <ArrowRight size={15} />
          </Link>
        </div>

        {/* Desktop: expanding panels */}
        <div className="hidden md:flex h-[520px] gap-2">
          {items.map((p, i) => {
            const isActive = active === i;
            return (
              <Link
                key={p.id}
                to={p.link || `/immobilien/${p.id}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group relative overflow-hidden bg-gray-200 outline-none focus-visible:ring-2 focus-visible:ring-[#1D3D78]"
                style={{
                  flexGrow: isActive ? 5 : 1,
                  flexBasis: 0,
                  transition: 'flex-grow 600ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                aria-label={p.name}
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 transition-colors duration-500 ${
                    isActive ? 'bg-gradient-to-t from-black/75 via-black/10 to-transparent' : 'bg-black/35'
                  }`}
                />

                {/* Collapsed: vertical label */}
                <span
                  className={`absolute bottom-6 left-1/2 font-display uppercase text-lg font-semibold text-white whitespace-nowrap transition-opacity duration-300 ${
                    isActive ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ writingMode: 'vertical-rl', transform: 'translateX(-50%) rotate(180deg)' }}
                >
                  {p.name}
                </span>

                {/* Expanded caption */}
                <motion.div
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 12 }}
                  transition={{ duration: 0.35, delay: isActive ? 0.15 : 0 }}
                  className="absolute bottom-0 left-0 right-0 p-7"
                >
                  <span className="block text-[10px] font-semibold uppercase tracking-hairline text-white/70 mb-2">
                    {TYPE_LABEL[p.type] || p.type}
                  </span>
                  <span className="block font-display uppercase text-3xl lg:text-4xl font-semibold text-white leading-none mb-3">
                    {p.name}
                  </span>
                  <span className="flex items-center justify-between gap-4 text-sm text-white/80">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {p.location || p.address}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                      Ansehen <ArrowRight size={14} />
                    </span>
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Mobile: stacked cards */}
        <div className="md:hidden grid gap-3">
          {items.map((p) => (
            <Link key={p.id} to={p.link || `/immobilien/${p.id}`} className="relative block h-56 overflow-hidden bg-gray-200">
              <img src={p.images[0]} alt={p.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="block text-[10px] font-semibold uppercase tracking-hairline text-white/70 mb-1">
                  {TYPE_LABEL[p.type] || p.type}
                </span>
                <span className="block font-display uppercase text-2xl font-semibold text-white leading-none">
                  {p.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
