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
    description: 'Möblierte Zimmer im Herzen des Seelandes.',
    status: 'verfügbar',
    priceFrom: 900,
    priceCurrency: 'CHF',
    pricePeriod: 'Mt.',
    images: ['/images/kerzers/titel.jpg'],
    link: '/long-stay/kerzers',
    bookingUrl: '',
    airbnbUrl: '',
    contactEmail: 'office@reto-amonn.ch',
    visible: true,
    features: ['Strom inkl.', 'Internet inkl.', 'Wasser inkl.'],
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
    description: 'Ruhige Lage, gute Anbindung an Bern.',
    status: 'verfügbar',
    priceFrom: 750,
    priceCurrency: 'CHF',
    pricePeriod: 'Mt.',
    images: ['/images/muenchenbuchsee/titel.jpg'],
    link: '/long-stay/munchenbuchsee',
    bookingUrl: '',
    airbnbUrl: '',
    contactEmail: 'office@reto-amonn.ch',
    visible: true,
    features: ['Möbliert', 'Gemeinschaftsküche', 'Parking möglich'],
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
    description: 'Komfortables Wohnen in der Agglomeration Bern.',
    status: 'verfügbar',
    priceFrom: 900,
    priceCurrency: 'CHF',
    pricePeriod: 'Mt.',
    images: ['/images/muri/titel.jpg'],
    link: '/long-stay/muri',
    bookingUrl: '',
    airbnbUrl: '',
    contactEmail: 'office@reto-amonn.ch',
    visible: true,
    features: ['Möbliert', 'Zentral gelegen', 'ÖV-nah'],
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
    images: ['/images/ns-hotel/titel.jpg'],
    link: '/ns-hotel',
    bookingUrl: 'https://my.ns-hotel.ch/search/offers?PROPERTY_IDS=NSH',
    airbnbUrl: 'https://www.airbnb.com',
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
    description: 'Privates Ferienhaus am Lago Maggiore.',
    status: 'verfügbar',
    priceFrom: null,
    priceCurrency: 'CHF',
    pricePeriod: 'Woche',
    images: ['/images/casa-reto/titel.jpg'],
    link: '/casa-reto',
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

// ── Migration: add lat/lng/address/occupancy/sort_order to existing stored properties ──
function migrate(props) {
  return props.map((p, index) => ({
    address: p.location || '',
    ...p,
    lat: p.lat ?? COORDS_DEFAULTS[p.id]?.lat ?? null,
    lng: p.lng ?? COORDS_DEFAULTS[p.id]?.lng ?? null,
    occupancy: p.occupancy || 'frei',
    sort_order: p.sort_order ?? index,
  }));
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
