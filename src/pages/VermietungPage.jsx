import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Home, Phone, Mail, ArrowRight,
  CheckCircle2, ExternalLink, Coffee, Building2, Sun,
  Bell,
} from 'lucide-react';
import { useTranslation } from '@/i18n';
import { getVisibleListings } from '@/data/rentalData';
import InteractiveMapSection from '@/components/InteractiveMapSection';

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CFG = {
  apartment:   { color: 'blue',    badge: 'bg-blue-100 text-blue-700 border-blue-200',     icon: Home },
  'long-stay': { color: 'amber',   badge: 'bg-amber-100 text-amber-700 border-amber-200',  icon: Coffee },
  hotel:       { color: 'indigo',  badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',icon: Building2 },
  project:     { color: 'emerald', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Sun },
};

const TypeBadge = ({ type, t }) => {
  const cfg = TYPE_CFG[type] || TYPE_CFG.apartment;
  const Icon = cfg.icon;
  const labels = {
    apartment:   t('vermietung.types.apartment'),
    'long-stay': t('vermietung.types.longStay'),
    hotel:       t('vermietung.types.hotel'),
    project:     t('vermietung.types.project'),
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
      <Icon size={11} />
      {labels[type] || type}
    </span>
  );
};

// ─── Rental image with graceful fallback ─────────────────────────────────────

const RentalImage = ({ src, alt, className }) => {
  const [errored, setErrored] = useState(false);
  return errored ? (
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

// ─── Card CTAs per type ───────────────────────────────────────────────────────

const HotelCTA = ({ item, t }) => (
  <div className="space-y-2">
    <a
      href={item.directBookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
    >
      <ExternalLink size={14} />
      {t('vermietung.hotel.bookDirectly')}
    </a>
    <div className="grid grid-cols-2 gap-2">
      <a href={item.bookingUrls.booking} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors text-xs font-medium">
        <ExternalLink size={10} /> Booking.com
      </a>
      <a href={item.bookingUrls.airbnb} target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 py-2 px-3 rounded-lg transition-colors text-xs font-medium">
        <ExternalLink size={10} /> Airbnb
      </a>
    </div>
  </div>
);

const LongStayCTA = ({ item, t }) => (
  <a
    href={`mailto:office@reto-amonn.ch?subject=${encodeURIComponent(`Long Stay Anfrage – ${item.title}`)}`}
    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
  >
    <Mail size={14} />
    {t('vermietung.longStay.requestTitle')}
  </a>
);

const ProjectCTA = ({ item, t }) => (
  <div className="space-y-2">
    <Link
      to="/casa-reto"
      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
    >
      {t('vermietung.card.viewProject')}
      <ArrowRight size={14} />
    </Link>
  </div>
);

// ─── Listing Card ─────────────────────────────────────────────────────────────

const ListingCard = ({ item, index, t }) => {
  const image    = item.images[0];
  const isHotel  = item.type === 'hotel';
  const isProject = item.type === 'project';
  const isLongStay = item.type === 'long-stay';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      viewport={{ once: true }}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
        isProject ? 'border-emerald-100 ring-1 ring-emerald-100' : 'border-gray-100'
      }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${isProject ? 'h-56' : 'h-52'}`}>
        <RentalImage
          src={image.url}
          alt={image.alt}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top-left type badge */}
        <div className="absolute top-3 left-3">
          <TypeBadge type={item.type} t={t} />
        </div>

        {/* Price chip */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
            {item.price ? (
              <span className="font-bold text-sm text-gray-900">
                CHF {item.price.toLocaleString('de-CH')}
                <span className="text-gray-400 font-normal text-xs">
                  {isHotel ? t('vermietung.card.nightPrice') : `${t('vermietung.longStay.from')}${t('common.perMonth')}`}
                </span>
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold text-xs">
                {t('vermietung.project.onRequest')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-semibold text-gray-900 mb-0.5 leading-snug">{item.title}</h3>
        <p className="text-xs text-gray-500 mb-2.5 leading-snug">{item.subtitle}</p>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <MapPin size={11} className="flex-shrink-0" />
          <span>{item.location}</span>
        </div>

        {/* Long stay: pricing chips */}
        {isLongStay && item.longStayRooms && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.longStayRooms.filter(r => !r.isAddon).slice(0, 2).map((room, i) => (
              <span key={i} className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full border border-amber-100">
                {room.label}{room.size ? ` ${room.size}m²` : ''} — CHF {room.price}
              </span>
            ))}
          </div>
        )}

        {/* Hotel: feature chips */}
        {isHotel && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.features.slice(0, 3).map((f) => (
              <span key={f} className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full">{f}</span>
            ))}
          </div>
        )}

        {/* Project: feature chips */}
        {isProject && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.features.slice(0, 3).map((f) => (
              <span key={f} className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full">{f}</span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto">
          {isHotel    && <HotelCTA item={item} t={t} />}
          {isProject  && <ProjectCTA item={item} t={t} />}
          {isLongStay && <LongStayCTA item={item} t={t} />}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Apartments empty state ───────────────────────────────────────────────────

const ApartmentsEmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="col-span-full"
  >
    <div className="bg-white rounded-2xl border border-gray-100 p-10 md:p-14 text-center max-w-xl mx-auto">
      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Home size={24} className="text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Aktuell keine Wohnungen verfügbar
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
        Wir haben derzeit keine freien Mietwohnungen. Möchten Sie informiert werden, sobald eine Wohnung verfügbar wird?
      </p>
      <a
        href="mailto:office@reto-amonn.ch?subject=Warteliste%20Wohnung&body=Ich%20m%C3%B6chte%20auf%20die%20Warteliste%20f%C3%BCr%20eine%20Mietwohnung%20gesetzt%20werden."
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
      >
        <Bell size={15} />
        Auf Warteliste setzen
      </a>
      <p className="text-xs text-gray-400 mt-3">
        Wir melden uns sobald etwas frei wird.
      </p>
    </div>
  </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const VermietungPage = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');

  const allItems = getVisibleListings();

  const counts = {
    apartment:   0, // hidden
    'long-stay': allItems.filter((a) => a.type === 'long-stay').length,
    hotel:       allItems.filter((a) => a.type === 'hotel').length,
    project:     allItems.filter((a) => a.type === 'project').length,
  };

  const filtered = filter === 'all'
    ? allItems
    : filter === 'apartment'
    ? []                                               // show empty state
    : allItems.filter((a) => a.type === filter);

  const tabs = [
    { key: 'all',       label: 'Alle Angebote',  count: allItems.length },
    { key: 'long-stay', label: 'Long Stay',       count: counts['long-stay'] },
    { key: 'hotel',     label: 'Hotel',           count: counts.hotel },
    { key: 'project',   label: 'Casa Reto',       count: counts.project },
    { key: 'apartment', label: 'Wohnungen',       count: 0, disabled: true },
  ];

  // Service cards for hero
  const services = [
    {
      key: 'long-stay',
      icon: Coffee,
      label: 'Long Stay',
      tagline: t('vermietung.hero.serviceLongStay'),
      price: 'ab CHF 750 / Monat',
      color: 'from-amber-500/20 to-amber-600/10',
      border: 'border-amber-300/30',
      iconBg: 'bg-amber-500/20',
      active: true,
    },
    {
      key: 'hotel',
      icon: Building2,
      label: "N's Hotel",
      tagline: t('vermietung.hero.serviceHotel'),
      price: 'ab CHF 89 / Nacht',
      color: 'from-indigo-500/20 to-indigo-600/10',
      border: 'border-indigo-300/30',
      iconBg: 'bg-indigo-500/20',
      active: true,
    },
    {
      key: 'project',
      icon: Sun,
      label: 'Casa Reto',
      tagline: t('vermietung.hero.serviceCasaReto'),
      price: t('vermietung.project.onRequest'),
      color: 'from-emerald-500/20 to-emerald-600/10',
      border: 'border-emerald-300/30',
      iconBg: 'bg-emerald-500/20',
      active: true,
    },
    {
      key: 'apartment',
      icon: Home,
      label: 'Wohnungen',
      tagline: 'Aktuell nicht verfügbar',
      price: 'Warteliste offen',
      color: 'from-gray-500/10 to-gray-500/5',
      border: 'border-gray-500/20',
      iconBg: 'bg-gray-400/20',
      active: false,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('vermietung.meta.title')}</title>
        <meta name="description" content={t('vermietung.meta.description')} />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '48px 48px' }}
        />
        <div className="relative container mx-auto max-w-5xl px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-center mb-10"
          >
            <span className="inline-block bg-white/10 border border-white/20 text-white/80 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
              AMONN IMMOBILIEN
            </span>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
              Immobilien &amp; Wohnlösungen
            </h1>
            <p className="text-blue-200/80 text-base md:text-lg max-w-2xl mx-auto">
              {t('vermietung.hero.subtitle')}
            </p>
          </motion.div>

          {/* 4 service cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.key}
                  onClick={() => s.active && setFilter(s.key)}
                  className={`text-left p-4 rounded-2xl border backdrop-blur-sm transition-all duration-200 ${
                    s.active ? 'cursor-pointer' : 'cursor-default'
                  } ${
                    filter === s.key
                      ? 'bg-white/20 border-white/40 shadow-lg scale-[1.02]'
                      : `bg-gradient-to-br ${s.color} ${s.border} ${s.active ? 'hover:bg-white/10' : 'opacity-50'}`
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.iconBg}`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <p className={`text-sm font-semibold mb-0.5 ${s.active ? 'text-white' : 'text-white/50'}`}>{s.label}</p>
                  <p className={`text-xs mb-2 leading-snug ${s.active ? 'text-white/60' : 'text-white/35'}`}>{s.tagline}</p>
                  <p className={`text-xs font-medium ${s.active ? 'text-white/80' : 'text-white/35'}`}>{s.price}</p>
                </button>
              );
            })}
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200/60"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-400" />
              <span><strong className="text-white">{allItems.length}</strong> aktive Angebote</span>
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={13} />
              Kerzers · Muri · Münchenbuchsee
            </span>
            <a href="tel:+41319518554" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={13} />
              +41 (0)31 951 85 54
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Listings ── */}
      <section className="py-10 bg-gray-50 min-h-[60vh]">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

          {/* Filter tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => !tab.disabled && setFilter(tab.key)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  tab.disabled
                    ? 'bg-white text-gray-300 border border-gray-100 cursor-not-allowed'
                    : filter === tab.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {tab.label}
                {tab.key !== 'apartment' && (
                  <span className={`text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
                    filter === tab.key ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.disabled && (
                  <span className="text-xs text-gray-300 italic">–</span>
                )}
              </button>
            ))}
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
            >
              {filter === 'apartment' ? (
                <ApartmentsEmptyState />
              ) : filtered.length > 0 ? (
                filtered.map((item, i) => (
                  <ListingCard key={item.id} item={item} index={i} t={t} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-400">Keine Angebote in dieser Kategorie.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* ── Interactive Map ── */}
      <InteractiveMapSection />

      {/* ── Bottom CTA ── */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-0 bg-white rounded-2xl border border-gray-100 p-8 md:p-10 text-center"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('vermietung.cta.title')}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm">
              {t('vermietung.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+41319518554"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                <Phone size={15} />
                +41 (0)31 951 85 54
              </a>
              <a
                href="mailto:office@reto-amonn.ch"
                className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                <Mail size={15} />
                office@reto-amonn.ch
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default VermietungPage;
