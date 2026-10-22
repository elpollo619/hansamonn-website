/**
 * Knowledge for the website assistant (local answers in the browser and the optional AI mode).
 * Only facts that are published elsewhere on this website. Plain JS with relative imports only,
 * so the serverless function in /api can import it too.
 */
import { CR_FACTS, CR_RATING, CR_RULES, CR_DISTANCES, CR_AMENITIES, CR_FAQ, CR_REGISTRATION } from './casaReto.js';
import { OFFICE_HOURS } from './officeHours.js';
import { rentalData } from './rentalData.js';

export const COMPANY = {
  name: 'Hans Amonn AG',
  address: 'Blümlisalpstrasse 4, 3074 Muri bei Bern',
  phone: '+41 (0)31 951 85 54',
  phoneHref: 'tel:+41319518554',
  email: 'office@reto-amonn.ch',
  whatsapp: '41775350668',
  uid: 'CHE-106.957.227',
  founded: 1968,
  officeHours: `Mo–Fr ${OFFICE_HOURS.office}`,
  phoneHours: `Mo–Fr ${OFFICE_HOURS.phone}`,
  urgent: OFFICE_HOURS.urgent,
};

const bySlug = (slug) => rentalData.find((r) => r.slug === slug) || {};

const longStay = (slug, key, place, link) => {
  const r = bySlug(slug);
  return {
    key,
    place,
    link,
    address: r.address,
    rooms: (r.longStayRooms || []).filter((x) => !x.isAddon).map((x) => ({
      label: x.label,
      size: x.size,
      price: x.price,
      from: Boolean(x.isFrom),
    })),
    parking: (r.longStayRooms || []).find((x) => x.isAddon)?.price ?? null,
    deposit: r.deposit ?? null,
    includes: r.includes || [],
  };
};

export const LONG_STAY = [
  longStay('long-stay-kerzers', 'kerzers', 'Kerzers', '/long-stay/kerzers'),
  longStay('long-stay-munchenbuchsee', 'muenchenbuchsee', 'Münchenbuchsee', '/long-stay/munchenbuchsee'),
  longStay('long-stay-muri', 'muri', 'Muri bei Bern', '/long-stay/muri'),
];

export const LONG_STAY_FROM = Math.min(...LONG_STAY.flatMap((l) => l.rooms.map((r) => r.price)));

const hotel = bySlug('ns-hotel-kerzers');
export const HOTEL = {
  name: "N's Hotel",
  address: 'Allmendstrasse 14, 3210 Kerzers',
  link: '/ns-hotel',
  priceFrom: hotel.price ?? 89,
  rooms: 36,
  roomTypes: ['Doppelzimmer', 'Familienzimmer mit Verbindungstür', 'barrierefreie Zimmer'],
  features: ['Self Check-in, kontaktlos', 'kostenloser Parkplatz', 'WLAN inklusive', 'Lounge und Gemeinschaftsküche', 'Schliessfächer'],
  tax: 'Preise pro Zimmer und Nacht in CHF, zuzüglich Aufenthaltstaxe des Kantons Freiburg',
  bern: 'rund 22 km bis Bern',
  booking: [
    { label: 'Direkt buchen', url: hotel.directBookingUrl },
    { label: 'Booking.com', url: hotel.bookingUrls?.booking },
    { label: 'Airbnb', url: hotel.bookingUrls?.airbnb },
  ].filter((b) => b.url),
  email: 'info@ns-hotel.ch',
  whatsapp: '+41 31 951 85 53',
};

const cr = bySlug('casa-reto');
const crFact = (label) => CR_FACTS.find((f) => f.label === label)?.value;
const crRule = (label) => CR_RULES.find((r) => r.label === label)?.value;
export const CASA_RETO = {
  name: 'Casa Reto',
  place: 'Gordemo (Gemeinde Gordola), Tessin, am Hang oberhalb von Tenero am Eingang zum Verzascatal',
  link: '/immobilien/casa-reto',
  inquiry: '/immobilien/casa-reto#anfrage',
  guests: crFact('Gäste'),
  bedrooms: crFact('Schlafzimmer'),
  beds: crFact('Betten'),
  baths: crFact('Duschbäder'),
  area: crFact('Wohnfläche'),
  rating: CR_RATING,
  checkIn: crRule('Check-in'),
  checkOut: crRule('Check-out'),
  pets: crRule('Haustiere'),
  smoking: crRule('Rauchen'),
  parties: crRule('Partys'),
  stairs: crRule('Treppen'),
  tax: crRule('Kurtaxe'),
  registration: CR_REGISTRATION,
  distances: CR_DISTANCES,
  amenities: CR_AMENITIES,
  faq: CR_FAQ,
  booking: [
    { label: 'Airbnb', url: cr.bookingUrls?.airbnb },
    { label: 'Booking.com', url: cr.bookingUrls?.booking },
  ].filter((b) => b.url),
  icalUrl: cr.icalUrl || null,
};

