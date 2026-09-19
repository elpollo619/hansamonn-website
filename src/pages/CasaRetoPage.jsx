import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  MapPin, Users, BedDouble, Bath, Trees, Flame, Utensils, Car, PawPrint,
  Mountain, Waves, Sun, CalendarDays, ArrowRight, Phone, Mail, MessageCircle,
  ChevronRight, Star,
} from 'lucide-react';

import { getListingBySlug } from '@/data/rentalData';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import CasaRetoAnfrageForm from '@/components/CasaRetoAnfrageForm';
import Lightbox from '@/components/Lightbox';

const BRAND = 'var(--brand-color, #1D3D78)';
const BRAND_DARK = 'var(--brand-color-dark, #162E5A)';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: 'easeOut' },
};

/* Quick facts shown in the hero and the sticky summary */
const QUICK_FACTS = [
  { Icon: BedDouble, label: '4 Schlafzimmer' },
  { Icon: Users,     label: 'Bis 8 Gäste' },
  { Icon: Bath,      label: '2 Badezimmer' },
  { Icon: Trees,     label: 'Garten mit Seeblick' },
];

/* Feature grid — what defines the house */
const FEATURES = [
  { Icon: Waves,     title: 'Blick auf den Lago Maggiore', text: 'Unverbaute Aussicht auf den See vom Garten und der Pergola aus.' },
  { Icon: Trees,     title: 'Grosser Garten mit Pergola', text: 'Granittisch im Schatten, ideal für lange Sommerabende im Freien.' },
  { Icon: Flame,     title: 'Offener Wohnraum mit Cheminée', text: 'Küche und Wohnbereich fliessen ineinander, gemütlich auch im Herbst.' },
  { Icon: Utensils,  title: 'Voll ausgestattete Küche', text: 'Geschirrspüler, Backofen, Mikrowelle und Kühlschrank mit Gefrierfach.' },
  { Icon: BedDouble, title: '4 Schlafzimmer für 8 Gäste', text: 'Doppelbett im Erdgeschoss, drei weitere Zimmer im Obergeschoss.' },
  { Icon: Mountain,  title: 'Am Eingang zum Verzascatal', text: 'Wandern, Baden und Natur direkt vor der Haustür.' },
];

/* Nearby & activities */
const SURROUNDINGS = [
  { Icon: Car,      title: 'Ascona & Locarno', text: '10 Autominuten bis an die Seepromenade und ins Zentrum.' },
  { Icon: Waves,    title: 'Verzasca & Lago Maggiore', text: 'Kristallklares Flusswasser und Seebäder in wenigen Minuten.' },
  { Icon: Mountain, title: 'Wandern im Tessin', text: 'Zahlreiche Wege und Aussichtspunkte rund um Gordola und das Verzascatal.' },
  { Icon: Sun,      title: 'Mediterranes Klima', text: 'Palmen, Sonne und südliches Lebensgefühl auf der Schweizer Alpensüdseite.' },
];

/* Small self-contained Leaflet map with a single marker (repo pattern: dynamic
   import + CARTO tiles + dynamically injected Leaflet CSS). */
function LocationMap({ lat, lng, label }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const [cssReady, setCssReady] = useState(false);

  useEffect(() => {
    if (document.getElementById('leaflet-css')) { setCssReady(true); return; }
    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.onload = () => setCssReady(true);
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (!cssReady || instanceRef.current || !mapRef.current) return;
    let cancelled = false;
    import('leaflet').then((L) => {
      if (cancelled || instanceRef.current || !mapRef.current) return;
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom: 12,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });
      instanceRef.current = map;
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('© <a href="https://carto.com/">CARTO</a>')
        .addTo(map);
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:36px;height:36px;border-radius:50%;background:#1D3D78;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;">
          <svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='4'/><path d='M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M18.66 5.34l-1.41 1.41'/></svg>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      L.marker([lat, lng], { icon, title: label }).addTo(map);
    });
    return () => {
      cancelled = true;
      if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
    };
  }, [cssReady, lat, lng, label]);

  return (
    <div className="relative border border-gray-100 overflow-hidden bg-gray-50" style={{ height: 380 }}>
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: 380 }} />
      {!cssReady && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
          Karte wird geladen…
        </div>
      )}
    </div>
  );
}

