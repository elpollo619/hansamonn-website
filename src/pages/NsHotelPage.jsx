import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, Mail, MessageCircle, MessageSquare,
  CalendarDays, ArrowRight, KeyRound, Car, Wifi, Train, Expand, Rotate3d,
} from "lucide-react";
import { Helmet } from 'react-helmet';
import Lightbox from '@/components/Lightbox';
import PanoramaViewer from '@/components/PanoramaViewer';
import Model3DSection from '@/components/Model3DSection';

const BRAND = 'var(--brand-color, #1D3D78)';
const IMG = '/images/ns-hotel';

function getBookingDates() {
  const fmt = (d) => d.toISOString().split('T')[0];
  const arrival = new Date(); arrival.setDate(arrival.getDate() + 1);
  const departure = new Date(); departure.setDate(departure.getDate() + 2);
  return { arrival: fmt(arrival), departure: fmt(departure) };
}

const FACTS = [
  { Icon: KeyRound, label: 'Self Check-in', sub: 'Kontaktlos' },
  { Icon: Car,      label: 'Parkplatz',     sub: 'Kostenlos' },
  { Icon: Wifi,     label: 'WLAN',          sub: 'Inklusive' },
  { Icon: Train,    label: 'Bern',          sub: '22 km entfernt' },
];

const ROOMS = [
  {
    key: 'doppel',
    name: 'Doppelzimmer',
    text: 'Helle Doppelzimmer mit grossem Bett, Flachbild-TV, Kaffeemaschine und eigenem Badezimmer. Ideal für Paare und Geschäftsreisende.',
    images: [
      { url: `${IMG}/doppelzimmer.jpg`,   alt: 'Doppelzimmer mit Fenster' },
      { url: `${IMG}/doppelzimmer-2.jpg`, alt: 'Doppelzimmer mit Garderobe' },
      { url: `${IMG}/bad.jpg`,            alt: 'Badezimmer mit Dusche' },
    ],
  },
  {
    key: 'familie',
    name: 'Familienzimmer',
    text: 'Zwei Zimmer mit Verbindungstür, genug Platz und Privatsphäre für Familien oder kleine Teams, die zusammen reisen.',
    images: [
      { url: `${IMG}/familienzimmer.jpg`, alt: 'Familienzimmer mit Verbindungstür' },
      { url: `${IMG}/zimmer-hell.jpg`,    alt: 'Zimmer mit Sitzecke' },
      { url: `${IMG}/kueche.jpg`,         alt: 'Gemeinschaftsküche' },
    ],
  },
  {
    key: 'barrierefrei',
    name: 'Barrierefrei',
    text: 'Rollstuhlgängige Zimmer mit schwellenlosem Zugang und barrierefreiem Badezimmer mit Haltegriffen und Duschsitz.',
    images: [
      { url: `${IMG}/zimmer-barrierefrei.jpg`, alt: 'Barrierefreies Zimmer' },
      { url: `${IMG}/bad-barrierefrei.jpg`,    alt: 'Barrierefreies Badezimmer' },
    ],
  },
  {
    key: 'gemeinschaft',
    name: 'Gemeinschaft',
    text: 'Lounge, voll ausgestattete Gemeinschaftsküche und Schliessfächer, Treffpunkt für Gäste, die länger bleiben oder selbst kochen möchten.',
    images: [
      { url: `${IMG}/lounge.jpg`,          alt: 'Lounge' },
      { url: `${IMG}/kueche.jpg`,          alt: 'Gemeinschaftsküche' },
      { url: `${IMG}/lounge-kueche.jpg`,   alt: 'Essbereich' },
      { url: `${IMG}/kochnische.jpg`,      alt: 'Kochnische' },
      { url: `${IMG}/schliessfaecher.jpg`, alt: 'Schliessfächer' },
      { url: `${IMG}/signaletik.jpg`,      alt: "N's Hotel Signaletik" },
    ],
  },
];

