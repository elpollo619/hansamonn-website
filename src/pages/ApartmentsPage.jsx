import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Bell, ArrowRight, Clock, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { getNormalizedVisibleProperties } from '@/data/propertiesStore';
import OccupancyBadge from '@/components/OccupancyBadge';
import PageHero from '@/components/PageHero';

const BRAND = 'var(--brand-color, #1D3D78)';

// ─── Image with graceful fallback ─────────────────────────────────────────────

const AptImage = ({ src, alt, className }) => {
  const [errored, setErrored] = useState(false);
  return errored || !src ? (
    <div className={`${className} bg-gray-100 flex items-center justify-center`}>
      <Home size={32} className="text-gray-300" />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
    />
  );
};

// ─── Single apartment card ─────────────────────────────────────────────────────

const ApartmentCard = ({ item, index }) => {
  const image = item.images?.[0] || { url: '', alt: item.title };
  const detailUrl = item.link || `/immobilien/${item.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.07 }}
      viewport={{ once: true }}
      className="group bg-white overflow-hidden border border-gray-100 hover:border-gray-300 transition-colors flex flex-col"
    >
      {/* Image */}
      <Link to={detailUrl} className="relative overflow-hidden block aspect-[4/3] bg-gray-100">
        <AptImage
          src={image.url}
          alt={image.alt || item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/90 text-gray-800">
            <Home size={11} />
            Wohnung
          </span>
        </div>

        {/* Price chip */}
        {item.price && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-white px-3 py-2">
              <span className="font-bold text-sm text-gray-900">
                CHF {item.price.toLocaleString('de-CH')}
                <span className="text-gray-400 font-normal text-xs"> / Mt.</span>
              </span>
            </div>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link to={detailUrl} className="min-w-0 hover:text-[#1D3D78] transition-colors">
            <h3 className="font-display uppercase text-xl font-semibold leading-tight">{item.title}</h3>
          </Link>
          <div className="flex-shrink-0"><OccupancyBadge status={item.occupancy || 'frei'} /></div>
        </div>
        {item.subtitle && (
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{item.subtitle}</p>
        )}
        {item.location && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-5">
            <MapPin size={11} className="flex-shrink-0" />
            <span>{item.location}</span>
          </div>
        )}

        {/* Feature chips */}
        {item.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.features.slice(0, 3).map((f) => (
              <span key={f} className="text-gray-600 text-xs px-2.5 py-1 border border-gray-200">
                {f}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto">
          <Link
            to={detailUrl}
            className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 px-6 transition-colors text-sm" style={{ backgroundColor: BRAND }}
          >
            Details ansehen
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Empty state ───────────────────────────────────────────────────────────────

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="max-w-lg mx-auto text-center"
  >
    <Home size={34} className="mx-auto mb-6" style={{ color: BRAND }} />
    <h2 className="display-heading uppercase text-3xl md:text-4xl mb-4">Aktuell keine Wohnungen verfügbar</h2>
    <p className="text-gray-600 leading-relaxed mb-8">
      Wir haben derzeit keine freien Mietwohnungen. Lassen Sie sich auf unsere Warteliste setzen — wir informieren Sie sobald etwas verfügbar wird.
    </p>
    <div className="space-y-3">
      <a
        href="mailto:office@reto-amonn.ch?subject=Warteliste%20Wohnung&body=Ich%20m%C3%B6chte%20auf%20die%20Warteliste%20f%C3%BCr%20eine%20Mietwohnung%20gesetzt%20werden."
        className="inline-flex items-center gap-2 text-white font-semibold text-sm px-6 py-3 transition-colors" style={{ backgroundColor: BRAND }}
      >
        <Bell size={15} /> Auf Warteliste setzen
      </a>
      <p className="text-xs text-gray-400 mt-2">Wir melden uns, sobald etwas frei wird.</p>
    </div>

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: true }}
      className="max-w-2xl mx-auto mt-16 bg-white border border-gray-100 p-8 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock size={18} style={{ color: BRAND }} />
        <span className="font-display uppercase text-xl font-semibold text-[#0F1B2D]">Weitere Apartments folgen</span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-6">Neue Objekte werden laufend ergänzt. Schauen Sie regelmässig vorbei oder kontaktieren Sie uns direkt.</p>
      <Link
        to="/immobilien/anfrage"
        className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-3 transition-colors text-sm"
      >
        Zur Mietanfrage <ArrowRight size={14} />
      </Link>
    </motion.div>
  </motion.div>
);

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ApartmentsPage() {
  const apartments = getNormalizedVisibleProperties().filter((p) => p.type === 'apartment');

  return (
    <div className="bg-white">
      <Helmet>
        <title>Mietwohnungen – Hans Amonn AG</title>
        <meta name="description" content="Moderne Mietwohnungen in Kerzers und Umgebung. Kontaktieren Sie uns für aktuelle Verfügbarkeit." />
      </Helmet>

      {/* Hero */}
      <PageHero
        back={{ to: '/immobilien', label: 'Immobilien' }}
        eyebrow="Hans Amonn AG · Apartments"
        title="Apartments"
        subtitle={
          <>
            Mietwohnungen und Apartments in Kerzers und Umgebung.
            {apartments.length > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 border border-white/40 text-white text-sm font-semibold px-2.5 py-0.5 align-middle">
                {apartments.length} verfügbar
              </span>
            )}
          </>
        }
        image="/images/kerzers/04.jpg"
      />

      {/* Content */}
      <section className="py-20 md:py-24 surface-warm">
        <div className="container mx-auto px-6">
          {apartments.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {apartments.map((item, i) => (
                <ApartmentCard key={item.id} item={item} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </div>
  );
}
