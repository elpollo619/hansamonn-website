import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import SkeletonDetail from '@/components/SkeletonDetail';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Phone, Mail, MapPin, Home, Maximize2,
  CheckCircle2, Calendar, ExternalLink, Sun, Coffee,
  Building2, Car, Wifi, Download,
} from 'lucide-react';
import { useTranslation } from '@/i18n';
import { getListingBySlug } from '@/data/rentalData';
import { getPropertyById } from '@/data/propertiesStore';
import { trackPropertyView } from '@/data/statsStore';
import MietanfrageForm from '@/components/MietanfrageForm';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import PropertyDocuments from '@/components/PropertyDocuments';
import Lightbox from '@/components/Lightbox';
import StructuredData from '@/components/StructuredData';
import PropertyVideo from '@/components/PropertyVideo';
import VirtualTour from '@/components/VirtualTour';
import OccupancyBadge from '@/components/OccupancyBadge';
import RecentlyViewedSection from '@/components/RecentlyViewedSection';
import ShareButtons from '@/components/ShareButtons';
import FavoriteButton from '@/components/FavoriteButton';
import { addRecentlyViewed } from '@/hooks/useRecentlyViewed';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import TerminbuchungForm from '@/components/TerminbuchungForm';

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
    subtitle: p.description ? p.description.slice(0, 120) : '',
    description: p.description || '',
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
    icalUrl: p.icalUrl || '',
    icalUrl2: p.icalUrl2 || '',
    icalUrl3: p.icalUrl3 || '',
    videoUrl: p.videoUrl || '',
    tourUrl: p.tourUrl || '',
    occupancy: p.occupancy || 'frei',
    beforeImage: p.beforeImage || '',
    afterImage: p.afterImage || '',
    lat: p.lat ?? null,
    lng: p.lng ?? null,
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
    <img src={src} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setErr(true)} />
  );
};

// ─── Lightbox: imported from @/components/Lightbox ─────────────────────────

// ─── Type badge ────────────────────────────────────────────────────────────

