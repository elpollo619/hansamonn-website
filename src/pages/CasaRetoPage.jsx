import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  MapPin, Users, BedDouble, Bath, CalendarDays, ArrowRight, Phone, Mail,
  MessageCircle, Star, Check, Footprints, Clock, ChevronDown,
} from 'lucide-react';

import { getListingBySlug } from '@/data/rentalData';
import { loadLeaflet } from '@/lib/leaflet';
import {
  CR_FACTS, CR_RATING, CR_AMENITIES, CR_DISTANCES, CR_ACTIVITIES, CR_RULES,
  CR_REGISTRATION, CR_FAQ,
} from '@/data/casaReto';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import CasaRetoAnfrageForm from '@/components/CasaRetoAnfrageForm';
import CasaRetoTour from '@/components/CasaRetoTour';
import Model3DSection from '@/components/Model3DSection';

const BRAND = 'var(--brand-color, #1D3D78)';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const fmt = (n) => (Number.isInteger(Math.round(n * 100) / 10) ? n.toFixed(1) : n.toFixed(2)).replace('.', ',');

/* Small self-contained Leaflet map with a single marker (bundled Leaflet + CARTO tiles). */
function LocationMap({ lat, lng, label }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const [cssReady, setCssReady] = useState(false);

  useEffect(() => {
    loadLeaflet().then(() => setCssReady(true));
  }, []);

  useEffect(() => {
    if (!cssReady || instanceRef.current || !mapRef.current) return;
    let cancelled = false;
    loadLeaflet().then((L) => {
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

function SectionHead({ eyebrow, title, text, className = '' }) {
  return (
    <motion.div {...fadeUp} className={`max-w-2xl mb-10 ${className}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="display-heading uppercase text-3xl md:text-4xl mb-4">{title}</h2>
      {text && <p className="text-gray-600 leading-relaxed">{text}</p>}
    </motion.div>
  );
}

export default function CasaRetoPage() {
  const listing = getListingBySlug('casa-reto');
  const bookingUrl = listing?.bookingUrls?.booking;
  const airbnbUrl = listing?.bookingUrls?.airbnb;
  const email = listing?.contact?.email || 'office@reto-amonn.ch';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'House',
        name: 'Casa Reto',
        description: listing?.description,
        url: 'https://www.hansamonn.ch/immobilien/casa-reto',
        image: 'https://www.hansamonn.ch/images/casa-reto/titel.jpg',
        numberOfRooms: 4,
        numberOfBedrooms: 4,
        numberOfBathroomsTotal: 2,
        occupancy: { '@type': 'QuantitativeValue', maxValue: 8 },
        petsAllowed: true,
        address: { '@type': 'PostalAddress', addressLocality: 'Gordola', addressRegion: 'TI', addressCountry: 'CH' },
        amenityFeature: CR_AMENITIES.flatMap((g) => g.items.slice(0, 3)).map((name) => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: CR_FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  };

  return (
    <div className="bg-white text-gray-900">
      <Helmet>
        <title>Casa Reto | Ferienhaus mit Seeblick im Tessin | Hans Amonn AG</title>
        <meta name="description" content="Casa Reto in Gordemo oberhalb von Tenero: Ferienhaus für bis zu 8 Gäste, 4 Schlafzimmer, Garten mit Pergola und Blick auf den Lago Maggiore. Virtueller Rundgang, Verfügbarkeit und Anfrage." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Casa Reto, Ferienhaus mit Seeblick im Tessin" />
        <meta property="og:description" content="4 Schlafzimmer, Garten mit Pergola, Holzofen und Blick auf den Lago Maggiore. Für bis zu 8 Gäste." />
        <meta property="og:image" content="https://www.hansamonn.ch/images/casa-reto/titel.jpg" />
        <meta property="og:url" content="https://www.hansamonn.ch/immobilien/casa-reto" />
        <meta property="og:site_name" content="Hans Amonn AG" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden bg-[#0B1220]">
        <img
          src="/images/casa-reto/titel.jpg"
          alt="Blick von der Casa Reto über den Lago Maggiore"
          className="absolute inset-0 w-full h-full object-cover kenburns"
          loading="eager"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/35 to-[#0B1220]/10" />

        <div className="relative container mx-auto px-6 pb-14 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-3xl text-white"
          >
            <p className="text-[11px] font-semibold tracking-hairline uppercase text-white/70 mb-4">
              Ferienhaus im Tessin
            </p>
            <h1 className="font-display uppercase text-5xl md:text-7xl font-semibold leading-[0.9] mb-6">
              Casa Reto
            </h1>
            <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl mb-7">
              Ferienhaus in Gordemo oberhalb von Tenero: Garten mit Pergola, Holzofen und
              ein weiter Blick über den Lago Maggiore.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-9 text-sm text-white/85">
              <span className="inline-flex items-center gap-2">
                <Star size={16} className="fill-current text-amber-300" />
                <strong className="text-white">{fmt(CR_RATING.score)}</strong> · {CR_RATING.count} Bewertungen auf {CR_RATING.source}
              </span>
              <span className="inline-flex items-center gap-2"><Users size={16} /> Bis 8 Gäste</span>
              <span className="inline-flex items-center gap-2"><BedDouble size={16} /> 4 Schlafzimmer</span>
              <span className="inline-flex items-center gap-2"><Bath size={16} /> 2 Duschbäder</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#anfrage"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold text-sm transition-colors hover:brightness-110"
                style={{ backgroundColor: BRAND }}
              >
                <CalendarDays size={16} /> Verfügbarkeit prüfen
              </a>
              <a
                href="#rundgang"
                className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-sm text-white border border-white/40 hover:bg-white/10 transition-colors"
              >
                <Footprints size={16} /> Virtueller Rundgang
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Facts + intro ────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 pt-14 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 border-b border-gray-100 pb-10 mb-14">
          {CR_FACTS.map((f) => (
            <div key={f.label} className="border-t-2 pt-3" style={{ borderColor: BRAND }}>
              <div className="font-display uppercase text-3xl md:text-4xl font-semibold text-[#0F1B2D] leading-none">{f.value}</div>
              <div className="text-sm text-gray-500 mt-1.5">{f.label}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <motion.div {...fadeUp}>
            <h2 className="display-heading uppercase text-3xl md:text-4xl mb-6">Ankommen und durchatmen</h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Casa Reto steht im Dorfkern von Gordemo, am Hang oberhalb von Tenero und am Eingang
              zum Verzascatal. Im Erdgeschoss liegen Wohnzimmer mit Holzofen, Küche mit Essplatz
              für acht Personen, ein halboffenes Schlafzimmer und ein Duschbad. Oben warten drei
              weitere Schlafzimmer, ein zweites Duschbad und ein Balkon.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Draussen gehört ein eigener Garten dazu: Rasen, Hängematte, Grill und eine Pergola
              mit Granittisch, von dem aus man über den ganzen See schaut. Das Auto steht direkt
              beim Haus.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <img
              src="/images/casa-reto/wohnzimmer-ausblick.jpg"
              alt="Blick vom Wohnzimmer durch die Terrassentür auf den Lago Maggiore"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Virtual tour ─────────────────────────────────────────────────── */}
      <section id="rundgang" className="surface-warm border-y border-gray-100 scroll-mt-20">
        <div className="container mx-auto px-6 py-20">
          <SectionHead
            eyebrow="Virtueller Rundgang"
            title="Raum für Raum durchs Haus"
            text="Elf Stationen von der Ankunft bis zur Aussicht. Tippen Sie auf einen Punkt im Grundriss oder lassen Sie den Rundgang abspielen."
          />
          <CasaRetoTour />
        </div>
      </section>

      {/* ── View, day and night ─────────────────────────────────────────── */}
      <section className="grid md:grid-cols-2">
        {[
          { src: '/images/casa-reto/aussicht-garten.jpg', label: 'Am Tag', alt: 'Aussicht vom Garten über den Lago Maggiore am Tag' },
          { src: '/images/casa-reto/aussicht-nacht.jpg', label: 'Am Abend', alt: 'Lichter am Lago Maggiore am Abend' },
        ].map((v) => (
          <figure key={v.label} className="relative aspect-[4/3] md:aspect-auto md:h-[70vh] overflow-hidden bg-gray-900">
            <img src={v.src} alt={v.alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
            <figcaption className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
              <span className="font-display uppercase text-white text-2xl md:text-3xl font-semibold">{v.label}</span>
            </figcaption>
          </figure>
        ))}
      </section>

      {/* ── 3D model ─────────────────────────────────────────────────────── */}
      <Model3DSection ids={['cr']} eyebrow="Das Haus in 3D" title="Aus den Bauplänen" className="bg-white" />

      {/* ── Amenities ────────────────────────────────────────────────────── */}
      <section className="surface-warm border-y border-gray-100">
        <div className="container mx-auto px-6 py-20">
          <SectionHead title="Ausstattung" text="Alles, was Sie für eine Ferienwoche brauchen, ist schon da." />
          <div className="grid gap-px bg-gray-200 border border-gray-200 sm:grid-cols-2 lg:grid-cols-3">
            {CR_AMENITIES.map((g) => (
              <motion.div {...fadeUp} key={g.group} className="bg-white p-7">
                <h3 className="font-semibold text-[#0F1B2D] mb-4">{g.group}</h3>
                <ul className="space-y-2.5">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <Check size={16} className="mt-0.5 shrink-0" style={{ color: BRAND }} />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <motion.div {...fadeUp} className="lg:col-span-5">
            <h2 className="display-heading uppercase text-3xl md:text-4xl mb-6">Was Gäste sagen</h2>
            <div className="flex items-end gap-4 mb-4">
              <span className="font-display text-7xl font-semibold leading-none text-[#0F1B2D]">{fmt(CR_RATING.score)}</span>
              <span className="pb-2 text-gray-500 text-sm leading-snug">
                von 5 Sternen<br />{CR_RATING.count} Bewertungen auf {CR_RATING.source}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed mb-5">
              Am häufigsten loben Gäste die {CR_RATING.mentions.slice(0, 3).join(', ').replace(/, ([^,]*)$/, ' und $1')}.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {CR_RATING.mentions.map((m) => (
                <span key={m} className="border border-gray-200 px-3 py-1.5 text-sm text-gray-700">{m}</span>
              ))}
            </div>
            {airbnbUrl && (
              <a href={`${airbnbUrl}/reviews`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: BRAND }}>
                Alle Bewertungen auf Airbnb lesen <ArrowRight size={15} />
              </a>
            )}
          </motion.div>
          <motion.div {...fadeUp} className="lg:col-span-7 lg:pt-16">
            <ul className="space-y-4">
              {CR_RATING.categories.map((c) => (
                <li key={c.label} className="grid grid-cols-[9rem_1fr_2.5rem] items-center gap-4 text-sm">
                  <span className="text-gray-700">{c.label}</span>
                  <span className="h-1.5 bg-gray-100 relative overflow-hidden">
                    <span className="absolute inset-y-0 left-0" style={{ width: `${(c.value / 5) * 100}%`, backgroundColor: BRAND }} />
                  </span>
                  <span className="font-semibold text-[#0F1B2D] text-right">{fmt(c.value)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-gray-400">Stand {CR_RATING.asOf}, Durchschnitt der Bewertungen auf {CR_RATING.source}.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Location & surroundings ──────────────────────────────────────── */}
      <section className="surface-warm border-y border-gray-100">
        <div className="container mx-auto px-6 py-20">
          <SectionHead
            title="Lage & Umgebung"
            text="Gordemo liegt am Hang über Gordola und Tenero, am Eingang zum Verzascatal. See, Fluss und die Städte am Lago Maggiore erreichen Sie in wenigen Minuten."
          />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr] items-start mb-12">
            <motion.div {...fadeUp} className="min-w-0">
              <LocationMap lat={listing?.lat ?? 46.18} lng={listing?.lng ?? 8.86} label="Casa Reto · Gordemo" />
              <p className="mt-2 text-xs text-gray-500">Ungefähre Lage. Die genaue Adresse erhalten Sie mit der Buchungsbestätigung.</p>
            </motion.div>
            <motion.div {...fadeUp} className="bg-white border border-gray-100">
              <h3 className="flex items-center gap-2 font-semibold text-[#0F1B2D] px-6 pt-6 pb-3">
                <Clock size={17} style={{ color: BRAND }} /> Fahrzeiten mit dem Auto
              </h3>
              <ul>
                {CR_DISTANCES.map((d) => (
                  <li key={d.place} className="flex items-center justify-between gap-4 px-6 py-3 border-t border-gray-100 text-sm">
                    <span className="text-gray-700">{d.place}</span>
                    <span className="font-semibold text-[#0F1B2D] whitespace-nowrap">{d.time}</span>
                  </li>
                ))}
              </ul>
              <p className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">Richtwerte, je nach Verkehr.</p>
            </motion.div>
          </div>
          <div className="grid gap-px bg-gray-200 border border-gray-200 sm:grid-cols-2 lg:grid-cols-4">
            {CR_ACTIVITIES.map((a) => (
              <motion.div {...fadeUp} key={a.title} className="bg-white p-6">
                <h3 className="font-semibold text-[#0F1B2D] mb-2">{a.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{a.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Good to know ─────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <motion.div {...fadeUp} className="lg:col-span-4">
            <h2 className="display-heading uppercase text-3xl md:text-4xl mb-4">Gut zu wissen</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Hausregeln und Details zur Anreise. Bei Fragen melden Sie sich einfach bei uns.
            </p>
            <p className="text-sm text-gray-500">
              Registriert beim Kanton Tessin<br />
              <span className="font-semibold text-gray-700">Nr. {CR_REGISTRATION}</span>
            </p>
          </motion.div>
          <motion.dl {...fadeUp} className="lg:col-span-8 grid sm:grid-cols-2 gap-x-10">
            {CR_RULES.map((r) => (
              <div key={r.label} className="py-4 border-b border-gray-100">
                <dt className="text-sm font-semibold text-[#0F1B2D]">{r.label}</dt>
                <dd className="text-sm text-gray-600 mt-0.5">{r.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* ── Availability + booking + enquiry ─────────────────────────────── */}
      <section id="anfrage" className="surface-warm border-y border-gray-100 scroll-mt-24">
        <div className="container mx-auto px-6 py-20">
          <SectionHead
            eyebrow="Buchung"
            title="Verfügbarkeit & Anfrage"
            text="Vermietung bevorzugt wochenweise, auf Anfrage auch kürzer oder ab 28 Tagen. Prüfen Sie den Kalender und senden Sie uns unverbindlich Ihre Anfrage, oder buchen Sie direkt über Airbnb oder Booking.com."
          />

          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] items-start">
            <div className="space-y-6">
              {listing?.icalUrl && <AvailabilityCalendar icalUrl={listing.icalUrl} />}

              <div className="bg-white border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Auf einer Plattform buchen</h3>
                <div className="space-y-3">
                  {airbnbUrl && (
                    <a href={airbnbUrl} target="_blank" rel="noreferrer"
                      className="flex items-center justify-between border border-gray-200 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <span className="text-sm font-semibold text-gray-700">Airbnb</span>
                      <ArrowRight size={15} className="text-gray-400" />
                    </a>
                  )}
                  {bookingUrl && (
                    <a href={bookingUrl} target="_blank" rel="noreferrer"
                      className="flex items-center justify-between border border-gray-200 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <span className="text-sm font-semibold text-gray-700">Booking.com</span>
                      <ArrowRight size={15} className="text-gray-400" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-7 md:p-9">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Unverbindlich anfragen</h3>
              <p className="text-sm text-gray-500 mb-6">
                Wir prüfen die Verfügbarkeit und melden uns innerhalb von 24 Stunden.
              </p>
              <CasaRetoAnfrageForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <motion.div {...fadeUp} className="lg:col-span-4">
            <h2 className="display-heading uppercase text-3xl md:text-4xl mb-4">Häufige Fragen</h2>
            <p className="text-gray-600 leading-relaxed">Ihre Frage ist nicht dabei? Rufen Sie uns an oder schreiben Sie uns.</p>
          </motion.div>
          <motion.div {...fadeUp} className="lg:col-span-8">
            <div className="border-t border-gray-100">
              {CR_FAQ.map(({ q, a }) => (
                <details key={q} className="group border-b border-gray-100">
                  <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none font-semibold text-[#0F1B2D] [&::-webkit-details-marker]:hidden">
                    {q}
                    <ChevronDown size={18} className="shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-5 -mt-1 text-gray-600 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100">
        <div className="container mx-auto px-6 py-16">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { href: 'tel:+41319518554', Icon: Phone, label: 'Telefon', value: '+41 31 951 85 54' },
              { href: 'https://wa.me/41319518553', Icon: MessageCircle, label: 'WhatsApp', value: '+41 31 951 85 53', external: true },
              { href: `mailto:${email}`, Icon: Mail, label: 'E-Mail', value: email },
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
          <div className="mt-10 text-center">
            <Link to="/immobilien" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
              <MapPin size={15} /> Weitere Immobilien & Ferienobjekte <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
