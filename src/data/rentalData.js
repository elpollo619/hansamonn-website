/**
 * rentalData.js — Hans Amonn AG · Complete rental & stay data
 *
 * TYPES:
 *   'apartment'  → classic rental          (currently hidden – no availability)
 *   'long-stay'  → furnished / temp stay   CTA: Verfügbarkeit anfragen
 *   'hotel'      → short stay              CTA: 3 booking buttons (direct PRIMARY)
 *   'project'    → Casa Reto               CTA: Anfragen (email)
 *
 * STATUS:  'available' | 'rented' | 'hidden'
 *
 * ── IMAGES ───────────────────────────────────────────────────────────────────
 *  All images live in /public/images/{category}/
 *  Naming: titel.jpg (hero), 01.jpg, 02.jpg, …
 *  Recommended: JPG or WebP, 1600px wide, max 300 KB each
 *
 *    /public/images/ns-hotel/         titel.jpg + 01–08.jpg
 *    /public/images/kerzers/          titel.jpg + 01–08.jpg
 *    /public/images/muenchenbuchsee/  titel.jpg + 01–03.jpg
 *    /public/images/muri/             titel.jpg + 01–06.jpg
 *    /public/images/casa-reto/        titel.jpg + 01–04.jpg
 *
 * ── HOW TO MANAGE ────────────────────────────────────────────────────────────
 *  Show apartments:      set status: 'available' (IDs 1–6)
 *  Hide completely:      set status: 'hidden'
 *  Update hotel links:   find id: 8 → directBookingUrl / bookingUrls
 *  Update Long Stay prices: find by slug → longStayRooms[]
 */