const TypeBadge = ({ type, t }) => {
  const cfg = {
    apartment:   { icon: Home,      cls: 'bg-gray-100 text-gray-600 border border-gray-200' },
    'long-stay': { icon: Coffee,    cls: 'bg-gray-100 text-gray-600 border border-gray-200' },
    hotel:       { icon: Building2, cls: 'bg-gray-100 text-gray-600 border border-gray-200' },
    project:     { icon: Sun,       cls: 'bg-gray-100 text-gray-600 border border-gray-200' },
  }[type] || { icon: Home, cls: 'bg-gray-100 text-gray-600' };
  const Icon = cfg.icon;
  const labels = {
    apartment:   t('vermietung.types.apartment'),
    'long-stay': t('vermietung.types.longStay'),
    hotel:       t('vermietung.types.hotel'),
    project:     t('vermietung.types.project'),
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold ${cfg.cls}`}>
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
    className="bg-white border border-gray-100 overflow-hidden sticky top-24"
  >
    {/* Price header */}
    <div className="px-6 py-5 text-white" style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}>
      <div className="flex items-center gap-2 flex-wrap">
        <TypeBadge type="hotel" t={t} />
        <OccupancyBadge status={apt.occupancy || 'frei'} />
      </div>
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
          className="w-full flex items-center justify-center gap-2.5 text-white font-bold py-4 px-4 transition-colors text-base"
          style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
          onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
          onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
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
          className="w-full flex items-center justify-center gap-2.5 bg-[#003580] hover:bg-[#002e6e] text-white font-semibold py-3 px-4 transition-colors text-sm"
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
          className="w-full flex items-center justify-center gap-2.5 bg-[#FF5A5F] hover:bg-[#e5484d] text-white font-semibold py-3 px-4 transition-colors text-sm"
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
      <a href="tel:+41319518554" className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 px-4 transition-colors text-sm">
        <Phone size={15} />
        {apt.contact?.phone ?? '+41 (0)31 951 85 54'}
      </a>
      <a href={`mailto:${apt.contact?.email ?? 'office@reto-amonn.ch'}?subject=Anfrage N's Hotel`} className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 px-4 transition-colors text-sm">
        <Mail size={15} />
        {apt.contact?.email ?? 'office@reto-amonn.ch'}
      </a>

      {/* Share + Favorite */}
      <div className="pt-1 flex items-center gap-2">
        <FavoriteButton propertyId={apt.id} size="md" />
        <ShareButtons title={apt.title} />
      </div>
    </div>
  </motion.div>
);

// ─── LONG STAY SIDEBAR ─────────────────────────────────────────────────────

const LongStaySidebar = ({ apt, t }) => (
  <motion.div
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
    className="bg-white border border-gray-100 overflow-hidden sticky top-24"
  >
    {/* Header */}
    <div className="px-6 py-5 text-white" style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}>
      <div className="flex items-center gap-2 flex-wrap">
        <TypeBadge type="long-stay" t={t} />
        <OccupancyBadge status={apt.occupancy || 'frei'} />
      </div>
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
              className={`flex items-center justify-between px-4 py-3 text-sm ${
                room.isAddon ? 'bg-gray-50 text-gray-600' : 'bg-gray-50'
              }`}
            >
              <span className={`font-medium ${room.isAddon ? 'text-gray-600' : 'text-gray-800'}`}>
                {room.label}
                {room.size && <span className="text-gray-400 font-normal ml-1.5">{room.size} m²</span>}
              </span>
              <span className={`font-bold ${room.isAddon ? 'text-gray-500' : 'text-gray-700'}`}>
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
            <span key={inc} className="flex items-center gap-1 bg-gray-50 text-gray-600 text-xs px-2.5 py-1 border border-gray-200">
              <CheckCircle2 size={10} />
              {inc}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Deposit */}
    {apt.deposit && (
      <div className="mx-5 mt-4 bg-gray-50 px-4 py-3">
        <span className="text-xs text-gray-500">{t('vermietung.longStay.deposit')}: </span>
        <span className="text-sm font-semibold text-gray-800">CHF {apt.deposit}</span>
      </div>
    )}

    {/* CTA */}
    <div className="p-5">
      <a
        href={`mailto:${apt.contact?.email ?? 'office@reto-amonn.ch'}?subject=${encodeURIComponent(`Long Stay Anfrage – ${apt.title}`)}`}
        className="w-full flex items-center justify-center gap-2 text-white font-semibold py-4 px-4 transition-colors text-base"
        style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
        onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
        onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
      >
        <Mail size={18} />
        {t('vermietung.longStay.requestTitle')}
      </a>
      <p className="text-xs text-gray-400 text-center mt-2">{t('vermietung.longStay.requestSubtitle')}</p>
      <div className="mt-3 flex items-center gap-2">
        <FavoriteButton propertyId={apt.id} size="md" />
        <ShareButtons title={apt.title} />
      </div>
    </div>
  </motion.div>
);

// ─── CASA RETO / PROJECT SIDEBAR ───────────────────────────────────────────