export default function CasaRetoPage() {
  const listing = getListingBySlug('casa-reto');
  const images = listing?.images ?? [];
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const bookingUrl = listing?.bookingUrls?.booking;
  const airbnbUrl = listing?.bookingUrls?.airbnb;

  return (
    <div className="bg-white text-gray-900">
      <Helmet>
        <title>Casa Reto – Ferienhaus im Tessin am Lago Maggiore | Hans Amonn AG</title>
        <meta name="description" content="Casa Reto: gemütliches Ferienhaus in Gordemo am Lago Maggiore. 4 Schlafzimmer für bis zu 8 Gäste, grosser Garten mit Pergola und Seeblick, ruhige Lage am Verzascatal. Jetzt Verfügbarkeit anfragen." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Casa Reto – Ferienhaus im Tessin am Lago Maggiore" />
        <meta property="og:description" content="Ferienhaus in Gordemo am Lago Maggiore. 4 Schlafzimmer, Garten mit Seeblick, ruhige Lage am Verzascatal." />
        <meta property="og:image" content="https://www.hansamonn.ch/images/casa-reto/titel.jpg" />
        <meta property="og:url" content="https://www.hansamonn.ch/immobilien/casa-reto" />
        <meta property="og:site_name" content="Hans Amonn AG" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[78vh] flex items-end overflow-hidden">
        <img
          src={images[0]?.url || '/images/casa-reto/titel.jpg'}
          alt={images[0]?.alt || 'Casa Reto – Ferienhaus im Tessin'}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

        <div className="relative container mx-auto px-6 pb-14 pt-28">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-3xl text-white"
          >
            <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-white/70 mb-4">
              Hans Amonn AG · Ferienhaus im Tessin
            </p>
            <h1 className="text-5xl md:text-7xl font-light leading-[1.05] mb-5">
              Casa <span className="font-black">Reto</span>
            </h1>
            <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl mb-8">
              Ein gemütliches Ferienhaus in Gordemo, hoch über dem Lago Maggiore.
              Tessiner Charme, ein grosser Garten mit Pergola und Seeblick, Ruhe
              am Eingang zum Verzascatal.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-9">
              <span className="inline-flex items-center gap-2 text-sm text-white/80">
                <MapPin size={16} /> Gordemo · Lago Maggiore, Tessin
              </span>
              {QUICK_FACTS.map(({ Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 text-sm text-white/80">
                  <Icon size={16} /> {label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#anfrage"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold text-sm transition-colors"
                style={{ backgroundColor: BRAND }}
                onMouseOver={e => e.currentTarget.style.setProperty('background-color', BRAND_DARK)}
                onMouseOut={e => e.currentTarget.style.setProperty('background-color', BRAND)}
              >
                <CalendarDays size={16} /> Verfügbarkeit anfragen
              </a>
              {airbnbUrl && (
                <a href={airbnbUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-sm text-white border border-white/40 hover:bg-white/10 transition-colors">
                  Auf Airbnb ansehen <ArrowRight size={15} />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <motion.div {...fadeUp}>
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-400 mb-3">
              Willkommen
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
              Ankommen und <span className="font-black">durchatmen</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Casa Reto liegt in Gordemo bei Gordola, am Eingang zum Verzascatal.
              Im Erdgeschoss öffnet sich die Küche zum Wohnbereich mit Cheminée,
              dazu ein halboffenes Schlafzimmer mit Doppelbett. Im Obergeschoss
              warten drei weitere Zimmer mit je zwei Betten, ideal für Familien
              und Gruppen bis acht Personen.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Das Herzstück ist der Garten: eine Pergola mit Granittisch, viel
              Grün und ein unverbauter Blick über den Lago Maggiore. Ascona und
              Locarno sind in zehn Autominuten erreichbar.
            </p>
          </motion.div>

          <motion.button
            {...fadeUp}
            type="button"
            onClick={() => setLightboxIndex(1)}
            className="group relative overflow-hidden aspect-[4/3] w-full"
            aria-label="Galerie öffnen"
          >
            <img
              src={images[1]?.url || images[0]?.url}
              alt={images[1]?.alt || 'Casa Reto'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </motion.button>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6 py-20">
          <motion.div {...fadeUp} className="max-w-2xl mb-12">
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-400 mb-3">
              Das Haus
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">
              Was Casa Reto <span className="font-black">besonders macht</span>
            </h2>
          </motion.div>

          <div className="grid gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-3 border border-gray-100">
            {FEATURES.map(({ Icon, title, text }) => (
              <motion.div {...fadeUp} key={title} className="bg-white p-8">
                <Icon size={26} style={{ color: BRAND }} className="mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-20">
        <motion.div {...fadeUp} className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-400 mb-3">
              Galerie
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">
              Ein Blick <span className="font-black">ins Haus</span>
            </h2>
          </div>
        </motion.div>

        <div className="grid gap-3 md:grid-cols-4 md:grid-rows-2 md:h-[520px]">
          {images.map((img, i) => (
            <motion.button
              {...fadeUp}
              key={img.url}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className={[
                'group relative overflow-hidden bg-gray-100',
                i === 0 ? 'md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto' : 'aspect-[4/3] md:aspect-auto',
              ].join(' ')}
              aria-label={`Bild ${i + 1} öffnen`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── Rooms / layout ───────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div {...fadeUp}>
              <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-400 mb-3">
                Raumaufteilung
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8">
                Platz für <span className="font-black">die ganze Familie</span>
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-11 h-11 flex items-center justify-center bg-white border border-gray-200">
                    <BedDouble size={20} style={{ color: BRAND }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Erdgeschoss</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Offene Küche mit Wohnbereich und Cheminée, halboffenes
                      Schlafzimmer mit Doppelbett. Badezimmer mit Dusche, WC und
                      Waschmaschine.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-11 h-11 flex items-center justify-center bg-white border border-gray-200">
                    <BedDouble size={20} style={{ color: BRAND }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Obergeschoss</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Drei Schlafzimmer mit je zwei Betten sowie ein weiteres
                      Badezimmer. Insgesamt Platz für bis zu acht Gäste.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-11 h-11 flex items-center justify-center bg-white border border-gray-200">
                    <Trees size={20} style={{ color: BRAND }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Aussenbereich</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Grosser Garten mit Pergola, Granittisch und Blick auf den
                      Lago Maggiore. Parkplatz vorhanden, Haustiere nach Absprache.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeUp} className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Ausstattung
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {(listing?.features ?? []).map((f) => (
                  <div key={f} className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-3">
                    <ChevronRight size={14} style={{ color: BRAND }} className="shrink-0" />
                    <span className="text-sm text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-3 text-sm text-gray-500">
                <PawPrint size={16} /> Haustiere nach Absprache
                <span className="text-gray-300">·</span>
                <Car size={16} /> Parkplatz vorhanden
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Location & surroundings ──────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-20">
        <motion.div {...fadeUp} className="max-w-2xl mb-12">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-400 mb-3">
            Lage & Umgebung
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            Mitten im <span className="font-black">Tessin</span>
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Gordemo liegt am Eingang zum Verzascatal, oberhalb von Gordola. See,
            Fluss, Berge und die Seepromenaden von Ascona und Locarno sind alle
            in kurzer Zeit erreichbar.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] items-stretch mb-8">
          <motion.div {...fadeUp}>
            <LocationMap
              lat={listing?.lat ?? 46.12}
              lng={listing?.lng ?? 8.73}
              label="Casa Reto · Gordemo"
            />
          </motion.div>

          <div className="grid gap-px bg-gray-100 sm:grid-cols-2 border border-gray-100">
            {SURROUNDINGS.map(({ Icon, title, text }) => (
              <motion.div {...fadeUp} key={title} className="bg-white p-6">
                <Icon size={22} style={{ color: BRAND }} className="mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <a
          href="https://www.google.com/maps/search/?api=1&query=Gordemo+Gordola+Ticino"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
        >
          <MapPin size={16} style={{ color: BRAND }} /> Auf Google Maps ansehen
          <ArrowRight size={15} />
        </a>
      </section>

      {/* ── Availability + booking + enquiry ─────────────────────────────── */}
      <section id="anfrage" className="bg-gray-50 border-y border-gray-100 scroll-mt-24">
        <div className="container mx-auto px-6 py-20">
          <motion.div {...fadeUp} className="max-w-2xl mb-12">
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-gray-400 mb-3">
              Buchung
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              Verfügbarkeit & <span className="font-black">Anfrage</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Vermietung wochenweise (Samstag bis Samstag), mit speziellen
              Familientarifen. Prüfen Sie die Verfügbarkeit und senden Sie uns
              unverbindlich Ihre Anfrage, oder buchen Sie direkt über Airbnb und
              Booking.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] items-start">
            {/* Left: calendar + external platforms */}
            <div className="space-y-6">
              {listing?.icalUrl && <AvailabilityCalendar icalUrl={listing.icalUrl} />}

              <div className="bg-white border border-gray-100 p-5">
                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Star size={14} style={{ color: BRAND }} /> Direkt buchen
                </h4>
                <div className="space-y-3">
                  {airbnbUrl && (
                    <a href={airbnbUrl} target="_blank" rel="noreferrer"
                      className="flex items-center justify-between border border-gray-200 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <span className="text-sm font-semibold text-gray-700">Auf Airbnb buchen</span>
                      <ArrowRight size={15} className="text-gray-400" />
                    </a>
                  )}
                  {bookingUrl && (
                    <a href={bookingUrl} target="_blank" rel="noreferrer"
                      className="flex items-center justify-between border border-gray-200 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <span className="text-sm font-semibold text-gray-700">Auf Booking.com buchen</span>
                      <ArrowRight size={15} className="text-gray-400" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right: enquiry form */}
            <div className="bg-white border border-gray-100 p-7 md:p-9">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Unverbindlich anfragen</h3>
              <p className="text-sm text-gray-500 mb-6">
                Wir prüfen die Verfügbarkeit und melden uns innerhalb von 24 Stunden.
              </p>
              <CasaRetoAnfrageForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light text-gray-900 mb-3">
            Noch <span className="font-black">Fragen?</span>
          </h2>
          <p className="text-gray-600 mb-10">Wir helfen Ihnen gerne persönlich weiter.</p>
          <div className="grid gap-4 sm:grid-cols-3 text-left">
            {[
              { href: 'tel:+41319518554', Icon: Phone, label: 'Telefon', value: '+41 31 951 85 54' },
              { href: 'https://wa.me/41319518553', Icon: MessageCircle, label: 'WhatsApp', value: '+41 31 951 85 53', external: true },
              { href: `mailto:${listing?.contact?.email || 'office@reto-amonn.ch'}`, Icon: Mail, label: 'E-Mail', value: listing?.contact?.email || 'office@reto-amonn.ch' },
            ].map(({ href, Icon, label, value, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-5 hover:bg-gray-100 transition-colors"
              >
                <Icon style={{ color: BRAND }} className="shrink-0" size={24} />
                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</div>
                  <div className="text-sm font-semibold text-gray-900">{value}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10">
            <Link to="/immobilien" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              Weitere Immobilien & Ferienobjekte <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