export const rentalData = [

  // ─── WOHNUNGEN (hidden – no availability right now) ──────────────────────────

  {
    id: 1,
    slug: 'allmendstrasse-4-eg-links',
    type: 'apartment',
    status: 'hidden',
    title: '2.5-Zimmer-Wohnung',
    subtitle: 'Erdgeschoss mit Gartenanteil',
    location: 'Allmendstrasse 4, 3210 Kerzers',
    floor: 'Erdgeschoss links',
    floorNumber: 0,
    price: 1450,
    priceLabel: 'pro Monat',
    currency: 'CHF',
    size: 56,
    rooms: 2.5,
    availableFrom: null,
    furnished: false,
    minimumStay: null,
    directBookingUrl: null,
    bookingUrls: null,
    description: 'Helle 2.5-Zimmer-Wohnung im Erdgeschoss mit direktem Zugang zum gemeinschaftlichen Garten.',
    images: [{ url: '/images/apartments/placeholder.jpg', alt: '2.5-Zimmer-Wohnung' }],
    features: ['Einbauküche', 'Gartenanteil', 'Kellerabteil', 'Aussenstellplatz'],
    details: { heating: 'Zentralheizung (Gas)', parking: 'Aussenstellplatz inklusive', buildYear: '2024', energyClass: 'A' },
    contact: { phone: '+41 (0)31 951 85 54', email: 'office@reto-amonn.ch' },
  },
  {
    id: 2,
    slug: 'allmendstrasse-4-eg-rechts',
    type: 'apartment',
    status: 'hidden',
    title: '3.5-Zimmer-Wohnung',
    subtitle: 'Erdgeschoss mit Privatterrasse',
    location: 'Allmendstrasse 4, 3210 Kerzers',
    floor: 'Erdgeschoss rechts',
    floorNumber: 0,
    price: 1780,
    priceLabel: 'pro Monat',
    currency: 'CHF',
    size: 77,
    rooms: 3.5,
    availableFrom: null,
    furnished: false,
    minimumStay: null,
    directBookingUrl: null,
    bookingUrls: null,
    description: 'Geräumige 3.5-Zimmer-Wohnung mit Privatterrasse.',
    images: [{ url: '/images/apartments/placeholder.jpg', alt: '3.5-Zimmer-Wohnung' }],
    features: ['Einbauküche', 'Privatterrasse', 'Tiefgaragenplatz'],
    details: { heating: 'Zentralheizung (Gas)', parking: 'Tiefgaragenplatz inklusive', buildYear: '2024', energyClass: 'A' },
    contact: { phone: '+41 (0)31 951 85 54', email: 'office@reto-amonn.ch' },
  },
  {
    id: 3,
    slug: 'allmendstrasse-4-1og-links',
    type: 'apartment',
    status: 'hidden',
    title: '3.5-Zimmer-Wohnung',
    subtitle: '1. Obergeschoss mit Südbalkon',
    location: 'Allmendstrasse 4, 3210 Kerzers',
    floor: '1. Obergeschoss links',
    floorNumber: 1,
    price: 1850,
    priceLabel: 'pro Monat',
    currency: 'CHF',
    size: 78,
    rooms: 3.5,
    availableFrom: null,
    furnished: false,
    minimumStay: null,
    directBookingUrl: null,
    bookingUrls: null,
    description: 'Moderne 3.5-Zimmer-Wohnung mit grossem Südbalkon.',
    images: [{ url: '/images/apartments/placeholder.jpg', alt: '3.5-Zimmer-Wohnung' }],
    features: ['Einbauküche', 'Südbalkon', 'Tiefgaragenplatz'],
    details: { heating: 'Zentralheizung (Gas)', parking: 'Tiefgaragenplatz inklusive', buildYear: '2024', energyClass: 'A' },
    contact: { phone: '+41 (0)31 951 85 54', email: 'office@reto-amonn.ch' },
  },
  {
    id: 4,
    slug: 'allmendstrasse-4-1og-rechts',
    type: 'apartment',
    status: 'hidden',
    title: '4.5-Zimmer-Wohnung',
    subtitle: 'Familienwohnung mit 2 Balkonen',
    location: 'Allmendstrasse 4, 3210 Kerzers',
    floor: '1. Obergeschoss rechts',
    floorNumber: 1,
    price: 2200,
    priceLabel: 'pro Monat',
    currency: 'CHF',
    size: 96,
    rooms: 4.5,
    availableFrom: null,
    furnished: false,
    minimumStay: null,
    directBookingUrl: null,
    bookingUrls: null,
    description: 'Grosszügige 4.5-Zimmer-Familienwohnung mit zwei Balkonen.',
    images: [{ url: '/images/apartments/placeholder.jpg', alt: '4.5-Zimmer-Wohnung' }],
    features: ['Einbauküche', '2 Balkone', 'Tiefgaragenplatz'],
    details: { heating: 'Zentralheizung (Gas)', parking: 'Tiefgaragenplatz inklusive', buildYear: '2024', energyClass: 'A' },
    contact: { phone: '+41 (0)31 951 85 54', email: 'office@reto-amonn.ch' },
  },
  {
    id: 5,
    slug: 'allmendstrasse-4a-2og-links',
    type: 'apartment',
    status: 'hidden',
    title: '3.5-Zimmer-Wohnung',
    subtitle: '2. Obergeschoss mit schöner Aussicht',
    location: 'Allmendstrasse 4A, 3210 Kerzers',
    floor: '2. Obergeschoss links',
    floorNumber: 2,
    price: 1900,
    priceLabel: 'pro Monat',
    currency: 'CHF',
    size: 79,
    rooms: 3.5,
    availableFrom: null,
    furnished: false,
    minimumStay: null,
    directBookingUrl: null,
    bookingUrls: null,
    description: 'Helle 3.5-Zimmer-Wohnung im zweiten Obergeschoss.',
    images: [{ url: '/images/apartments/placeholder.jpg', alt: '3.5-Zimmer-Wohnung' }],
    features: ['Einbauküche', 'Balkon', 'Tiefgaragenplatz'],
    details: { heating: 'Zentralheizung (Gas)', parking: 'Tiefgaragenplatz inklusive', buildYear: '2024', energyClass: 'A' },
    contact: { phone: '+41 (0)31 951 85 54', email: 'office@reto-amonn.ch' },
  },
  {
    id: 6,
    slug: 'allmendstrasse-4a-2og-rechts',
    type: 'apartment',
    status: 'hidden',
    title: '4.5-Zimmer-Wohnung',
    subtitle: 'Dachwohnung mit Panoramablick',
    location: 'Allmendstrasse 4A, 3210 Kerzers',
    floor: '2. Obergeschoss rechts',
    floorNumber: 2,
    price: 2350,
    priceLabel: 'pro Monat',
    currency: 'CHF',
    size: 99,
    rooms: 4.5,
    availableFrom: null,
    furnished: false,
    minimumStay: null,
    directBookingUrl: null,
    bookingUrls: null,
    description: 'Exklusive 4.5-Zimmer-Dachwohnung mit Panoramablick.',
    images: [{ url: '/images/apartments/placeholder.jpg', alt: '4.5-Zimmer-Wohnung' }],
    features: ['Inselküche', 'Dachterrasse', 'Panoramablick'],
    details: { heating: 'Zentralheizung (Gas)', parking: 'Tiefgaragenplatz inklusive', buildYear: '2024', energyClass: 'A+' },
    contact: { phone: '+41 (0)31 951 85 54', email: 'office@reto-amonn.ch' },
  },

  // ─── LONG STAY – MÜNCHENBUCHSEE ──────────────────────────────────────────────

  {
    id: 7,
    slug: 'long-stay-munchenbuchsee',
    type: 'long-stay',
    title: 'Long Stay – Münchenbuchsee',
    subtitle: 'Möblierte Zimmer · Vollinklusivpauschale · ab 1 Monat',
    location: 'Münchenbuchsee, BE',
    address: 'Münchenbuchsee, BE',
    floor: null,
    floorNumber: null,
    price: 750,
    priceLabel: 'ab / Monat',
    currency: 'CHF',
    size: null,
    rooms: null,
    status: 'available',
    availableFrom: null,
    furnished: true,
    minimumStay: '1 Monat',
    directBookingUrl: null,
    bookingUrls: null,
    longStayRooms: [
      { label: 'Einzelzimmer', size: null, price: 750, isFrom: true },
      { label: 'Doppelzimmer', size: null, price: 1250, isFrom: true },
    ],
    deposit: 500,
    includes: ['Strom', 'Internet', 'Wasser', 'Reinigung 1× Woche'],
    description:
      'Vollmöblierte Zimmer in Münchenbuchsee, ideal für Berufspendler, Saisonniers und Personen im Übergang. Alles inklusive – Strom, Internet, Wasser, wöchentliche Reinigung. Kaution CHF 500. Direkte Zugverbindung nach Bern.',
    images: [
      { url: '/images/muenchenbuchsee/titel.jpg', alt: 'Long Stay Münchenbuchsee' },
      { url: '/images/muenchenbuchsee/01.jpg',    alt: 'Zimmer Münchenbuchsee' },
      { url: '/images/muenchenbuchsee/02.jpeg',   alt: 'Ausstattung' },
      { url: '/images/muenchenbuchsee/03.jpg',    alt: 'Badezimmer' },
    ],
    features: ['Vollmöbliert', 'WLAN inklusive', 'Strom & Wasser inklusive', 'Wöchentliche Reinigung', 'Kaution CHF 500', 'Bahnanbindung Bern'],
    details: { heating: 'Zentralheizung', parking: 'Nach Verfügbarkeit' },
    contact: { phone: '+41 (0)31 951 85 54', email: 'office@reto-amonn.ch' },
  },

  // ─── N'S HOTEL (Short Stay) ───────────────────────────────────────────────────

  {
    id: 8,
    slug: 'ns-hotel-kerzers',
    type: 'hotel',
    title: "N's Hotel – Self-Check-in",
    subtitle: 'Modernes Boutique-Hotel · Kerzers · ab CHF 89 / Nacht',
    location: 'Allmendstrasse 14, 3210 Kerzers',
    floor: null,
    floorNumber: null,
    price: 89,
    priceLabel: 'pro Nacht',
    currency: 'CHF',
    size: null,
    rooms: null,
    status: 'available',
    availableFrom: null,
    furnished: true,
    minimumStay: '1 Nacht',
    // ── UPDATE THESE LINKS WHEN NEEDED ───────────────────────────────────────
    directBookingUrl: 'https://my.ns-hotel.ch/search/offers?PROPERTY_IDS=NSH',
    bookingUrls: {
      booking: 'https://www.booking.com/Share-BhDPswK',
      airbnb:  'https://www.airbnb.de/rooms/1304231541994157069?guests=1&adults=1&s=67&unique_share_id=c4149650-fe90-4a08-b84d-f0abe819e638',
    },
    description:
      "Modernes Self-Check-in Boutique-Hotel in Kerzers, 22 km von Bern Hauptbahnhof entfernt. Komfortable Nichtraucher-Zimmer mit privatem Garten, kostenlosem Parkplatz und Terrasse. Jedes Zimmer verfügt über Flachbild-TV, Kaffeemaschine und eigenes Badezimmer.",
    images: [
      { url: '/images/ns-hotel/titel.jpg', alt: "N's Hotel Kerzers – Hauptbild" },
      { url: '/images/ns-hotel/01.jpg',    alt: "N's Hotel – Aussenansicht" },
      { url: '/images/ns-hotel/02.jpg',    alt: 'Zimmer' },
      { url: '/images/ns-hotel/03.jpg',    alt: 'Lobby' },
      { url: '/images/ns-hotel/04.jpg',    alt: 'Hotelzimmer' },
      { url: '/images/ns-hotel/05.jpg',    alt: 'Doppelzimmer' },
      { url: '/images/ns-hotel/06.jpg',    alt: 'Gemeinschaftsbereich' },
      { url: '/images/ns-hotel/07.jpg',    alt: 'Garten' },
      { url: '/images/ns-hotel/08.jpg',    alt: 'Details' },
    ],
    features: ['Self-Check-in', 'Kostenloses WLAN', 'Kostenloser Parkplatz', 'Garten & Terrasse', 'Kaffeemaschine', 'Flachbild-TV', 'Eigenes Badezimmer', 'Nichtraucher'],
    details: { heating: 'Zentralheizung', parking: 'Kostenloser Privatparkplatz', buildYear: '2024', energyClass: 'A' },
    contact: { phone: '+41 (0)31 951 85 54', email: 'office@reto-amonn.ch' },
  },

  // ─── CASA RETO (Holiday House – Tessin) ──────────────────────────────────────

  {
    id: 9,
    slug: 'casa-reto',
    type: 'project',
    holidayHome: true,
    title: 'Casa Reto',
    subtitle: 'Ferienhaus im Tessin – Natur, Garten & Aussicht auf den Lago Maggiore',
    location: 'Gordemo / Lago Maggiore, Tessin',
    floor: null,
    floorNumber: null,
    price: null,
    priceLabel: 'auf Anfrage',
    currency: 'CHF',
    size: null,
    rooms: null,
    status: 'available',
    availableFrom: null,
    furnished: true,
    minimumStay: null,
    directBookingUrl: null,
    bookingUrls: null,
    description:
      'Traumhaftes Ferienhaus in Gordemo am Lago Maggiore im Tessin. Casa Reto verbindet tessiner Architektur mit modernem Komfort: mehrere Schlafzimmer, grosser Garten mit unverbautem Seeblick, ruhige Lage inmitten der Natur. Ideal für Familien und Gruppen.',
    images: [
      { url: '/images/casa-reto/titel.jpg', alt: 'Casa Reto – Hauptbild' },
      { url: '/images/casa-reto/01.jpg',    alt: 'Casa Reto – Aussenansicht' },
      { url: '/images/casa-reto/02.jpg',    alt: 'Garten mit Seeblick' },
      { url: '/images/casa-reto/03.jpg',    alt: 'Innenbereich' },
      { url: '/images/casa-reto/04.jpg',    alt: 'Schlafzimmer' },
    ],
    features: [
      'Garten mit Seeblick', 'Mehrere Schlafzimmer', 'Tessin / Lago Maggiore',
      'Familienfreundlich', 'Vollmöbliert', 'Ruhige Lage',
    ],
    details: { parking: 'Vorhanden', pets: 'Nach Absprache' },
    contact: { phone: '+41 (0)31 951 85 54', email: 'office@reto-amonn.ch' },
  },

  // ─── LONG STAY – KERZERS ─────────────────────────────────────────────────────

  {
    id: 10,
    slug: 'long-stay-kerzers',
    type: 'long-stay',
    title: 'Long Stay – Kerzers',
    subtitle: 'Möblierte Zimmer · zentral in Kerzers · ab 1 Monat',
    location: 'Kerzers, FR',
    address: 'Kerzers, FR',
    floor: null,
    floorNumber: null,
    price: 900,
    priceLabel: 'ab / Monat',
    currency: 'CHF',
    size: null,
    rooms: null,
    status: 'available',
    availableFrom: null,
    furnished: true,
    minimumStay: '1 Monat',
    directBookingUrl: null,
    bookingUrls: null,
    longStayRooms: [
      { label: 'Einzelzimmer', size: 12, price: 900,  isFrom: false },
      { label: 'Einzelzimmer', size: 14, price: 950,  isFrom: false },
      { label: 'Doppelzimmer', size: null, price: 1150, isFrom: false },
      { label: 'Parkplatz',    size: null, price: 110,  isFrom: false, isAddon: true },
    ],
    deposit: null,
    includes: ['Strom', 'Internet', 'Wasser', 'Reinigung 1× Woche'],
    description:
      'Vollmöblierte Einzel- und Doppelzimmer im Zentrum von Kerzers. Ideal für Berufspendler, Monteure und Personen im Übergang. Alle Nebenkosten inklusive. Parkplatz optional buchbar (CHF 110 / Monat).',
    images: [
      { url: '/images/kerzers/titel.jpg', alt: 'Long Stay Kerzers – Hauptbild' },
      { url: '/images/kerzers/01.jpg',    alt: 'Einzelzimmer' },
      { url: '/images/kerzers/02.jpg',    alt: 'Zimmerausstattung' },
      { url: '/images/kerzers/03.jpg',    alt: 'Küche' },
      { url: '/images/kerzers/04.jpg',    alt: 'Badezimmer' },
      { url: '/images/kerzers/05.jpg',    alt: 'Gemeinschaftsbereich' },
      { url: '/images/kerzers/06.jpg',    alt: 'Aussenbereich' },
      { url: '/images/kerzers/07.jpg',    alt: 'Detail' },
      { url: '/images/kerzers/08.jpg',    alt: 'Weiteres Zimmer' },
    ],
    features: ['Vollmöbliert', 'WLAN inklusive', 'Strom & Wasser inklusive', 'Wöchentliche Reinigung', 'Parkplatz optional', 'Zentral in Kerzers'],
    details: { heating: 'Zentralheizung', parking: 'Optional (CHF 110 / Monat)' },
    contact: { phone: '+41 (0)31 951 85 54', email: 'office@reto-amonn.ch' },
  },

  // ─── LONG STAY – MURI BEI BERN ───────────────────────────────────────────────

  {
    id: 11,
    slug: 'long-stay-muri',
    type: 'long-stay',
    title: 'Long Stay – Muri bei Bern',
    subtitle: 'Möblierte Zimmer · zentral gelegen · ab 1 Monat',
    location: 'Muri bei Bern, BE',
    address: 'Blümlisalpstrasse 4, 3074 Muri bei Bern',
    floor: null,
    floorNumber: null,
    price: 900,
    priceLabel: 'ab / Monat',
    currency: 'CHF',
    size: null,
    rooms: null,
    status: 'available',
    availableFrom: null,
    furnished: true,
    minimumStay: '1 Monat',
    directBookingUrl: null,
    bookingUrls: null,
    longStayRooms: [
      // ── UPDATE PRICES AS NEEDED ─────────────────────────────────────────────
      { label: 'Einzelzimmer', size: null, price: 900,  isFrom: true },
      { label: 'Doppelzimmer', size: null, price: 1250, isFrom: true },
    ],
    deposit: null,
    includes: ['Strom', 'Internet', 'Wasser', 'Reinigung 1× Woche'],
    description:
      'Vollmöblierte Zimmer an der Blümlisalpstrasse 4 in Muri bei Bern. Zentral gelegen mit guter Anbindung nach Bern. Ideal für Berufspendler, Monteure und Personen im Übergang. Alles inklusive: Strom, Internet, Wasser und wöchentliche Reinigung.',
    images: [
      { url: '/images/muri/titel.jpg',  alt: 'Long Stay Muri bei Bern – Hauptbild' },
      { url: '/images/muri/01.jpg',     alt: 'Zimmer Muri' },
      { url: '/images/muri/02.jpg',     alt: 'Ausstattung' },
      { url: '/images/muri/03.jpeg',    alt: 'Wohnbereich' },
      { url: '/images/muri/04.jpeg',    alt: 'Küche' },
      { url: '/images/muri/05.jpeg',    alt: 'Badezimmer' },
      { url: '/images/muri/06.jpeg',    alt: 'Aussenansicht' },
    ],
    features: ['Vollmöbliert', 'WLAN inklusive', 'Strom & Wasser inklusive', 'Wöchentliche Reinigung', 'Zentral in Muri', 'Nähe Bern'],
    details: { heating: 'Zentralheizung', parking: 'Nach Verfügbarkeit' },
    contact: { phone: '+41 (0)31 951 85 54', email: 'office@reto-amonn.ch' },
  },

];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** All visible listings (excludes status: 'hidden') */
export const getVisibleListings = () =>
  rentalData.filter((a) => a.status !== 'hidden');

/** Only available listings */
export const getAvailableListings = () =>
  rentalData.filter((a) => a.status === 'available');

/** Find a listing by slug */
export const getListingBySlug = (slug) =>
  rentalData.find((a) => a.slug === slug);

/** Visible listings filtered by type */
export const getByType = (type) =>
  rentalData.filter((a) => a.type === type && a.status !== 'hidden');

/**
 * Options for the Mietanfrage form dropdown.
 * Returns ONLY active long-stay locations and Casa Reto.
 * (Apartments excluded – no availability currently.)
 */
export const getMietanfrageOptions = () => [
  { value: 'long-stay-muri',           label: 'Long Stay – Muri bei Bern',    group: 'Long Stay' },
  { value: 'long-stay-kerzers',        label: 'Long Stay – Kerzers',           group: 'Long Stay' },
  { value: 'long-stay-munchenbuchsee', label: 'Long Stay – Münchenbuchsee',   group: 'Long Stay' },
  { value: 'casa-reto',                label: 'Casa Reto – Ferienhaus Tessin', group: 'Ferien' },
];

/** @deprecated Use getMietanfrageOptions */
export const getApartmentOptions = getMietanfrageOptions;