const ProjectSidebar = ({ apt, t, icalUrl }) => (
  <motion.div
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
    className="space-y-4 sticky top-24"
  >
    {/* Main card */}
    <div className="bg-white border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 text-white" style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}>
        <div className="flex items-center gap-2 flex-wrap">
          <TypeBadge type="project" t={t} />
          <OccupancyBadge status={apt.occupancy || 'frei'} />
        </div>
        <h3 className="text-xl font-semibold mt-3 mb-0.5">{apt.title}</h3>
        <p className="text-sm opacity-75">{apt.location}</p>
      </div>

      <div className="p-5 space-y-3">
        {/* Features */}
        <div className="flex flex-wrap gap-1.5">
          {apt.features.map((f) => (
            <span key={f} className="bg-gray-50 text-gray-600 text-xs px-2.5 py-1 border border-gray-200">
              {f}
            </span>
          ))}
        </div>

        {/* Price info */}
        <div className="bg-gray-50 border border-gray-100 px-4 py-3 text-center">
          <p className="text-sm font-semibold text-gray-800">{t('vermietung.project.onRequest')}</p>
          <p className="text-xs text-gray-500 mt-0.5">Wir senden Ihnen gerne alle Details</p>
        </div>

        {/* Primary CTA */}
        <a
          href={`mailto:${apt.contact?.email ?? 'office@reto-amonn.ch'}?subject=Anfrage Casa Reto – Ferienhaus Tessin`}
          className="w-full flex items-center justify-center gap-2 text-white font-semibold py-4 px-4 transition-colors text-base"
          style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
          onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
          onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
        >
          <Mail size={18} />
          Aufenthalt anfragen
        </a>

        {/* Phone */}
        <a
          href="tel:+41319518554"
          className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 px-4 transition-colors text-sm"
        >
          <Phone size={15} />
          {apt.contact?.phone ?? '+41 (0)31 951 85 54'}
        </a>

        {/* Share + Favorite */}
        <div className="pt-1 flex items-center gap-2">
          <FavoriteButton propertyId={apt.id} size="md" />
          <ShareButtons title={apt.title} />
        </div>
      </div>
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
      <div className="bg-white border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 text-white" style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}>
          <div className="flex items-center gap-2 flex-wrap">
            <TypeBadge type="apartment" t={t} />
            <OccupancyBadge status={apt.occupancy || 'frei'} />
          </div>
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
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-4 py-2.5">
                  <Calendar size={15} className="text-gray-500 flex-shrink-0" />
                  <span>Verfügbar ab {new Date(apt.availableFrom).toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              )}
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full flex items-center justify-center gap-2 text-white font-semibold py-4 px-4 transition-colors text-base"
                style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
              >
                <Mail size={18} />
                {t('vermietung.card.requestInquiry')}
              </button>
              <a
                href={`tel:+41319518554`}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 px-4 transition-colors text-sm"
              >
                <Phone size={15} />
                +41 (0)31 951 85 54
              </a>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 px-4 py-3">
                <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                {t('vermietung.detail.rented.title')}
              </div>
              <p className="text-xs text-gray-500">{t('vermietung.detail.rented.subtitle')}</p>
              <a
                href="mailto:office@reto-amonn.ch?subject=Warteliste Wohnung"
                className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 px-4 transition-colors text-sm font-medium"
              >
                <Mail size={15} />
                Auf Warteliste setzen
              </a>
            </>
          )}

          {/* Share + Favorite */}
          <div className="pt-1 flex items-center gap-2">
            <FavoriteButton propertyId={apt.id} size="md" />
            <ShareButtons title={apt.title} />
          </div>
        </div>
      </div>

      {/* Details card */}
      {apt.details && (
        <div className="bg-white border border-gray-100 p-5">
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
    <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden h-72 md:h-96">
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
  const [loading, setLoading]   = useState(true);

  const fromStore  = getPropertyById(slug);
  const fromRental = !fromStore ? getListingBySlug(slug) : null;
  const apt = fromStore ? normalizeStoreProperty(fromStore) : (fromRental ?? null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [slug]);

  useEffect(() => {
    if (apt) {
      trackPropertyView(apt.id ?? apt.slug, apt.title);
      addRecentlyViewed(String(apt.id ?? apt.slug));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) return <SkeletonDetail />;
  if (!apt) return <Navigate to="/immobilien/vermietung" replace />;

  const openLightbox  = (i) => setLightbox({ open: true, index: i });
  const closeLightbox = ()  => setLightbox({ open: false, index: 0 });

  // ── PDF Exposé export ──────────────────────────────────────────────────
  const handleExposeDownload = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = 210;
      const margin = 18;
      const contentW = pageW - margin * 2;
      let y = 20;

      const line = (h = 6) => { y += h; };
      const checkPage = (needed = 12) => {
        if (y + needed > 275) { doc.addPage(); y = 20; }
      };

      // ── Logo header ────────────────────────────────────────────────────────
      const lx = margin;
      // Square bracket logo
      doc.setDrawColor(17, 24, 39);
      doc.setLineWidth(1.2);
      doc.line(lx, 10, lx, 26);
      doc.line(lx, 10, lx + 4, 10);
      doc.line(lx, 26, lx + 4, 26);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(17, 24, 39);
      doc.text('A', lx + 0.8, 22);
      // "AMONN" text
      doc.setFontSize(13);
      doc.setFont('helvetica', 'black');
      doc.setTextColor(17, 24, 39);
      doc.text('AMONN', lx + 7, 19);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text('IMMOBILIEN', lx + 7, 25);
      // "EXPOSÉ" right side
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(17, 24, 39);
      doc.text('EXPOSÉ', pageW - margin, 20, { align: 'right' });
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(new Date().toLocaleDateString('de-CH'), pageW - margin, 26, { align: 'right' });
      // Separator
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.4);
      doc.line(margin, 30, pageW - margin, 30);

      y = 38;

      // Title
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(apt.title, contentW);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 9;

      // Subtitle / location
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      if (apt.subtitle) {
        const subLines = doc.splitTextToSize(apt.subtitle, contentW);
        doc.text(subLines, margin, y);
        y += subLines.length * 6;
      }
      if (apt.location) { doc.text(`Standort: ${apt.location}`, margin, y); line(6); }

      // Divider
      line(3);
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, y, pageW - margin, y);
      line(6);

      // Key stats
      const stats = [];
      if (apt.price)         stats.push({ label: 'Preis', value: `${apt.currency ?? 'CHF'} ${apt.price?.toLocaleString('de-CH')}${apt.type === 'apartment' ? ' / Mt.' : apt.type === 'hotel' ? ' / Nacht' : ''}` });
      if (apt.rooms)         stats.push({ label: 'Zimmer', value: String(apt.rooms) });
      if (apt.size)          stats.push({ label: 'Fläche', value: `${apt.size} m²` });
      if (apt.availableFrom) stats.push({ label: 'Verfügbar ab', value: new Date(apt.availableFrom).toLocaleDateString('de-CH') });

      if (stats.length) {
        checkPage(20);
        const colW = contentW / Math.min(stats.length, 4);
        stats.slice(0, 4).forEach((s, i) => {
          const x = margin + i * colW;
          doc.setFillColor(239, 246, 255);
          doc.roundedRect(x, y, colW - 3, 16, 2, 2, 'F');
          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(107, 114, 128);
          doc.text(s.label.toUpperCase(), x + 4, y + 5.5);
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(17, 24, 39);
          doc.text(s.value, x + 4, y + 12.5);
        });
        y += 22;
      }

      // Description
      if (apt.description) {
        checkPage(16);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(17, 24, 39);
        doc.text('Beschreibung', margin, y);
        line(7);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(55, 65, 81);
        const descLines = doc.splitTextToSize(apt.description, contentW);
        descLines.forEach((dl) => { checkPage(6); doc.text(dl, margin, y); line(5.5); });
        line(2);
      }

      // Features
      if (apt.features?.length) {
        checkPage(16);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(17, 24, 39);
        doc.text('Ausstattung', margin, y);
        line(7);
        const cols = 2;
        const fColW = contentW / cols;
        apt.features.forEach((f, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          if (col === 0) checkPage(7);
          const fx = margin + col * fColW;
          const fy = y + row * 7;
          doc.setFillColor(59, 130, 246);
          doc.circle(fx + 2, fy - 1.5, 1.2, 'F');
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(55, 65, 81);
          doc.text(f, fx + 6, fy);
        });
        y += Math.ceil(apt.features.length / cols) * 7 + 4;
      }

      // Contact
      checkPage(28);
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, y, pageW - margin, y);
      line(6);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(17, 24, 39);
      doc.text('Kontakt', margin, y);
      line(7);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(55, 65, 81);
      doc.text('Hans Amonn AG', margin, y); line(5.5);
      doc.text(`Tel: ${apt.contact?.phone ?? '+41 (0)31 951 85 54'}`, margin, y); line(5.5);
      doc.text(`E-Mail: ${apt.contact?.email ?? 'office@reto-amonn.ch'}`, margin, y);

      // Page footers
      const pages = doc.getNumberOfPages();
      for (let p = 1; p <= pages; p++) {
        doc.setPage(p);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(156, 163, 175);
        doc.text(
          `AMONN IMMOBILIEN · Hans Amonn AG · office@reto-amonn.ch · +41 (0)31 951 85 54 · Seite ${p} / ${pages}`,
          margin, 291,
        );
      }

      const filename = `expose-${(apt.title ?? 'objekt').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('PDF export failed:', err);
      window.print();
    }
  };

  const pageTitle = `${apt.title} – ${apt.location} | Hans Amonn AG`;
  const pageUrl   = `https://www.hansamonn.ch/immobilien/${apt.slug}`;

  const schemaType = apt.type === 'hotel' || apt.type === 'project' ? 'Accommodation' : 'RealEstateListing';
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: apt.title,
    description: apt.description,
    url: pageUrl,
    image: apt.images?.[0]?.url
      ? `https://www.hansamonn.ch${apt.images[0].url}`
      : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: apt.location,
      addressCountry: 'CH',
    },
    ...(apt.price && {
      offers: {
        '@type': 'Offer',
        price: apt.price,
        priceCurrency: apt.currency ?? 'CHF',
      },
    }),
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={apt.description?.slice(0, 160)} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${apt.title} – Hans Amonn AG`} />
        <meta property="og:description" content={apt.description?.slice(0, 160)} />
        <meta property="og:image" content={apt.images?.[0]?.url || apt.titleImage || ''} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Hans Amonn AG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${apt.title} – Hans Amonn AG`} />
        <meta name="twitter:description" content={apt.description?.slice(0, 160)} />
        <meta name="twitter:image" content={apt.images?.[0]?.url || apt.titleImage || ''} />
      </Helmet>
      <StructuredData data={structuredData} />

      {lightbox.open && (
        <Lightbox
          images={apt.images}
          initialIndex={lightbox.index}
          onClose={closeLightbox}
        />
      )}

      {/* ── Breadcrumbs ── */}
      {(() => {
        const breadcrumbCategory =
          apt.type === 'project'
            ? { label: 'Ferienhaus', href: '/immobilien' }
            : apt.type === 'hotel'
            ? { label: 'Hotel', href: '/immobilien' }
            : apt.type === 'long-stay'
            ? { label: 'Langzeitmiete', href: '/immobilien/long-stay' }
            : { label: 'Vermietung', href: '/immobilien/vermietung' };

        const items = [
          { label: 'Home', href: '/' },
          { label: 'Immobilien', href: '/immobilien' },
          { label: breadcrumbCategory.label, href: breadcrumbCategory.href },
          { label: apt.title },
        ];

        return (
          <div className="border-b border-gray-100 bg-white print:hidden">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-2.5">
              <Breadcrumbs items={items} />
            </div>
          </div>
        );
      })()}

      {/* ── Back nav + Exposé button ── */}
      <div className="border-b border-gray-100 bg-white print:hidden">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-3 flex items-center justify-between">
          <Link
            to="/immobilien/vermietung"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1D3D78] transition-colors"
          >
            <ArrowLeft size={16} />
            {t('vermietung.detail.back')}
          </Link>
          <button
            onClick={handleExposeDownload}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1D3D78] border border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50 px-3 py-1.5 transition-colors"
          >
            <Download size={14} />
            Exposé herunterladen
          </button>
        </div>
      </div>

      {/* ── Hero image (all property types) ── */}
      {apt.images[0]?.url && (
        <div className="relative h-64 md:h-[380px] overflow-hidden">
          <img
            src={apt.images[0].url}
            alt={apt.images[0].alt}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <div className="container mx-auto max-w-6xl">
              <TypeBadge type={apt.type} t={t} />
              <h1 className="text-3xl md:text-4xl font-semibold mt-3 mb-2">{apt.title}</h1>
              <p className="text-white/80 flex items-center gap-2 text-sm">
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

            {/* Thumbnail strip — remaining images (visible after hero) */}
            {apt.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {apt.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="overflow-hidden h-28 cursor-pointer group relative" onClick={() => openLightbox(i + 1)}>
                    <RentalImage src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {i === 3 && apt.images.length > 5 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">+{apt.images.length - 5} Fotos</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Status badge — apartment only */}
            {apt.type === 'apartment' && (
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold ${
                  apt.status === 'available'
                    ? 'bg-gray-100 text-gray-700 border border-gray-200'
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${apt.status === 'available' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  {apt.status === 'available' ? t('vermietung.card.available') : t('vermietung.card.rented')}
                </span>
              </div>
            )}

            {/* Quick stats (apartment / long-stay only) */}
            {(apt.type === 'apartment') && apt.rooms && (
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 p-4 text-center">
                  <Home size={20} className="mx-auto mb-2" style={{ color: 'var(--brand-color, #1D3D78)' }} />
                  <p className="text-lg font-bold text-gray-900">{apt.rooms}</p>
                  <p className="text-xs text-gray-500">{t('vermietung.card.rooms')}</p>
                </div>
                <div className="bg-gray-50 p-4 text-center">
                  <Maximize2 size={20} className="mx-auto mb-2" style={{ color: 'var(--brand-color, #1D3D78)' }} />
                  <p className="text-lg font-bold text-gray-900">{apt.size}</p>
                  <p className="text-xs text-gray-500">m²</p>
                </div>
                <div className="bg-gray-50 p-4 text-center">
                  <Calendar size={20} className="mx-auto mb-2" style={{ color: 'var(--brand-color, #1D3D78)' }} />
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
            {apt.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('vermietung.detail.description')}
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{apt.description}</p>
              </div>
            )}

            {/* Video */}
            <PropertyVideo videoUrl={apt.videoUrl} />

            {/* Virtual Tour */}
            <VirtualTour tourUrl={apt.tourUrl} />

            {/* Long Stay: pricing table (mobile – shown in sidebar on desktop) */}
            {apt.type === 'long-stay' && apt.longStayRooms && (
              <div className="lg:hidden">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('vermietung.longStay.pricingTitle')}</h2>
                <div className="space-y-2">
                  {apt.longStayRooms.map((room, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm bg-gray-50`}>
                      <span className="font-medium text-gray-800">
                        {room.label}
                        {room.size && <span className="text-gray-400 font-normal ml-1">{room.size} m²</span>}
                      </span>
                      <span className={`font-bold ${room.isAddon ? 'text-gray-500' : 'text-gray-700'}`}>
                        {room.isFrom && <span className="font-normal text-xs mr-1">ab</span>}
                        CHF {room.price}<span className="text-xs font-normal">/Mt.</span>
                      </span>
                    </div>
                  ))}
                </div>
                {apt.includes && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {apt.includes.map((inc) => (
                      <span key={inc} className="flex items-center gap-1 bg-gray-50 text-gray-600 text-xs px-2.5 py-1 border border-gray-200">
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
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2.5">
                      <CheckCircle2 size={14} className="flex-shrink-0" style={{ color: 'var(--brand-color, #1D3D78)' }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Availability calendar (main content — shown for all types when icalUrl set) */}
            {apt.icalUrl && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Verfügbarkeit</h2>
                <AvailabilityCalendar
                  icalUrls={[apt.icalUrl, apt.icalUrl2, apt.icalUrl3].filter(Boolean)}
                />
              </div>
            )}

            {/* Location map */}
            {apt.lat && apt.lng && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Lage & Standort</h2>
                <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                  <MapPin size={13} />
                  {apt.location}
                </p>
                <div className="overflow-hidden border border-gray-100" style={{ height: 300 }}>
                  <iframe
                    title={`Standort ${apt.title}`}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${apt.lng - 0.008},${apt.lat - 0.006},${apt.lng + 0.008},${apt.lat + 0.006}&layer=mapnik&marker=${apt.lat},${apt.lng}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(apt.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs hover:underline mt-2"
                  style={{ color: 'var(--brand-color, #1D3D78)' }}
                >
                  <MapPin size={11} />
                  Auf Google Maps öffnen
                </a>
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
                    className="text-sm hover:underline"
                    style={{ color: 'var(--brand-color, #1D3D78)' }}
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
                    className="w-full flex items-center justify-center gap-2 text-white font-semibold py-4 px-4 transition-colors"
                    style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                    onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                    onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
                  >
                    <Mail size={18} />
                    {t('vermietung.card.requestInquiry')}
                  </button>
                )}
              </div>
            )}

            {/* Downloadable documents */}
            <PropertyDocuments propertyId={apt.id ?? apt.slug} />

            {/* Casa Reto: holiday home highlights */}
            {apt.holidayHome && (
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-5 text-center border border-gray-100">
                  <Sun size={24} className="mx-auto mb-2" style={{ color: 'var(--brand-color, #1D3D78)' }} />
                  <p className="font-semibold text-gray-800 text-sm">Lago Maggiore</p>
                  <p className="text-xs text-gray-500 mt-1">Gordemo, Tessin</p>
                </div>
                <div className="bg-gray-50 p-5 text-center border border-gray-100">
                  <Wifi size={24} className="mx-auto mb-2" style={{ color: 'var(--brand-color, #1D3D78)' }} />
                  <p className="font-semibold text-gray-800 text-sm">Vollmöbliert</p>
                  <p className="text-xs text-gray-500 mt-1">Alles vorhanden</p>
                </div>
                <div className="bg-gray-50 p-5 text-center border border-gray-100">
                  <MapPin size={24} className="mx-auto mb-2" style={{ color: 'var(--brand-color, #1D3D78)' }} />
                  <p className="font-semibold text-gray-800 text-sm">Familien</p>
                  <p className="text-xs text-gray-500 mt-1">Ideal für Gruppen</p>
                </div>
              </div>
            )}

            {/* Vorher / Nachher Slider */}
            {apt.beforeImage && apt.afterImage && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Vorher / Nachher</h2>
                <BeforeAfterSlider
                  beforeImage={apt.beforeImage}
                  afterImage={apt.afterImage}
                />
              </div>
            )}

            {/* Terminbuchung */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Termin vereinbaren</h2>
              <div className="bg-white border border-gray-200 p-5">
                <TerminbuchungForm
                  propertyId={apt.id ?? apt.slug}
                  propertyName={apt.title}
                />
              </div>
            </div>

            {/* Recently viewed */}
            <RecentlyViewedSection currentId={apt.id ?? apt.slug} />
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1 space-y-4">
            {apt.type === 'hotel'      && <HotelSidebar apt={apt} t={t} />}
            {apt.type === 'long-stay'  && <LongStaySidebar apt={apt} t={t} />}
            {apt.type === 'project'    && <ProjectSidebar apt={apt} t={t} icalUrl={apt.icalUrl} />}
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
              className="flex-1 flex items-center justify-center gap-2 text-white font-semibold py-3 text-sm"
              style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
            >
              <ExternalLink size={15} />
              {t('vermietung.hotel.bookDirectly')}
            </a>
            <a
              href={`tel:+41319518554`}
              className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 px-4 text-sm"
            >
              <Phone size={16} />
            </a>
          </div>
        ) : apt.type === 'project' ? (
          <a
            href={`mailto:${apt.contact.email}?subject=Anfrage Casa Reto`}
            className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 text-sm"
            style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
          >
            <Mail size={16} />
            Aufenthalt anfragen
          </a>
        ) : apt.type === 'long-stay' ? (
          <a
            href={`mailto:${apt.contact.email}?subject=${encodeURIComponent(`Long Stay Anfrage – ${apt.title}`)}`}
            className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 text-sm"
            style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
          >
            <Mail size={16} />
            {t('vermietung.longStay.requestTitle')}
          </a>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => { setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex-1 flex items-center justify-center gap-2 text-white font-semibold py-3 text-sm"
              style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
            >
              <Mail size={15} />
              {t('vermietung.card.requestInquiry')}
            </button>
            <a
              href="tel:+41319518554"
              className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 px-4 text-sm"
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
