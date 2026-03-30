import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Bell, ArrowRight, Clock, ChevronRight, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { getNormalizedVisibleProperties } from '@/data/propertiesStore';
import OccupancyBadge from '@/components/OccupancyBadge';

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
      transition={{ duration: 0.45, delay: index * 0.07 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Image */}
      <Link to={detailUrl} className="relative overflow-hidden block h-52">
        <AptImage
          src={image.url}
          alt={image.alt || item.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border bg-blue-100 text-blue-700 border-blue-200">
            <Home size={11} />
            Wohnung
          </span>
        </div>

        {/* Price chip */}
        {item.price && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
              <span className="font-bold text-sm text-gray-900">
                CHF {item.price.toLocaleString('de-CH')}
                <span className="text-gray-400 font-normal text-xs"> / Mt.</span>
              </span>
            </div>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <Link to={detailUrl} className="hover:text-blue-700 transition-colors">
            <h3 className="text-base font-semibold text-gray-900 leading-snug">{item.title}</h3>
          </Link>
          <OccupancyBadge status={item.occupancy || 'frei'} />
        </div>
        {item.subtitle && (
          <p className="text-xs text-gray-500 mb-2.5 leading-snug">{item.subtitle}</p>
        )}
        {item.location && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <MapPin size={11} className="flex-shrink-0" />
            <span>{item.location}</span>
          </div>
        )}

        {/* Feature chips */}
        {item.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.features.slice(0, 3).map((f) => (
              <span key={f} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full border border-blue-100">
                {f}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto">
          <Link
            to={detailUrl}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
          >
            Details ansehen
            <ArrowRight size={14} />
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
    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
      <Home size={32} className="text-blue-400" />
    </div>
    <h2 className="text-2xl font-semibold text-gray-900 mb-3">Aktuell keine Wohnungen verfügbar</h2>
    <p className="text-gray-500 leading-relaxed mb-8">
      Wir haben derzeit keine freien Mietwohnungen. Lassen Sie sich auf unsere Warteliste setzen — wir informieren Sie sobald etwas verfügbar wird.
    </p>
    <div className="space-y-3">
      <a
        href="mailto:office@reto-amonn.ch?subject=Warteliste%20Wohnung&body=Ich%20m%C3%B6chte%20auf%20die%20Warteliste%20f%C3%BCr%20eine%20Mietwohnung%20gesetzt%20werden."
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
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
      className="max-w-2xl mx-auto mt-16 bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm"
    >
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-3">
        <Clock size={15} className="text-blue-400" />
        <span className="font-medium text-gray-700">Weitere Apartments folgen</span>
      </div>
      <p className="text-sm text-gray-400 mb-5">Neue Objekte werden laufend ergänzt. Schauen Sie regelmässig vorbei oder kontaktieren Sie uns direkt.</p>
      <Link
        to="/immobilien/anfrage"
        className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
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
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="relative container mx-auto px-6 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/immobilien" className="inline-flex items-center gap-2 text-slate-300/70 hover:text-white text-sm mb-6 transition-colors">
              <ChevronRight size={14} className="rotate-180" /> Immobilien
            </Link>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full mb-5">
              <Home size={12} /> Apartments
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-5">Apartments</h1>
            <p className="text-slate-200/70 text-lg max-w-2xl">
              Mietwohnungen und Apartments in Kerzers und Umgebung.
              {apartments.length > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 bg-blue-500/20 border border-blue-400/30 text-blue-200 text-sm px-2.5 py-0.5 rounded-full">
                  {apartments.length} verfügbar
                </span>
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          {apartments.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
