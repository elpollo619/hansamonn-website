// LocalStorage-based property store.
// Firebase-ready architecture: replace localStorage.getItem/setItem calls
// with Firestore reads/writes (getDoc, setDoc, collection) to migrate to Firebase.

const STORAGE_KEY = 'ha_properties';

// Known coordinates for default properties (used for migration when lat/lng is missing)
const COORDS_DEFAULTS = {
  'kerzers-ls':        { lat: 46.9949, lng: 7.1985 },
  'munchenbuchsee-ls': { lat: 47.0214, lng: 7.4484 },
  'muri-ls':           { lat: 46.9261, lng: 7.5039 },
  'ns-hotel':          { lat: 47.002,  lng: 7.199  },
  'casa-reto':         { lat: 46.0503, lng: 8.7026 },
};

const DEFAULT_PROPERTIES = [
  {
    id: 'kerzers-ls',
    name: 'Kerzers — Long Stay',
    type: 'long-stay',
    address: 'Kerzers, 3210',
    location: 'Kerzers, 3210',
    description: 'Möblierte Einzel- und Doppelzimmer im Herzen des Seelandes. Die Unterkunft in Kerzers eignet sich ideal für Mitarbeitende, Projektteams und alle, die eine flexible Wohnlösung für mehrere Monate suchen. Alle Nebenkosten (Strom, Wasser, Internet) sind inklusive. Ruhige Wohnlage mit guter Anbindung an die Agglomeration Bern.',
    status: 'verfügbar',
    priceFrom: 900,
    priceCurrency: 'CHF',
    pricePeriod: 'Mt.',
    images: [
      '/images/kerzers/titel.jpg',
      '/images/kerzers/01.jpg',
      '/images/kerzers/02.jpg',
      '/images/kerzers/03.jpg',
      '/images/kerzers/04.jpg',
      '/images/kerzers/05.jpg',
      '/images/kerzers/06.jpg',
      '/images/kerzers/07.jpg',
      '/images/kerzers/08.jpg',
    ],
    link: '/immobilien/kerzers-ls',
    bookingUrl: '',
    airbnbUrl: '',
    contactEmail: 'office@reto-amonn.ch',
    visible: true,
    features: ['Strom inkl.', 'Internet inkl.', 'Wasser inkl.', 'Möbliert', 'Parkplatz möglich', 'Ruhige Lage'],
    lat: 46.9949,
    lng: 7.1985,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'munchenbuchsee-ls',
    name: 'Münchenbuchsee — Long Stay',
    type: 'long-stay',
    address: 'Münchenbuchsee, 3053',
    location: 'Münchenbuchsee, 3053',
    description: 'Vollmöblierte Zimmer in ruhiger Lage mit ausgezeichneter Anbindung an Bern. Münchenbuchsee liegt direkt an der Bahnlinie Bern–Solothurn und ist ideal für Pendler und Projektmitarbeitende. Küche, Bad und Gemeinschaftsräume stehen zur Verfügung. Flexible Mietdauer ab einem Monat.',
    status: 'verfügbar',
    priceFrom: 750,
    priceCurrency: 'CHF',
    pricePeriod: 'Mt.',
    images: [
      '/images/muenchenbuchsee/titel.jpg',
      '/images/muenchenbuchsee/01.jpg',
      '/images/muenchenbuchsee/02.jpeg',
      '/images/muenchenbuchsee/03.jpg',
    ],
    link: '/immobilien/munchenbuchsee-ls',
    bookingUrl: '',
    airbnbUrl: '',
    contactEmail: 'office@reto-amonn.ch',
    visible: true,
    features: ['Möbliert', 'Gemeinschaftsküche', 'Parking möglich', 'ÖV-nah', 'Strom inkl.', 'Internet inkl.'],
    lat: 47.0214,
    lng: 7.4484,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'muri-ls',
    name: 'Muri bei Bern — Long Stay',
    type: 'long-stay',
    address: 'Blümlisalpstrasse 4, 3074 Muri bei Bern',
    location: 'Blümlisalpstrasse 4, 3074 Muri bei Bern',
    description: 'Komfortables Wohnen in der Agglomeration Bern. Unsere Unterkunft in Muri bei Bern eignet sich ideal für längere Aufenthalte, Mitarbeitende, Projektteams und alle, die eine hochwertige, flexible Wohnlösung in der Nähe von Bern suchen. Die ruhige Lage kombiniert mit guter Anbindung an die Stadt und den öffentlichen Verkehr macht diese Unterkunft besonders attraktiv.',
    status: 'verfügbar',
    priceFrom: 900,
    priceCurrency: 'CHF',
    pricePeriod: 'Mt.',
    images: [
      '/images/muri/titel.jpg',
      '/images/muri/01.jpg',
      '/images/muri/02.jpg',
      '/images/muri/03.jpeg',
      '/images/muri/04.jpeg',
      '/images/muri/05.jpeg',
      '/images/muri/06.jpeg',
    ],
    link: '/immobilien/muri-ls',
    bookingUrl: '',
    airbnbUrl: '',
    contactEmail: 'office@reto-amonn.ch',
    visible: true,
    features: ['Möbliert', 'Zentral gelegen', 'ÖV-nah', 'Strom inkl.', 'Internet inkl.', 'Ruhige Lage'],
    lat: 46.9261,
    lng: 7.5039,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'ns-hotel',
    name: "N's Hotel",
    type: 'short-stay',
    address: 'Kerzers, 3210',
    location: 'Kerzers, 3210',
    description: 'Modernes Boutique-Hotel mit Self Check-in.',
    status: 'verfügbar',
    priceFrom: null,
    priceCurrency: 'CHF',
    pricePeriod: 'Nacht',
    images: [
      '/images/ns-hotel/titel.jpg',
      '/images/ns-hotel/01.jpg',
      '/images/ns-hotel/02.jpg',
      '/images/ns-hotel/03.jpg',
      '/images/ns-hotel/04.jpg',
      '/images/ns-hotel/05.jpg',
      '/images/ns-hotel/06.jpg',
      '/images/ns-hotel/07.jpg',
      '/images/ns-hotel/08.jpg',
    ],
    link: '/ns-hotel',
    bookingUrl: 'https://my.ns-hotel.ch/search/offers?PROPERTY_IDS=NSH',
    airbnbUrl: 'https://www.airbnb.ch/rooms/1300557231274190252',
    contactEmail: 'office@reto-amonn.ch',
    visible: true,
    features: ['Self Check-in', 'Boutique', 'Geschäftsreisen'],
    lat: 47.002,
    lng: 7.199,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'casa-reto',
    name: 'Casa Reto',
    type: 'ferienhaus',
    address: 'Gordemo / Lago Maggiore, Tessin',
    location: 'Gordemo / Lago Maggiore, Tessin',
    description: 'Privates Ferienhaus am Lago Maggiore in Gordemo, Tessin. Das Casa Reto ist ein vollmöbliertes Ferienhaus in idyllischer Lage direkt am Ufer des Lago Maggiore. Ideal für Familien und Gruppen, die Natur, Ruhe und Sonne suchen. Mit eigenem Garten, Terrasse und direktem Seezugang. Buchungen sind direkt, über Airbnb oder Booking.com möglich.',
    status: 'verfügbar',
    priceFrom: null,
    priceCurrency: 'CHF',
    pricePeriod: 'Woche',
    images: [
      '/images/casa-reto/titel.jpg',
      '/images/casa-reto/01.jpg',
      '/images/casa-reto/02.jpg',
      '/images/casa-reto/03.jpg',
      '/images/casa-reto/04.jpg',
    ],
    link: '/immobilien/casa-reto',
    bookingUrl: '',
    airbnbUrl: 'https://www.airbnb.com',
    icalUrl: 'https://www.airbnb.ch/calendar/ical/625660996936132774.ics?t=82a02050ce864c73b599648976548358',
    contactEmail: 'office@reto-amonn.ch',
    visible: true,
    features: ['Lago Maggiore', 'Privater Garten', 'Naturlage'],
    lat: 46.0503,
    lng: 8.7026,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// ── Migration helpers ─────────────────────────────────────────────────────────
const LINK_MIGRATIONS = {
  '/long-stay/kerzers': '/immobilien/kerzers-ls',
  '/long-stay/munchenbuchsee': '/immobilien/munchenbuchsee-ls',
  '/long-stay/muri': '/immobilien/muri-ls',
  '/casa-reto': '/immobilien/casa-reto',
};

// For default properties: migrate images and icalUrl if stored data is outdated
const DEFAULT_BY_ID = Object.fromEntries(DEFAULT_PROPERTIES.map((p) => [p.id, p]));

function migrate(props) {
  return props.map((p, index) => {
    const def = DEFAULT_BY_ID[p.id];
    // Upgrade images if stored count is less than defaults (user hasn't customized them)
    const storedImages = Array.isArray(p.images) ? p.images : [];
    const defaultImages = def?.images ?? [];
    const images = storedImages.length < defaultImages.length ? defaultImages : storedImages;
    // Restore icalUrl from defaults if missing
    const icalUrl = p.icalUrl || def?.icalUrl || '';
    return {
      address: p.location || '',
      ...p,
      images,
      icalUrl,
      lat: p.lat ?? COORDS_DEFAULTS[p.id]?.lat ?? null,
      lng: p.lng ?? COORDS_DEFAULTS[p.id]?.lng ?? null,
      occupancy: p.occupancy || 'frei',
      sort_order: p.sort_order ?? index,
      beforeImage: p.beforeImage ?? '',
      afterImage: p.afterImage ?? '',
      link: LINK_MIGRATIONS[p.link] ?? p.link ?? '',
    };
  });
}

export function getProperties() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const withOrder = DEFAULT_PROPERTIES.map((p, i) => ({ ...p, sort_order: i }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(withOrder));
      return withOrder;
    }
    const parsed = JSON.parse(raw);
    const migrated = migrate(parsed);
    // Persist migration silently
    if (JSON.stringify(migrated) !== raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    }
    return [...migrated].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  } catch {
    return DEFAULT_PROPERTIES;
  }
}

