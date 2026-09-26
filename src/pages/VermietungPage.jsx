import React, { useState, useMemo, useEffect } from 'react';
import SkeletonGrid from '@/components/SkeletonGrid';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Home, Phone, Mail, ArrowRight,
  CheckCircle2, ExternalLink, Coffee, Building2, Sun,
  Bell, Search, X, SlidersHorizontal, CalendarCheck,
} from 'lucide-react';
import { useTranslation } from '@/i18n';
import { getNormalizedVisibleProperties } from '@/data/propertiesStore';
import InteractiveMapSection from '@/components/InteractiveMapSection';
import CompareButton from '@/components/CompareButton';
import OccupancyBadge from '@/components/OccupancyBadge';
import FavoriteButton from '@/components/FavoriteButton';
import { useNextFree } from '@/hooks/useNextFree';
import PageHero from '@/components/PageHero';

const BRAND = 'var(--brand-color, #1D3D78)';

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CFG = {
  apartment:   { color: 'gray', badge: 'bg-white/90 text-gray-800 border-transparent', icon: Home },
  'long-stay': { color: 'gray', badge: 'bg-white/90 text-gray-800 border-transparent', icon: Coffee },
  hotel:       { color: 'gray', badge: 'bg-white/90 text-gray-800 border-transparent', icon: Building2 },
  project:     { color: 'gray', badge: 'bg-white/90 text-gray-800 border-transparent', icon: Sun },
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
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border ${cfg.badge}`}>
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
      decoding="async"
      onError={() => setErrored(true)}
    />
  );
};

// ─── Detail URL: use the link stored in propertiesStore (or fallback) ─────────

const getDetailUrl = (item) =>
  item.link || `/immobilien/${item.id || item.slug}`;

// ─── Card CTAs per type ───────────────────────────────────────────────────────

const HotelCTA = ({ item, t }) => (
  <div className="space-y-2">
    <Link
      to={getDetailUrl(item)}
      className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 px-6 transition-colors text-sm"
      style={{ backgroundColor: BRAND }}
    >
      {t('vermietung.card.viewProject')}
      <ArrowRight size={15} />
    </Link>
    <div className="grid grid-cols-2 gap-2">
      {item.bookingUrls?.booking && (
        <a href={item.bookingUrls.booking} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 px-3 transition-colors text-xs font-semibold">
          <ExternalLink size={12} /> Booking.com
        </a>
      )}
      {item.bookingUrls?.airbnb && (
        <a href={item.bookingUrls.airbnb} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 px-3 transition-colors text-xs font-semibold">
          <ExternalLink size={12} /> Airbnb
        </a>
      )}
    </div>
  </div>
);

const NavyCTA = ({ to, label }) => (
  <Link
    to={to}
    className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 px-6 transition-colors text-sm"
    style={{ backgroundColor: BRAND }}
    onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
    onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
  >
    {label}
    <ArrowRight size={15} />
  </Link>
);

const LongStayCTA = ({ item, t }) => <NavyCTA to={getDetailUrl(item)} label={t('vermietung.card.viewProject')} />;
const ProjectCTA  = ({ item, t }) => <NavyCTA to={getDetailUrl(item)} label={t('vermietung.card.viewProject')} />;
const ApartmentCTA = ({ item })    => <NavyCTA to={item.link || `/immobilien/${item.id || item.slug}`} label="Mehr erfahren" />;

// ─── Listing Card ─────────────────────────────────────────────────────────────

const ListingCard = ({ item, index, t }) => {
  const image      = (item.images && item.images[0]) || { url: '', alt: item.title };
  const isHotel    = item.type === 'hotel';
  const isProject  = item.type === 'project';
  const isLongStay = item.type === 'long-stay';
  const isApartment = item.type === 'apartment';
  const showCalendar = (isProject || isHotel) && item.icalUrl;
  const nextFree   = useNextFree(showCalendar ? item.icalUrl : null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.07 }}
      viewport={{ once: true }}
      className="group bg-white overflow-hidden border border-gray-100 flex flex-col transition-colors duration-300 hover:border-gray-300"
    >
      {/* Image */}
      <Link to={getDetailUrl(item)} className={`relative overflow-hidden block bg-gray-100 ${isProject ? 'h-60' : 'h-56'}`}>
        <RentalImage
          src={image.url}
          alt={image.alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/40 via-transparent to-transparent" />

        {/* Top-left type badge */}
        <div className="absolute top-3 left-3">
          <TypeBadge type={item.type} t={t} />
        </div>

        {/* Top-right favorite button */}
        <div className="absolute top-3 right-3">
          <FavoriteButton propertyId={item.id} size="md" />
        </div>

        {/* Price chip */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white px-3 py-2">
            {item.price ? (
              <span className="font-bold text-sm text-gray-900">
                CHF {item.price.toLocaleString('de-CH')}
                <span className="text-gray-400 font-normal text-xs">
                  {isHotel ? t('vermietung.card.nightPrice') : `${t('vermietung.longStay.from')}${t('common.perMonth')}`}
                </span>
              </span>
            ) : (
              <span className="text-gray-600 font-semibold text-xs">
                {t('vermietung.project.onRequest')}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <Link to={getDetailUrl(item)} className="min-w-0 hover:text-[#1D3D78] transition-colors">
            <h3 className="font-display uppercase text-xl font-semibold leading-tight">{item.title}</h3>
          </Link>
          <div className="flex-shrink-0"><OccupancyBadge status={item.occupancy || 'frei'} /></div>
        </div>
        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{item.subtitle}</p>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-5">
          <MapPin size={12} className="flex-shrink-0" />
          <span>{item.location}</span>
        </div>

        {/* Long stay: pricing chips */}
        {isLongStay && item.longStayRooms && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.longStayRooms.filter(r => !r.isAddon).slice(0, 2).map((room, i) => (
              <span key={i} className="bg-gray-50 text-gray-500 text-xs px-2.5 py-1 border border-gray-100">
                {room.label}{room.size ? ` ${room.size}m²` : ''} · CHF {room.price}
              </span>
            ))}
          </div>
        )}

        {/* Hotel: feature chips */}
        {isHotel && item.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.features.slice(0, 3).map((f) => (
              <span key={f} className="bg-gray-50 text-gray-500 text-xs px-2 py-0.5">{f}</span>
            ))}
          </div>
        )}

        {/* Project: feature chips */}
        {isProject && item.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.features.slice(0, 3).map((f) => (
              <span key={f} className="bg-gray-50 text-gray-500 text-xs px-2 py-0.5">{f}</span>
            ))}
          </div>
        )}

        {/* Features fallback for long-stay without room data */}
        {isLongStay && !item.longStayRooms && item.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.features.slice(0, 3).map((f) => (
              <span key={f} className="bg-gray-50 text-gray-500 text-xs px-2.5 py-1 border border-gray-100">{f}</span>
            ))}
          </div>
        )}

        {/* Next free date badge (ferienhaus / hotel with calendar) */}
        {nextFree && (
          <div className="flex items-center gap-2 text-xs bg-green-50 border border-green-100 px-3 py-2 mb-2">
            <CalendarCheck size={12} className="text-green-600 flex-shrink-0" />
            <span className="text-green-700 font-medium">
              Frei ab {new Date(nextFree).toLocaleDateString('de-CH', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto space-y-2">
          {isHotel     && <HotelCTA item={item} t={t} />}
          {isProject   && <ProjectCTA item={item} t={t} />}
          {isLongStay  && <LongStayCTA item={item} t={t} />}
          {isApartment && <ApartmentCTA item={item} />}

          {/* Compare button */}
          <div className="pt-1">
            <CompareButton propertyId={item.id} propertyName={item.title} />
          </div>
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
    <div className="bg-white border border-gray-100 p-10 md:p-14 text-center max-w-xl mx-auto">
      <Home size={30} className="mx-auto mb-5" style={{ color: BRAND }} />
      <h3 className="font-display uppercase text-2xl font-semibold text-[#0F1B2D] mb-3">
        Aktuell keine Wohnungen verfügbar
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
        Wir haben derzeit keine freien Mietwohnungen. Möchten Sie informiert werden, sobald eine Wohnung verfügbar wird?
      </p>
      <a
        href="mailto:office@reto-amonn.ch?subject=Warteliste%20Wohnung&body=Ich%20m%C3%B6chte%20auf%20die%20Warteliste%20f%C3%BCr%20eine%20Mietwohnung%20gesetzt%20werden."
        className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 transition-colors text-sm"
        style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
        onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
        onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
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

// ─── Price range helper ───────────────────────────────────────────────────────

const PRICE_RANGES = [
  { key: 'all',    label: 'Alle Preise' },
  { key: 'under1000', label: 'Bis CHF 1000' },
  { key: '1000-2000', label: 'CHF 1000–2000' },
  { key: 'over2000',  label: 'Über CHF 2000' },
];

const priceInRange = (price, rangeKey) => {
  if (rangeKey === 'all') return true;
  if (price === null || price === undefined) return false;
  if (rangeKey === 'under1000') return price < 1000;
  if (rangeKey === '1000-2000') return price >= 1000 && price <= 2000;
  if (rangeKey === 'over2000')  return price > 2000;
  return true;
};

// ─── Type label map for filter dropdown ──────────────────────────────────────

const TYPE_LABELS = {
  'all':        'Alle Typen',
  'long-stay':  'Langzeitmiete',
  'hotel':      'Hotel',
  'project':    'Ferienhaus',
  'apartment':  'Ferienwohnung',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const VermietungPage = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Search & filter state
  const [searchQuery, setSearchQuery]   = useState('');
  const [typeFilter,  setTypeFilter]    = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [priceFilter, setPriceFilter]   = useState('all');

  const allItems = getNormalizedVisibleProperties();

  // Derive unique locations from data
  const uniqueLocations = useMemo(() => {
    const locs = allItems
      .map((item) => item.location)
      .filter(Boolean);
    return ['all', ...Array.from(new Set(locs))];
  }, [allItems]);

  const counts = {
    apartment:   allItems.filter((a) => a.type === 'apartment').length,
    'long-stay': allItems.filter((a) => a.type === 'long-stay').length,
    hotel:       allItems.filter((a) => a.type === 'hotel').length,
    project:     allItems.filter((a) => a.type === 'project').length,
  };

  // Tab-filtered items (existing tab behaviour)
  const tabFiltered = filter === 'all'
    ? allItems
    : allItems.filter((a) => a.type === filter);

  // Apply search + dropdowns on top of the tab result
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tabFiltered.filter((item) => {
      // Search
      if (q) {
        const haystack = [
          item.title   || '',
          item.location || '',
          item.subtitle || item.description || '',
        ].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Type dropdown
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      // Location dropdown
      if (locationFilter !== 'all' && item.location !== locationFilter) return false;
      // Price range
      if (!priceInRange(item.price, priceFilter)) return false;
      return true;
    });
  }, [tabFiltered, searchQuery, typeFilter, locationFilter, priceFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    typeFilter !== 'all' ||
    locationFilter !== 'all' ||
    priceFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setLocationFilter('all');
    setPriceFilter('all');
  };

  const tabs = [
    { key: 'all',       label: 'Alle Angebote',  count: allItems.length },
    { key: 'long-stay', label: 'Long Stay',       count: counts['long-stay'] },
    { key: 'hotel',     label: 'Hotel',           count: counts.hotel },
    { key: 'project',   label: 'Casa Reto',       count: counts.project },
    { key: 'apartment', label: 'Wohnungen',       count: counts.apartment, disabled: counts.apartment === 0 },
  ];

  // Service cards for hero
  const services = [
    {
      key: 'long-stay',
      icon: Coffee,
      label: 'Long Stay',
      tagline: t('vermietung.hero.serviceLongStay'),
      price: 'ab CHF 750 / Monat',
      active: true,
    },
    {
      key: 'hotel',
      icon: Building2,
      label: "N's Hotel",
      tagline: t('vermietung.hero.serviceHotel'),
      price: 'ab CHF 89 / Zimmer und Nacht',
      active: true,
    },
    {
      key: 'project',
      icon: Sun,
      label: 'Casa Reto',
      tagline: t('vermietung.hero.serviceCasaReto'),
      price: t('vermietung.project.onRequest'),
      active: true,
    },
    {
      key: 'apartment',
      icon: Home,
      label: 'Wohnungen',
      tagline: counts.apartment > 0 ? `${counts.apartment} Objekt${counts.apartment > 1 ? 'e' : ''} verfügbar` : 'Aktuell nicht verfügbar',
      price: counts.apartment > 0 ? 'Jetzt anfragen' : 'Warteliste offen',
      active: counts.apartment > 0,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('vermietung.meta.title')}</title>
        <meta name="description" content={t('vermietung.meta.description')} />
      </Helmet>

      {/* ── Hero ── */}
      <PageHero
        eyebrow="Immobilien"
        title={<span className="block">Immobilien &amp; <br className="hidden sm:block" />Wohnlösungen</span>}
        subtitle={t('vermietung.hero.subtitle')}
        image="/images/muri/titel.jpg"
      >
        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-white/70" />
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
        </div>
      </PageHero>

      {/* 4 service cards */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-2 lg:grid-cols-4 border-l border-gray-100"
          >
            {services.map((s) => {
              const Icon = s.icon;
              const isActive = filter === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => s.active && setFilter(s.key)}
                  aria-disabled={!s.active || undefined}
                  aria-pressed={s.active ? isActive : undefined}
                  className={`relative text-left px-4 py-6 md:px-7 md:py-8 border-r border-b lg:border-b-0 border-gray-100 transition-colors duration-200 ${
                    s.active ? 'cursor-pointer' : 'cursor-default'
                  } ${isActive ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
                >
                  <span
                    className="absolute top-0 left-0 right-0 h-0.5 transition-opacity"
                    style={{ backgroundColor: BRAND, opacity: isActive ? 1 : 0 }}
                    aria-hidden="true"
                  />
                  <Icon size={22} className="mb-4" style={{ color: s.active ? BRAND : '#9ca3af' }} />
                  <p className={`font-display uppercase text-xl font-semibold leading-none mb-2 ${s.active ? 'text-[#0F1B2D]' : 'text-gray-400'}`}>{s.label}</p>
                  <p className={`text-xs mb-3 leading-snug ${s.active ? 'text-gray-500' : 'text-gray-400'}`}>{s.tagline}</p>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${s.active ? '' : 'text-gray-400'}`} style={s.active ? { color: BRAND } : undefined}>{s.price}</p>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Listings ── */}
      <section className="py-16 md:py-20 surface-warm min-h-[60vh]">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

          {/* Filter tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => !tab.disabled && setFilter(tab.key)}
                disabled={tab.disabled}
                aria-pressed={!tab.disabled ? filter === tab.key : undefined}
                style={!tab.disabled && filter === tab.key ? { backgroundColor: BRAND } : {}}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors duration-200 whitespace-nowrap border ${
                  tab.disabled
                    ? 'bg-white text-gray-400 border-gray-100 cursor-not-allowed'
                    : filter === tab.key
                    ? 'text-white border-transparent'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 min-w-[20px] text-center ${
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

          {/* ── Search & filter bar ── */}
          <div className="bg-white border border-gray-100 p-4 md:p-5 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">

              {/* Search input */}
              <div className="relative flex-1 min-w-0">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Suchen nach Titel, Ort, Beschreibung …"
                  className="w-full pl-9 pr-8 py-3 text-sm bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1D3D78] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Suche löschen"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Typ dropdown */}
              <div className="relative sm:w-44">
                <SlidersHorizontal size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  aria-label="Nach Wohnform filtern"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full appearance-none pl-8 pr-8 py-3 text-sm bg-white border border-gray-200 text-gray-700 focus:outline-none focus:border-[#1D3D78] transition-colors cursor-pointer"
                >
                  {Object.entries(TYPE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Standort dropdown */}
              <div className="relative sm:w-52">
                <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  aria-label="Nach Standort filtern"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full appearance-none pl-8 pr-8 py-3 text-sm bg-white border border-gray-200 text-gray-700 focus:outline-none focus:border-[#1D3D78] transition-colors cursor-pointer"
                >
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc === 'all' ? 'Alle Standorte' : loc}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Preis dropdown */}
              <div className="relative sm:w-44">
                <select
                  aria-label="Nach Preis filtern"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full appearance-none pl-4 pr-8 py-3 text-sm bg-white border border-gray-200 text-gray-700 focus:outline-none focus:border-[#1D3D78] transition-colors cursor-pointer"
                >
                  {PRICE_RANGES.map((r) => (
                    <option key={r.key} value={r.key}>{r.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Results count + reset */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">{filtered.length}</span>{' '}
                {filtered.length === 1 ? 'Ergebnis' : 'Ergebnisse'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-xs font-medium transition-colors" style={{ color: 'var(--brand-color, #1D3D78)' }}
                >
                  <X size={12} />
                  Filter zurücksetzen
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <SkeletonGrid count={6} />
          ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${filter}-${searchQuery}-${typeFilter}-${locationFilter}-${priceFilter}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
            >
              {filter === 'apartment' && counts.apartment === 0 && !hasActiveFilters ? (
                <ApartmentsEmptyState />
              ) : filtered.length > 0 ? (
                filtered.map((item, i) => (
                  <ListingCard key={item.id} item={item} index={i} t={t} />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full"
                >
                  <div className="bg-white border border-gray-100 p-10 md:p-14 text-center max-w-lg mx-auto">
                    <Search size={26} className="mx-auto mb-5" style={{ color: BRAND }} />
                    <h3 className="font-display uppercase text-2xl font-semibold text-[#0F1B2D] mb-3">
                      Keine Ergebnisse gefunden
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-xs mx-auto">
                      Für Ihre aktuellen Filter wurden keine Angebote gefunden. Passen Sie die Suchkriterien an.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 transition-colors text-sm"
                      style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                      onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                      onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
                    >
                      <X size={14} />
                      Filter zurücksetzen
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
          )}

        </div>
      </section>

      {/* ── Interactive Map ── */}
      <InteractiveMapSection />

      {/* ── Bottom CTA ── */}
      <section className="py-20 md:py-24 surface-warm border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="display-heading uppercase text-3xl md:text-4xl mb-5">
              {t('vermietung.cta.title')}
            </h3>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto mb-8">
              {t('vermietung.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+41319518554"
                className="inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3 transition-colors text-sm"
                style={{ backgroundColor: BRAND }}
                onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
              >
                <Phone size={15} />
                +41 (0)31 951 85 54
              </a>
              <a
                href="mailto:office@reto-amonn.ch"
                className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-semibold px-6 py-3 transition-colors text-sm"
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
