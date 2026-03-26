import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Phone, Mail, MapPin, Home, Maximize2,
  CheckCircle2, Calendar, ChevronLeft, ChevronRight, X,
  ExternalLink, Sun, Coffee, Building2, Car,
} from 'lucide-react';
import { useTranslation } from '@/i18n';
import { getListingBySlug } from '@/data/rentalData';
import { getPropertyById } from '@/data/propertiesStore';
import MietanfrageForm from '@/components/MietanfrageForm';

// Normalize a propertiesStore property to the format ApartmentDetailPage expects
function normalizeStoreProperty(p) {
  const images = (Array.isArray(p.images) ? p.images : [])
    .filter(Boolean)
    .map((img) => (typeof img === 'string' ? { url: img, alt: p.name } : img));
  if (images.length === 0) images.push({ url: '', alt: p.name || 'Wohnung' });
  const typeMap = { 'short-stay': 'hotel', ferienhaus: 'project' };
  return {
    id: p.id,
    slug: p.id,
    type: typeMap[p.type] || p.type || 'apartment',
    status: p.status === 'verfügbar' ? 'available' : 'rented',
    title: p.name || 'Wohnung',
    subtitle: p.description || '',
    location: p.address || p.location || '',
    price: p.priceFrom || null,
    currency: p.priceCurrency || 'CHF',
    rooms: p.rooms || null,
    size: p.size || null,
    availableFrom: p.availableFrom || null,
    images,
    features: Array.isArray(p.features) ? p.features : [],
    details: p.details || null,
    contact: p.contact || { phone: '+41 (0)31 951 85 54', email: 'office@reto-amonn.ch' },
    directBookingUrl: p.bookingUrl || '',
    bookingUrls: { booking: p.bookingUrl || '', airbnb: p.airbnbUrl || '' },
    longStayRooms: p.longStayRooms || null,
    holidayHome: false,
  };
}

// ─── Image with fallback ──────────────────────────────────────────────────────

const RentalImage = ({ src, alt, className }) => {
  const [err, setErr] = useState(false);
  return err ? (
    <div className={`${className} bg-gray-100 flex items-center justify-center`}>
      <Home size={32} className="text-gray-300" />
    </div>
  ) : (
    <img src={src} alt={alt} className={className} loading="lazy" onError={() => setErr(true)} />
  );
};

// ─── Lightbox ──────────────────────────────────────────────────────────────

const ImageLightbox = ({ images, activeIndex, onClose, onPrev, onNext }) => (
  <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
    <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10">
      <X size={24} />
    </button>
    <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10">
      <ChevronLeft size={28} />
    </button>
    <img
      src={images[activeIndex].url}
      alt={images[activeIndex].alt}
      className="max-h-[85vh] max-w-full object-contain rounded-lg"
      onClick={(e) => e.stopPropagation()}
    />
    <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10">
      <ChevronRight size={28} />
    </button>
    <p className="absolute bottom-4 text-white/50 text-sm">{activeIndex + 1} / {images.length}</p>
  </div>
);

// ─── Type badge ────────────────────────────────────────────────────────────