export function saveProperties(properties) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
}

export function getVisibleProperties(type) {
  const all = getProperties();
  return all.filter((p) => p.visible && (type ? p.type === type : true));
}

export function createProperty(data) {
  const props = getProperties();
  const newProp = {
    address: data.location || '',
    lat: null,
    lng: null,
    ...data,
    id: `prop-${Date.now()}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  saveProperties([...props, newProp]);
  return newProp;
}

export function updateProperty(id, data) {
  const props = getProperties();
  const updated = props.map((p) =>
    p.id === id ? { ...p, ...data, updatedAt: Date.now() } : p
  );
  saveProperties(updated);
}

export function deleteProperty(id) {
  const props = getProperties();
  saveProperties(props.filter((p) => p.id !== id));
}

export function getPropertyById(id) {
  return getProperties().find((p) => p.id === id) ?? null;
}

export function savePropertyOrder(orderedIds) {
  const props = getProperties();
  const updated = props.map((p) => {
    const idx = orderedIds.indexOf(p.id);
    return { ...p, sort_order: idx === -1 ? props.length : idx };
  });
  updated.sort((a, b) => a.sort_order - b.sort_order);
  saveProperties(updated);
}

// ── Normalizer: maps propertiesStore format → VermietungPage ListingCard format ──
// type mapping: short-stay → hotel | ferienhaus → project | rest unchanged
const TYPE_MAP = { 'short-stay': 'hotel', ferienhaus: 'project' };

export function getNormalizedVisibleProperties() {
  return getVisibleProperties().map((p) => {
    const mappedType = TYPE_MAP[p.type] || p.type;
    const images = (Array.isArray(p.images) ? p.images : [])
      .filter(Boolean)
      .map((img) => (typeof img === 'string' ? { url: img, alt: p.name } : img));
    if (images.length === 0) images.push({ url: '', alt: p.name });

    return {
      ...p,
      title: p.name,
      subtitle: p.description || '',
      type: mappedType,
      price: p.priceFrom || null,
      images,
      features: Array.isArray(p.features) ? p.features : [],
      directBookingUrl: p.bookingUrl || '',
      bookingUrls: {
        booking: p.bookingUrl || '',
        airbnb: p.airbnbUrl || '',
      },
      icalUrl: p.icalUrl || '',
      videoUrl: p.videoUrl || '',
      tourUrl: p.tourUrl || '',
      link: p.link || `/immobilien/${p.id}`,
      occupancy: p.occupancy || 'frei',
    };
  });
}