export const ARCH_SERVICES = [
  { title: 'Planung und Entwurf', link: '/leistungen/planung-entwurf', text: 'Entwurfs-, Genehmigungs- und Ausführungsplanung, von der ersten Skizze bis zum Baugesuch.' },
  { title: 'Neubauten', link: '/leistungen/neubauten', text: 'Wohnhäuser, Gewerbebauten und öffentliche Bauten.' },
  { title: 'Sanierungen und Umbauten', link: '/leistungen/sanierungen-umbauten', text: 'Modernisierung, energetische Sanierung und Umbauten bestehender Gebäude.' },
  { title: 'Projektbegleitung & Bauleitung', link: '/leistungen/projektbegleitung', text: 'Bauüberwachung, Qualitätskontrolle und Terminplanung.' },
];

export const PROPERTY_SERVICES = [
  { title: 'Kauf und Verkauf', link: '/leistungen/kauf-verkauf' },
  { title: 'Vermietung', link: '/leistungen/vermietung' },
  { title: 'Projektentwicklung', link: '/leistungen/projektentwicklung' },
  { title: 'Immobilienbewirtschaftung', link: '/leistungen/immobilienbewirtschaftung' },
];

export const PROJECTS = [
  { title: 'Höheweg 8, Muri bei Bern', kind: 'Umbau eines Bauernhauses zu Wohnungen', year: '2023', link: '/projekte/2' },
  { title: "N's Hotel, Allmendstrasse 14, Kerzers", kind: 'Hotel mit 36 Zimmern', year: '2024', link: '/projekte/1' },
  { title: 'Allmendstrasse 4–4A, Kerzers', kind: 'Wohnbau', year: '2024', link: '/projekte/3' },
  { title: 'Bären Kerzers', kind: 'Umbau mit Hotel und Restaurant, in Planung', year: 'laufend', link: '/projekte/4' },
  { title: 'Wohnhaus am Hang, Bremgarten bei Bern', kind: 'Neubau', year: '2026', link: '/projekte/5' },
];

export const PAGES = {
  immobilien: '/immobilien',
  longStay: '/immobilien/long-stay',
  shortStay: '/immobilien/short-stay',
  apartments: '/immobilien/apartments',
  verkauf: '/immobilien/verkauf',
  anfrage: '/immobilien/anfrage',
  termin: '/termin',
  kontakt: '/kontakt',
  architektur: '/architektur',
  leistungen: '/leistungen',
  projekte: '/projekte',
  ueberUns: '/uber-uns',
  team: '/team',
  karte: '/karte',
  hyporechner: '/hyporechner',
  preisrechner: '/preisrechner',
  storno: '/stornierung',
  agb: '/agb',
  datenschutz: '/datenschutz',
  faq: '/faq',
};

/** Every internal path the assistant may link to (the AI mode is told to use only these). */
export const ALLOWED_LINKS = [
  ...Object.values(PAGES),
  ...LONG_STAY.map((l) => l.link),
  HOTEL.link,
  CASA_RETO.link,
  CASA_RETO.inquiry,
  ...ARCH_SERVICES.map((s) => s.link),
  ...PROPERTY_SERVICES.map((s) => s.link),
  ...PROJECTS.map((p) => p.link),
];

const chf = (n) => `CHF ${Number(n).toLocaleString('de-CH')}`;
const roomLine = (r) => `${r.label}${r.size ? ` (${r.size} m²)` : ''}: ${r.from ? 'ab ' : ''}${chf(r.price)} pro Monat`;

