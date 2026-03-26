// LocalStorage-based property store.
// Firebase-ready architecture: replace localStorage.getItem/setItem calls
// with Firestore reads/writes (getDoc, setDoc, collection) to migrate to Firebase.

const STORAGE_KEY = 'ha_properties';

const DEFAULT_PROPERTIES = [
  {
    id: 'kerzers-ls',
    name: 'Kerzers — Long Stay',
    type: 'long-stay',
    location: 'Kerzers, 3210',
    description: 'Möblierte Zimmer im Herzen des Seelandes.',
    status: 'verfügbar', // 'verfügbar' | 'nicht-verfügbar' | 'coming-soon'
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
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'munchenbuchsee-ls',
    name: 'Münchenbuchsee — Long Stay',
    type: 'long-stay',
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
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'muri-ls',
    name: 'Muri bei Bern — Long Stay',
    type: 'long-stay',
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
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'ns-hotel',
    name: "N's Hotel",
    type: 'short-stay',
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
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'casa-reto',
    name: 'Casa Reto',
    type: 'ferienhaus',
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
    contactEmail: 'office@reto-amonn.ch',
    visible: true,
    features: ['Lago Maggiore', 'Privater Garten', 'Naturlage'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export function getProperties() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROPERTIES));
      return DEFAULT_PROPERTIES;
    }
    return JSON.parse(raw);
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