const TypeBadge = ({ type, t }) => {
  const cfg = {
    apartment:   { icon: Home,      cls: 'bg-blue-100 text-blue-700 border border-blue-200' },
    'long-stay': { icon: Coffee,    cls: 'bg-amber-100 text-amber-700 border border-amber-200' },
    hotel:       { icon: Building2, cls: 'bg-indigo-100 text-indigo-700 border border-indigo-200' },
    project:     { icon: Sun,       cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  }[type] || { icon: Home, cls: 'bg-blue-100 text-blue-700' };
  const Icon = cfg.icon;
  const labels = {
    apartment:   t('vermietung.types.apartment'),
    'long-stay': t('vermietung.types.longStay'),
    hotel:       t('vermietung.types.hotel'),
    project:     t('vermietung.types.project'),
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.cls}`}>
      <Icon size={12} />
      {labels[type] || type}
    </span>
  );
};

// ─── HOTEL SIDEBAR ─────────────────────────────────────────────────────────

const HotelSidebar = ({ apt, t }) => (
  <motion.div
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24"
  >
    {/* Price header */}
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5 text-white">
      <TypeBadge type="hotel" t={t} />
      <p className="text-3xl font-bold mt-3">
        {apt.currency} {apt.price}
        <span className="text-base font-normal opacity-70"> {t('vermietung.card.nightPrice')}</span>
      </p>
      <p className="text-sm opacity-70 mt-1">{apt.location}</p>
    </div>

    <div className="p-5 space-y-3">
      {/* 1. Direct booking — PRIMARY */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          {t('vermietung.hotel.bookDirectly')}
        </p>
        <a
          href={apt.directBookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl transition-colors text-base"
        >
          <ExternalLink size={18} />
          {t('vermietung.hotel.bookDirectly')}
        </a>
        <p className="text-xs text-gray-400 text-center mt-1.5">ns-hotel.ch – {t('vermietung.hotel.directBookingNote')}</p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">{t('vermietung.hotel.orPlatforms')}</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* 2. Booking.com */}
      {apt.bookingUrls?.booking && (
        <a
          href={apt.bookingUrls.booking}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 bg-[#003580] hover:bg-[#002e6e] text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
        >
          <ExternalLink size={15} />
          {t('vermietung.hotel.bookOnBooking')}
        </a>
      )}

      {/* 3. Airbnb */}
      {apt.bookingUrls?.airbnb && (
        <a
          href={apt.bookingUrls.airbnb}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 bg-[#FF5A5F] hover:bg-[#e5484d] text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
        >
          <ExternalLink size={15} />
          {t('vermietung.hotel.bookOnAirbnb')}
        </a>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">{t('vermietung.hotel.orContact')}</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Phone + email */}
      <a href="tel:+41319518554" className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 px-4 rounded-xl transition-colors text-sm">
        <Phone size={15} />
        {apt.contact?.phone ?? '+41 (0)31 951 85 54'}
      </a>
      <a href={`mailto:${apt.contact?.email ?? 'office@reto-amonn.ch'}?subject=Anfrage N's Hotel`} className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 px-4 rounded-xl transition-colors text-sm">
        <Mail size={15} />
        {apt.contact?.email ?? 'office@reto-amonn.ch'}
      </a>
    </div>
  </motion.div>
);

// ─── LONG STAY SIDEBAR ─────────────────────────────────────────────────────

const LongStaySidebar = ({ apt, t }) => (
  <motion.div
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24"
  >
    {/* Header */}
    <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5 text-white">
      <TypeBadge type="long-stay" t={t} />
      <p className="text-3xl font-bold mt-3">
        {apt.currency} {apt.price}
        <span className="text-base font-normal opacity-75"> {t('vermietung.longStay.from')} / {t('common.perMonth').replace('/ ', '')}</span>
      </p>
      <p className="text-sm opacity-75 mt-1">{apt.location}</p>
    </div>

    {/* Pricing table */}
    {apt.longStayRooms && apt.longStayRooms.length > 0 && (
      <div className="px-5 pt-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          {t('vermietung.longStay.pricingTitle')}
        </p>
        <div className="space-y-2">
          {apt.longStayRooms.map((room, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm ${
                room.isAddon ? 'bg-gray-50 text-gray-600' : 'bg-amber-50'
              }`}
            >
              <span className={`font-medium ${room.isAddon ? 'text-gray-600' : 'text-gray-800'}`}>
                {room.label}
                {room.size && <span className="text-gray-400 font-normal ml-1.5">{room.size} m²</span>}
              </span>
              <span className={`font-bold ${room.isAddon ? 'text-gray-500' : 'text-amber-700'}`}>
                {room.isFrom && <span className="font-normal text-xs mr-1">{t('vermietung.longStay.from')}</span>}
                CHF {room.price}
                <span className="text-xs font-normal">/Mt.</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Includes */}
    {apt.includes && (
      <div className="px-5 pt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          {t('vermietung.longStay.includes')}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {apt.includes.map((inc) => (
            <span key={inc} className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-100">
              <CheckCircle2 size={10} />
              {inc}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Deposit */}
    {apt.deposit && (
      <div className="mx-5 mt-4 bg-gray-50 rounded-xl px-4 py-3">
        <span className="text-xs text-gray-500">{t('vermietung.longStay.deposit')}: </span>
        <span className="text-sm font-semibold text-gray-800">CHF {apt.deposit}</span>
      </div>
    )}

    {/* CTA */}
    <div className="p-5">
      <a
        href={`mailto:${apt.contact?.email ?? 'office@reto-amonn.ch'}?subject=${encodeURIComponent(`Long Stay Anfrage – ${apt.title}`)}`}
        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 px-4 rounded-xl transition-colors text-base"
      >
        <Mail size={18} />
        {t('vermietung.longStay.requestTitle')}
      </a>
      <p className="text-xs text-gray-400 text-center mt-2">{t('vermietung.longStay.requestSubtitle')}</p>
    </div>
  </motion.div>
);

// ─── CASA RETO / PROJECT SIDEBAR ───────────────────────────────────────────

const ProjectSidebar = ({ apt, t }) => (
  <motion.div
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24"
  >
    {/* Header */}
    <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white">
      <TypeBadge type="project" t={t} />
      <h3 className="text-xl font-semibold mt-3 mb-0.5">{apt.title}</h3>
      <p className="text-sm opacity-75">{apt.location}</p>
    </div>

    <div className="p-5 space-y-3">
      {/* Features */}
      <div className="flex flex-wrap gap-1.5">
        {apt.features.map((f) => (
          <span key={f} className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full border border-emerald-100">
            {f}
          </span>
        ))}
      </div>

      {/* Price info */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-center">
        <p className="text-sm font-semibold text-emerald-800">{t('vermietung.project.onRequest')}</p>
        <p className="text-xs text-emerald-600 mt-0.5">Wir senden Ihnen gerne alle Details</p>
      </div>

      {/* Primary CTA */}
      <a
        href={`mailto:${apt.contact?.email ?? 'office@reto-amonn.ch'}?subject=Anfrage Casa Reto – Ferienhaus Tessin`}
        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-4 rounded-xl transition-colors text-base"
      >
        <Mail size={18} />
        Aufenthalt anfragen
      </a>

      {/* Phone */}
      <a
        href="tel:+41319518554"
        className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-xl transition-colors text-sm"
      >
        <Phone size={15} />
        {apt.contact?.phone ?? '+41 (0)31 951 85 54'}
      </a>
    </div>
  </motion.div>
);

// ─── APARTMENT SIDEBAR ─────────────────────────────────────────────────────

const ApartmentSidebar = ({ apt, t, showForm, setShowForm }) => {
  const isAvailable = apt.status === 'available';
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="sticky top-24 space-y-4"
    >
      {/* Info card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
          <TypeBadge type="apartment" t={t} />
          <p className="text-3xl font-bold mt-3">
            {apt.currency} {apt.price?.toLocaleString('de-CH')}
            <span className="text-base font-normal opacity-75"> {t('common.perMonth')}</span>
          </p>
          <div className="flex gap-3 mt-2 text-sm opacity-75">
            {apt.rooms && <span>{apt.rooms} Zimmer</span>}
            {apt.size && <span>·</span>}
            {apt.size && <span>{apt.size} m²</span>}
          </div>
        </div>

        <div className="p-5 space-y-2.5">
          {isAvailable ? (
            <>
              {apt.availableFrom && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 border border-green-100 px-4 py-2.5 rounded-xl">
                  <Calendar size={15} className="text-green-600 flex-shrink-0" />
                  <span>Verfügbar ab {new Date(apt.availableFrom).toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              )}
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-4 rounded-xl transition-colors text-base"
              >
                <Mail size={18} />
                {t('vermietung.card.requestInquiry')}
              </button>
              <a
                href={`tel:+41319518554`}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-xl transition-colors text-sm"
              >
                <Phone size={15} />
                +41 (0)31 951 85 54
              </a>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                {t('vermietung.detail.rented.title')}
              </div>
              <p className="text-xs text-gray-500">{t('vermietung.detail.rented.subtitle')}</p>
              <a
                href="mailto:office@reto-amonn.ch?subject=Warteliste Wohnung"
                className="w-full flex items-center justify-center gap-2 border border-blue-200 text-blue-700 hover:bg-blue-50 py-3 px-4 rounded-xl transition-colors text-sm font-medium"
              >
                <Mail size={15} />
                Auf Warteliste setzen
              </a>
            </>
          )}
        </div>
      </div>

      {/* Details card */}
      {apt.details && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Objektdetails</p>
          <div className="space-y-2 text-sm">
            {apt.details.heating && (
              <div className="flex justify-between">
                <span className="text-gray-500">Heizung</span>
                <span className="font-medium text-gray-800">{apt.details.heating}</span>
              </div>
            )}
            {apt.details.parking && (
              <div className="flex justify-between">
                <span className="text-gray-500"><Car size={12} className="inline mr-1" />Parkplatz</span>
                <span className="font-medium text-gray-800">{apt.details.parking}</span>
              </div>
            )}
            {apt.details.buildYear && (
              <div className="flex justify-between">
                <span className="text-gray-500">Baujahr</span>
                <span className="font-medium text-gray-800">{apt.details.buildYear}</span>
              </div>
            )}
            {apt.details.energyClass && (
              <div className="flex justify-between">
                <span className="text-gray-500">Energieklasse</span>
                <span className="font-medium text-gray-800">{apt.details.energyClass}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ─── Gallery grid ──────────────────────────────────────────────────────────

const Gallery = ({ images, onOpen }) => {
  const main = images[0];
  const rest = images.slice(1, 5);

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-72 md:h-96">
      {/* Main image */}
      <div
        className={`col-span-2 row-span-2 cursor-pointer overflow-hidden group ${rest.length === 0 ? 'col-span-4' : ''}`}
        onClick={() => onOpen(0)}
      >
        <RentalImage src={main.url} alt={main.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      {/* Thumbnails */}
      {rest.map((img, i) => (
        <div
          key={i}
          className="cursor-pointer overflow-hidden group relative"
          onClick={() => onOpen(i + 1)}
        >
          <RentalImage src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {i === rest.length - 1 && images.length > 5 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">+{images.length - 5} Fotos</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── Page ──────────────────────────────────────────────────────────────────

const ApartmentDetailPage = () => {
  const { slug }    = useParams();
  const { t }       = useTranslation();
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const [showForm, setShowForm] = useState(false);

  const fromRental = getListingBySlug(slug);
  const fromStore  = !fromRental ? getPropertyById(slug) : null;
  const apt = fromRental ?? (fromStore ? normalizeStoreProperty(fromStore) : null);
  if (!apt) return <Navigate to="/immobilien/vermietung" replace />;

  const openLightbox  = (i) => setLightbox({ open: true, index: i });
  const closeLightbox = ()  => setLightbox({ open: false, index: 0 });
  const imgCount = apt.images?.length ?? 1;
  const prevImg = () => setLightbox((l) => ({ ...l, index: (l.index - 1 + imgCount) % imgCount }));
  const nextImg = () => setLightbox((l) => ({ ...l, index: (l.index + 1) % imgCount }));

  const pageTitle = `${apt.title} – ${apt.location} | Hans Amonn AG`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={apt.description?.slice(0, 160)} />
      </Helmet>

      {lightbox.open && (
        <ImageLightbox
          images={apt.images}
          activeIndex={lightbox.index}
          onClose={closeLightbox}
          onPrev={prevImg}
          onNext={nextImg}
        />
      )}

      {/* ── Back nav ── */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-3">
          <Link
            to="/immobilien/vermietung"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={16} />
            {t('vermietung.detail.back')}
          </Link>
        </div>
      </div>

      {/* ── Casa Reto: premium holiday home hero ── */}
      {apt.holidayHome && (
        <div className="relative h-72 md:h-[420px] overflow-hidden">
          <img
            src={apt.images[0].url}
            alt={apt.images[0].alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto max-w-6xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/80 backdrop-blur-sm text-white border border-white/20 mb-3">
                <Sun size={11} />
                Ferienhaus · Tessin
              </div>
              <h1 className="text-3xl md:text-4xl font-light mb-2">{apt.title}</h1>
              <p className="text-white/80 flex items-center gap-2">
                <MapPin size={14} />
                {apt.location}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Gallery (not shown for holiday home hero since we have the big image above) */}
            {!apt.holidayHome && (
              <Gallery images={apt.images} onOpen={openLightbox} />
            )}

            {/* Holiday home remaining gallery */}
            {apt.holidayHome && apt.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {apt.images.slice(1).map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden h-40 cursor-pointer group" onClick={() => openLightbox(i + 1)}>
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            )}

            {/* Title block (not for holiday home – shown in hero) */}
            {!apt.holidayHome && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <TypeBadge type={apt.type} t={t} />
                  {apt.type === 'apartment' && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      apt.status === 'available'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${apt.status === 'available' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                      {apt.status === 'available' ? t('vermietung.card.available') : t('vermietung.card.rented')}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">{apt.title}</h1>
                <p className="text-gray-500 mb-3">{apt.subtitle}</p>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MapPin size={14} />
                  {apt.location}
                </div>
              </motion.div>
            )}

            {/* Quick stats (apartment / long-stay only) */}
            {(apt.type === 'apartment') && apt.rooms && (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Home size={20} className="mx-auto text-blue-600 mb-2" />
                  <p className="text-lg font-bold text-gray-900">{apt.rooms}</p>
                  <p className="text-xs text-gray-500">{t('vermietung.card.rooms')}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Maximize2 size={20} className="mx-auto text-blue-600 mb-2" />
                  <p className="text-lg font-bold text-gray-900">{apt.size}</p>
                  <p className="text-xs text-gray-500">m²</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Calendar size={20} className="mx-auto text-blue-600 mb-2" />
                  <p className="text-sm font-bold text-gray-900 leading-tight">
                    {apt.availableFrom
                      ? new Date(apt.availableFrom).toLocaleDateString('de-CH', { month: 'short', year: 'numeric' })
                      : '—'}
                  </p>
                  <p className="text-xs text-gray-500">{t('vermietung.card.availableFrom')}</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                {t('vermietung.detail.description')}
              </h2>
              <p className="text-gray-600 leading-relaxed">{apt.description}</p>
            </div>

            {/* Long Stay: pricing table (mobile – shown in sidebar on desktop) */}
            {apt.type === 'long-stay' && apt.longStayRooms && (
              <div className="lg:hidden">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('vermietung.longStay.pricingTitle')}</h2>
                <div className="space-y-2">
                  {apt.longStayRooms.map((room, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm ${room.isAddon ? 'bg-gray-50' : 'bg-amber-50'}`}>
                      <span className="font-medium text-gray-800">
                        {room.label}
                        {room.size && <span className="text-gray-400 font-normal ml-1">{room.size} m²</span>}
                      </span>
                      <span className={`font-bold ${room.isAddon ? 'text-gray-500' : 'text-amber-700'}`}>
                        {room.isFrom && <span className="font-normal text-xs mr-1">ab</span>}
                        CHF {room.price}<span className="text-xs font-normal">/Mt.</span>
                      </span>
                    </div>
                  ))}
                </div>
                {apt.includes && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {apt.includes.map((inc) => (
                      <span key={inc} className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-100">
                        <CheckCircle2 size={10} />
                        {inc}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Features */}
            {apt.features && apt.features.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('vermietung.detail.features')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {apt.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2.5 rounded-xl">
                      <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Apartment: inline multi-step form */}
            {apt.type === 'apartment' && apt.status === 'available' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t('vermietung.mietanfrage.title')}
                  </h2>
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {showForm ? 'Formular ausblenden' : 'Formular öffnen'}
                  </button>
                </div>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <MietanfrageForm
                      preselectedSlug={apt.slug}
                      onSuccess={() => setShowForm(false)}
                    />
                  </motion.div>
                )}
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-4 rounded-xl transition-colors"
                  >
                    <Mail size={18} />
                    {t('vermietung.card.requestInquiry')}
                  </button>
                )}
              </div>
            )}

            {/* Casa Reto: holiday home highlights */}
            {apt.holidayHome && (
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-emerald-50 rounded-2xl p-5 text-center border border-emerald-100">
                  <Sun size={24} className="mx-auto text-emerald-600 mb-2" />
                  <p className="font-semibold text-gray-800 text-sm">Lago Maggiore</p>
                  <p className="text-xs text-gray-500 mt-1">Gordemo, Tessin</p>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 text-center border border-emerald-100">
                  <Wifi size={24} className="mx-auto text-emerald-600 mb-2" />
                  <p className="font-semibold text-gray-800 text-sm">Vollmöbliert</p>
                  <p className="text-xs text-gray-500 mt-1">Alles vorhanden</p>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 text-center border border-emerald-100">
                  <MapPin size={24} className="mx-auto text-emerald-600 mb-2" />
                  <p className="font-semibold text-gray-800 text-sm">Familien</p>
                  <p className="text-xs text-gray-500 mt-1">Ideal für Gruppen</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            {apt.type === 'hotel'      && <HotelSidebar apt={apt} t={t} />}
            {apt.type === 'long-stay'  && <LongStaySidebar apt={apt} t={t} />}
            {apt.type === 'project'    && <ProjectSidebar apt={apt} t={t} />}
            {apt.type === 'apartment'  && (
              <ApartmentSidebar apt={apt} t={t} showForm={showForm} setShowForm={setShowForm} />
            )}
          </div>

        </div>
      </div>

      {/* ── Sticky mobile CTA ── */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-gray-100 shadow-lg px-4 py-3 safe-area-bottom">
        {apt.type === 'hotel' ? (
          <div className="flex gap-2">
            <a
              href={apt.directBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl text-sm"
            >
              <ExternalLink size={15} />
              {t('vermietung.hotel.bookDirectly')}
            </a>
            <a
              href={`tel:+41319518554`}
              className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl text-sm"
            >
              <Phone size={16} />
            </a>
          </div>
        ) : apt.type === 'project' ? (
          <a
            href={`mailto:${apt.contact.email}?subject=Anfrage Casa Reto`}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold py-3 rounded-xl text-sm"
          >
            <Mail size={16} />
            Aufenthalt anfragen
          </a>
        ) : apt.type === 'long-stay' ? (
          <a
            href={`mailto:${apt.contact.email}?subject=${encodeURIComponent(`Long Stay Anfrage – ${apt.title}`)}`}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white font-semibold py-3 rounded-xl text-sm"
          >
            <Mail size={16} />
            {t('vermietung.longStay.requestTitle')}
          </a>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => { setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl text-sm"
            >
              <Mail size={15} />
              {t('vermietung.card.requestInquiry')}
            </button>
            <a
              href="tel:+41319518554"
              className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 px-4 rounded-xl text-sm"
            >
              <Phone size={16} />
            </a>
          </div>
        )}
      </div>

      {/* Bottom padding for mobile sticky bar */}
      <div className="h-20 lg:hidden" />
    </>
  );
};

export default ApartmentDetailPage;