const PANORAMAS = [
  { id: '01', label: 'Eingang',                lon: 100 },
  { id: '06', label: 'Schlafbereich',          lon: 250 },
  { id: '10', label: 'Fenster & Arbeitsplatz', lon: 65 },
  { id: '08', label: 'Bett & Garderobe',       lon: 70 },
  { id: '04', label: 'Dusche',                 lon: 145 },
  { id: '05', label: 'Lavabo',                 lon: 160 },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

export default function NsHotelPage() {
  const { arrival, departure } = getBookingDates();
  const [roomKey, setRoomKey] = useState(ROOMS[0].key);
  const [pano, setPano] = useState(PANORAMAS[0].id);
  const [lightbox, setLightbox] = useState(null); // { images, index }

  const room = ROOMS.find((r) => r.key === roomKey);
  const currentPano = PANORAMAS.find((p) => p.id === pano);
  const directUrl = `https://my.ns-hotel.ch/search/offers?ADULTS=1&CHILDREN=&ARRIVAL=${arrival}&DEPARTURE=${departure}&PROPERTY_IDS=NSH`;
  const airbnbUrl = `https://www.airbnb.ch/rooms/1300557231274190252?check_in=${arrival}&check_out=${departure}&guests=1&adults=1`;

  return (
    <div className="bg-white text-gray-900">
      <Helmet>
        <title>N's Hotel Kerzers – Boutique Hotel | Hans Amonn AG</title>
        <meta name="description" content="Modernes Boutique-Hotel in Kerzers mit Self Check-in. Ideal für Geschäftsreisen und Kurzaufenthalte." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="N's Hotel Kerzers – Boutique Hotel | Hans Amonn AG" />
        <meta property="og:description" content="Modernes Boutique-Hotel in Kerzers mit Self Check-in. Ideal für Geschäftsreisen und Kurzaufenthalte." />
        <meta property="og:image" content="https://www.hansamonn.ch/images/ns-hotel/aussen.jpg" />
        <meta property="og:url" content="https://www.hansamonn.ch/ns-hotel" />
        <meta property="og:site_name" content="Hans Amonn AG" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden bg-[#0B1220]">
        <div
          className="absolute inset-0 bg-cover bg-center kenburns"
          style={{ backgroundImage: `url(${IMG}/aussen.jpg)` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/45 to-[#0B1220]/10" />

        <div className="relative container mx-auto px-6 pb-14 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <p className="text-[11px] font-semibold tracking-hairline text-white/70 uppercase mb-4">
              Hans Amonn AG · Short Stay · Kerzers
            </p>
            <h1 className="font-display uppercase text-white text-4xl md:text-6xl font-semibold leading-[0.92] mb-6">
              N&apos;s Hotel
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed mb-9">
              Modernes Boutique-Hotel mit Self Check-in, für Geschäftsreisen,
              Kurzaufenthalte und alle, die unkompliziert übernachten möchten.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={directUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                <CalendarDays size={16} /> Direkt buchen
              </a>
              <a href="https://www.booking.com/Share-WIWuII" target="_blank" rel="noreferrer"
                className="px-6 py-3.5 border border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                Booking.com
              </a>
              <a href={airbnbUrl} target="_blank" rel="noreferrer"
                className="px-6 py-3.5 border border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                Airbnb
              </a>
            </div>
            <p className="mt-4 text-xs text-white/60">
              Preise pro Zimmer und Nacht in CHF, zuzüglich Aufenthaltstaxe des Kantons Freiburg.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Quick facts ──────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {FACTS.map(({ Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-4 py-7 px-4 md:px-8">
                <Icon size={22} style={{ color: BRAND }} className="shrink-0" />
                <div>
                  <div className="font-display uppercase text-lg font-semibold leading-none">{label}</div>
                  <div className="text-xs text-gray-500 mt-1">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Intro + mosaic ───────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <motion.div {...fadeUp} className="lg:col-span-5">
            <p className="eyebrow mb-3">Ihr Aufenthalt</p>
            <h2 className="display-heading uppercase text-3xl md:text-4xl mb-6">
              Ankommen, <br />einchecken, wohlfühlen
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Das N&apos;s Hotel ist ideal für Gäste, Touristen und Business-Trips.
              Buchungen können direkt über unsere eigene Plattform oder alternativ
              über Booking und Airbnb erfolgen.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Für direkte Anfragen kann das Formular ebenfalls verwendet werden.
            </p>
            <Link
              to="/immobilien/anfrage"
              className="inline-flex items-center gap-2 font-semibold text-sm hover:gap-3 transition-all"
              style={{ color: BRAND }}
            >
              Direkt anfragen <ArrowRight size={15} />
            </Link>
          </motion.div>

          <motion.div {...fadeUp} className="lg:col-span-7 grid grid-cols-6 grid-rows-2 gap-3 h-[420px] md:h-[520px]">
            {[
              { url: `${IMG}/lounge.jpg`,        alt: 'Lounge',            cls: 'col-span-4 row-span-1' },
              { url: `${IMG}/detail-blumen.jpg`, alt: 'Essbereich',        cls: 'col-span-2 row-span-2' },
              { url: `${IMG}/schliessfaecher.jpg`, alt: 'Self-Check-in Schliessfächer', cls: 'col-span-2 row-span-1' },
              { url: `${IMG}/kochnische.jpg`,    alt: 'Kochnische',        cls: 'col-span-2 row-span-1' },
            ].map((img, i, arr) => (
              <button
                key={img.url}
                type="button"
                onClick={() => setLightbox({ images: arr, index: i })}
                className={`${img.cls} relative overflow-hidden group bg-gray-100`}
              >
                <img src={img.url} alt={img.alt} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Rooms ────────────────────────────────────────────────────────── */}
      <section className="surface-warm py-24">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="eyebrow mb-3">Zimmer & Räume</p>
              <h2 className="display-heading uppercase text-3xl md:text-4xl">Für jeden Aufenthalt</h2>
            </div>
            <div className="flex flex-wrap gap-2" role="tablist">
              {ROOMS.map((r) => (
                <button
                  key={r.key}
                  role="tab"
                  aria-selected={r.key === roomKey}
                  onClick={() => setRoomKey(r.key)}
                  className={`px-4 py-2 text-sm font-semibold border transition-colors ${
                    r.key === roomKey
                      ? 'text-white border-transparent'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                  style={r.key === roomKey ? { backgroundColor: BRAND } : undefined}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={room.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid lg:grid-cols-12 gap-6"
            >
              <button
                type="button"
                onClick={() => setLightbox({ images: room.images, index: 0 })}
                className="lg:col-span-8 relative overflow-hidden group bg-gray-200 aspect-[3/2]"
              >
                <img src={room.images[0].url} alt={room.images[0].alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-800">
                  <Expand size={13} /> {room.images.length} Bilder
                </span>
              </button>

              <div className="lg:col-span-4 flex flex-col">
                <h3 className="font-display uppercase text-3xl font-semibold mb-3">{room.name}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{room.text}</p>
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  {room.images.slice(1, 5).map((img, i) => (
                    <button
                      key={img.url + i}
                      type="button"
                      onClick={() => setLightbox({ images: room.images, index: i + 1 })}
                      className="relative overflow-hidden group bg-gray-200 aspect-[3/2]"
                    >
                      <img src={img.url} alt={img.alt} loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 360° tour ────────────────────────────────────────────────────── */}
      <section className="bg-[#0B1220] text-white py-24">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] font-semibold tracking-hairline text-white/60 uppercase mb-3 inline-flex items-center gap-2">
                <Rotate3d size={14} /> 360° Rundgang
              </p>
              <h2 className="font-display uppercase text-3xl md:text-4xl font-semibold leading-none">
                Das Musterzimmer
              </h2>
            </div>
            <p className="text-white/60 max-w-md leading-relaxed">
              Schauen Sie sich um, bevor Sie buchen: Ziehen Sie mit der Maus oder
              dem Finger, um sich im Zimmer zu drehen.
            </p>
          </motion.div>

          <div className="relative aspect-[4/3] md:aspect-[21/9] border border-white/10 overflow-hidden">
            <PanoramaViewer
              key={currentPano.id}
              src={`${IMG}/360/${currentPano.id}.jpg`}
              initialLon={currentPano.lon}
              fallback={`${IMG}/360/${currentPano.id}-thumb.jpg`}
              alt={`360° Ansicht Musterzimmer – ${currentPano.label}`}
            />
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {PANORAMAS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPano(p.id)}
                className={`relative shrink-0 w-40 md:w-48 aspect-[2/1] overflow-hidden border-2 transition-colors ${
                  p.id === pano ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={`${IMG}/360/${p.id}-thumb.jpg`} alt="" loading="lazy" className="w-full h-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pt-4 pb-1.5 text-left text-[11px] font-semibold tracking-wide">
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3D model from the plans ─────────────────────────────────────── */}
      <Model3DSection />

      {/* ── Aerial ───────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="max-w-2xl mb-10">
            <p className="eyebrow mb-3">Von oben</p>
            <h2 className="display-heading uppercase text-3xl md:text-4xl mb-4">Allmendstrasse 12 + 14</h2>
            <p className="text-gray-600 leading-relaxed">
              Ruhig gelegen in Kerzers, direkt an der Bahnlinie Bern–Neuchâtel,
              mit begrünten Dächern, Garten und eigenen Parkplätzen.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { url: `${IMG}/drohne-2.jpg`, alt: "Luftaufnahme N's Hotel Kerzers" },
              { url: `${IMG}/drohne-1.jpg`, alt: "Luftaufnahme Allmendstrasse Kerzers" },
            ].map((img, i, arr) => (
              <motion.button
                key={img.url}
                {...fadeUp}
                type="button"
                onClick={() => setLightbox({ images: arr, index: i })}
                className="relative overflow-hidden group aspect-[16/9] bg-gray-100"
              >
                <img src={img.url} alt={img.alt} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section className="surface-warm border-t border-gray-100">
        <div className="container mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <MessageSquare style={{ color: BRAND }} size={30} className="mb-5" />
              <h3 className="display-heading uppercase text-3xl md:text-4xl mb-4">
                Fragen oder Probleme?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Kontaktiere uns, wir helfen gerne weiter, auch kurzfristig.
              </p>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-3">
              {[
                { href: 'tel:+41319518554', Icon: Phone, label: 'Telefon', value: '+41 31 951 85 54' },
                { href: 'https://wa.me/41319518553', Icon: MessageCircle, label: 'WhatsApp', value: '+41 31 951 85 53', external: true },
                { href: 'mailto:info@ns-hotel.ch', Icon: Mail, label: 'E-Mail', value: 'info@ns-hotel.ch' },
                { href: 'sms:+41775350668', Icon: MessageSquare, label: 'SMS', value: '+41 77 535 06 68' },
              ].map(({ href, Icon, label, value, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="flex items-center gap-5 bg-white border border-gray-100 p-5 hover:border-gray-300 transition-colors"
                >
                  <Icon style={{ color: BRAND }} className="shrink-0" size={24} />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</div>
                    <div className="text-base font-semibold" style={{ color: BRAND }}>{value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}