/** The knowledge as German Markdown, used as reference text in the AI mode. */
export function knowledgeText() {
  return `# Hans Amonn AG – Fakten für den Website-Assistenten

## Unternehmen
- ${COMPANY.name}, ${COMPANY.address}, UID ${COMPANY.uid}. Familienunternehmen, gegründet ${COMPANY.founded} von Hans Amonn (gelernter Möbelschreiner und Architekt). Seit 1983 führt sein Sohn Reto Amonn das Unternehmen.
- Zwei Bereiche: AMONN ARCHITEKTUR (Planung und Bau in der Region Bern) und Immobilien (Vermietung, Hotel, Ferienhaus).
- Telefon ${COMPANY.phone}, E-Mail ${COMPANY.email}, WhatsApp +41 77 535 06 68.
- Büro: ${COMPANY.officeHours}. Telefon: ${COMPANY.phoneHours}. ${COMPANY.urgent}
- Team: ${PAGES.team}. Über uns: ${PAGES.ueberUns}. Kontaktformular: ${PAGES.kontakt}. Termin vereinbaren: ${PAGES.termin}.

## Long Stay (möblierte Zimmer ab einem Monat)
- Für Berufspendler, Monteure, Projektteams und Personen zwischen zwei Wohnungen. Mindestaufenthalt 1 Monat.
- Im Preis inbegriffen: ${LONG_STAY[0].includes.join(', ')}.
${LONG_STAY.map((l) => `- ${l.place} (${l.link})${l.address ? `, ${l.address}` : ''}: ${l.rooms.map(roomLine).join('; ')}${l.parking ? `; Parkplatz ${chf(l.parking)} pro Monat` : ''}${l.deposit ? `; Kaution ${chf(l.deposit)}` : ''}.`).join('\n')}
- Kautionen und Kündigungsfristen stehen im Mietvertrag (nur für Münchenbuchsee ist die Kaution von CHF 500 veröffentlicht).
- Verfügbarkeit prüfen wir persönlich: Online-Mietanfrage unter ${PAGES.anfrage}, oder anrufen. Besichtigung über ${PAGES.termin}.
- Übersicht: ${PAGES.longStay}.

## N's Hotel, Kerzers (${HOTEL.link})
- ${HOTEL.address}. Hotel mit ${HOTEL.rooms} Zimmern, geplant von AMONN ARCHITEKTUR (Ausführungspläne 2022, fertiggestellt 2024).
- Zimmer: ${HOTEL.roomTypes.join(', ')}. Ausstattung: ${HOTEL.features.join(', ')}. ${HOTEL.bern}.
- Preis ab CHF ${HOTEL.priceFrom} pro Zimmer und Nacht. ${HOTEL.tax}.
- Buchen: ${HOTEL.booking.map((b) => `${b.label} (${b.url})`).join(', ')}.
- Hotelkontakt: ${HOTEL.email}, WhatsApp ${HOTEL.whatsapp}.

## Casa Reto, Ferienhaus im Tessin (${CASA_RETO.link})
- ${CASA_RETO.place}. Nicht direkt am See; weiter Blick über den Lago Maggiore. Genaue Adresse erst mit der Buchungsbestätigung.
- ${CASA_RETO.guests} Gäste, ${CASA_RETO.bedrooms} Schlafzimmer, ${CASA_RETO.beds} Betten, ${CASA_RETO.baths} Duschbäder, ${CASA_RETO.area} Wohnfläche. Garten mit Pergola und Granittisch, Holzofen, Balkon.
- Bewertung: ${String(CASA_RETO.rating.score).replace('.', ',')} von 5 aus ${CASA_RETO.rating.count} Bewertungen auf ${CASA_RETO.rating.source}.
- Hausregeln: Check-in ${CASA_RETO.checkIn}; Check-out ${CASA_RETO.checkOut}; Haustiere ${CASA_RETO.pets}; Rauchen ${CASA_RETO.smoking}; ${CASA_RETO.parties}; ${CASA_RETO.stairs}; Kurtaxe ${CASA_RETO.tax}. Registrierung Kanton Tessin Nr. ${CASA_RETO.registration}.
- Ausstattung: ${CASA_RETO.amenities.map((g) => `${g.group}: ${g.items.join(', ')}`).join('. ')}.
- Fahrzeiten mit dem Auto: ${CASA_RETO.distances.map((d) => `${d.place} ${d.time}`).join(', ')}.
- Häufige Fragen: ${CASA_RETO.faq.map((f) => `${f.q} ${f.a}`).join(' ')}
- Preise je nach Saison und Aufenthaltsdauer, keine festen Preise veröffentlicht. Anfrage über das Formular (${CASA_RETO.inquiry}) oder Buchung über ${CASA_RETO.booking.map((b) => b.label).join(' und ')}.

## Wohnungen und Verkauf
- Mietwohnungen: zurzeit alle vermietet, Warteliste unter ${PAGES.apartments}.
- Kaufobjekte: zurzeit keine, Kontakt für Benachrichtigung unter ${PAGES.verkauf}.
- Rechner: Hypothekenrechner ${PAGES.hyporechner}, Mietpreis-Schätzung ${PAGES.preisrechner} (unverbindlich).

## AMONN ARCHITEKTUR
${ARCH_SERVICES.map((s) => `- ${s.title} (${s.link}): ${s.text}`).join('\n')}
- Weitere Leistungen: ${PROPERTY_SERVICES.map((s) => `${s.title} (${s.link})`).join(', ')}.
- Honorare nach Vertrag und Aufwand; ein erstes Gespräch vereinbaren Sie über ${PAGES.termin} oder telefonisch.
- 3D-Modelle direkt aus den Ausführungsplänen sind auf der Startseite und den Projektseiten zu sehen.
- Projekte: ${PROJECTS.map((p) => `${p.title} – ${p.kind}, ${p.year} (${p.link})`).join('; ')}. Alle Projekte: ${PAGES.projekte}.

## Bedingungen
- Buchungen über Airbnb, Booking.com oder my.ns-hotel.ch: Stornierung nach den Bedingungen der Plattform. Direkte Buchungen: nach der schriftlichen Offerte. Long Stay: nach Mietvertrag. Details: ${PAGES.storno}, AGB ${PAGES.agb}.
- Datenschutz: ${PAGES.datenschutz}.
`;
}
