import React from 'react';
import { Wifi, Car, Coffee, Tv, Bath, Bed, Building, Home, Wrench, UtensilsCrossed, ClipboardList } from 'lucide-react';

export const projectsData = [
  {
    id: 1,
    slug: 'ns-hotel-kerzers',
    title: "N's Hotel - Self-Check-in Hotel",
    category: 'hotel',
    location: 'Allmendstrasse 14, Kerzers',
    year: '2024',
    description: 'Modernes Self-Check-in Hotel in Kerzers, 22 km von Bern Hauptbahnhof entfernt. Das N\'s Hotel bietet komfortable Nichtraucher-Unterkünfte mit Garten, kostenlosem Privatparkplatz und Terrasse.',
    fullDescription: 'Die Unterkunft N\'s Hotel - Self-Check-in Hotel, die in Kerzers, 22 km von Bern Hauptbahnhof entfernt gelegen ist, verfügt über Übernachtungsmöglichkeiten mit einem Garten, einem kostenlosen Privatparkplatz und einer Terrasse. Dieses Hotel liegt ungefähr 22 km von Forum Fribourg entfernt, hat kostenloses WLAN und ist außerdem 23 km entfernt von Bundeshaus Bern. Die Nichtraucher Unterkunft ist 22 km von Universität Bern entfernt gelegen. In der Unterkunft N\'s Hotel - Self-Check-in Hotel sind alle Zimmer ergänzt mit einem Schreibtisch, einem Flachbild-TV, einem eigenen Badezimmer, Bettwäsche und Handtüchern. Die Zimmer bieten den Gästen einen Kleiderschrank und eine Kaffeemaschine.',
    coverImage: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/789e3a22506875ded08b7e607b8533d7.jpg',
    gallery: [
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/789e3a22506875ded08b7e607b8533d7.jpg', alt: "N's Hotel Kerzers - Luftaufnahme des modernen Self-Check-in Hotels" },
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/90d0677e87ffd9059ff0ffbfb247fafc.jpg', alt: "N's Hotel - Außenansicht bei Nacht" },
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/c46caabb241bdffde01aaf9b439da991.jpg', alt: "N's Hotel - Moderne Lobby mit Sitzbereich" },
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/04159834d4b569e52eba5ccd710cd17e.jpg', alt: "N's Hotel - Komfortable Hotelzimmer" },
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/499d39df2fc685fe8ddac41bb05f4f88.jpg', alt: "N's Hotel - Doppelzimmer mit Schreibtisch" },
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/c0ee6fbb9ae223f297dc68de1bb40f03.jpg', alt: "N's Hotel - Gemeinschaftsbereich" },
    ],
    features: ['Self-Check-in', 'Kostenloses WLAN', 'Kostenloser Parkplatz', 'Garten & Terrasse', 'Nichtraucher-Hotel'],
    amenities: [
      { icon: Wifi, label: 'Kostenloses WLAN' },
      { icon: Car, label: 'Kostenloser Parkplatz' },
      { icon: Coffee, label: 'Kaffeemaschine' },
      { icon: Tv, label: 'Flachbild-TV' },
      { icon: Bath, label: 'Eigenes Badezimmer' },
      { icon: Bed, label: 'Bettwäsche & Handtücher' }
    ],
    size: '4.500 m²',
    rooms: 'Moderne Zimmer',
    status: 'Fertiggestellt',
    owner: 'Hans Amonn AG',
    distances: [
      { location: 'Bern Hauptbahnhof', distance: '22 km' },
      { location: 'Forum Fribourg', distance: '22 km' },
      { location: 'Bundeshaus Bern', distance: '23 km' },
      { location: 'Universität Bern', distance: '22 km' }
    ]
  },
  {
    id: 2,
    slug: 'renovation-hoeheweg-muri',
    title: "Renovierung Höheweg 8",
    category: 'umbau',
    location: 'Höheweg 8, 3074 Muri bei Bern',
    year: '2023',
    description: 'Komplette Sanierung und Modernisierung eines historischen Fachwerkhauses in Muri bei Bern. Das Projekt umfasste die Erneuerung der Fassade, den Innenausbau und die energetische Optimierung.',
    fullDescription: 'Dieses Projekt zeigt die Transformation eines charmanten, aber in die Jahre gekommenen Fachwerkhauses in ein modernes und energieeffizientes Zuhause. Unter Berücksichtigung des ursprünglichen Charakters wurde die gesamte Bausubstanz saniert. Die Innenräume wurden neu gestaltet, um offene, lichtdurchflutete Wohnbereiche zu schaffen, während die Fassade sorgfältig restauriert wurde, um ihren historischen Wert zu bewahren.',
    coverImage: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/40ccd8d190aeb0a543c3ff4ab8cdf19d.jpg',
    gallery: [
      { type: 'compare', before: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/98fd9043d9ff6f43ab3f36930fb5b15b.jpg', after: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/40ccd8d190aeb0a543c3ff4ab8cdf19d.jpg', alt: 'Fassadenrenovierung Höheweg 8' },
      { type: 'header', title: 'Innenraum-Transformation' },
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/8e94f6bcbc6282010b27320f4693ad05.jpg', alt: 'Innenraum vor der Renovierung' },
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/c1e16198705215b19f5ab8644a07848e.jpg', alt: 'Moderner Innenraum nach der Renovierung' },
    ],
    features: ['Denkmalschutzauflagen', 'Energetische Sanierung', 'Kernsanierung', 'Moderner Innenausbau'],
    amenities: [
      { icon: Wrench, label: 'Komplettsanierung' },
      { icon: Home, label: 'Wohnhaus' },
      { icon: Building, label: 'Historisches Gebäude' },
    ],
    size: '320 m²',
    rooms: '6 Zimmer',
    status: 'Abgeschlossen',
    owner: 'Privat',
    distances: []
  },
  {
    id: 3,
    slug: 'wohnkomplex-allmendstrasse-kerzers',
    title: "Wohnkomplex Allmendstrasse 4-4A",
    category: 'wohnbau',
    location: 'Allmendstrasse 4-4A, Kerzers',
    year: '2024',
    description: 'Moderner Wohnkomplex mit hochwertigen Mietwohnungen in Kerzers. Das Projekt bietet grosszügige Grundrisse, moderne Ausstattung und eine hervorragende Anbindung.',
    fullDescription: 'Der Wohnkomplex an der Allmendstrasse 4-4A in Kerzers umfasst mehrere moderne Mehrfamilienhäuser mit einer Vielzahl von Mietwohnungen. Jede Wohnung ist auf Komfort und Lebensqualität ausgelegt, mit offenen Wohnbereichen, grossen Fenstern und privaten Aussenbereichen wie Balkonen oder Terrassen. Die nachhaltige Bauweise und die zentrale Lage machen es zu einem attraktiven Wohnort.',
    coverImage: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/3d1fb89de8fe0a9a5680ca4ecc5b8897.jpg',
    gallery: [
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/3d1fb89de8fe0a9a5680ca4ecc5b8897.jpg', alt: 'Luftaufnahme Wohnkomplex' },
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/359878cb4a2537c9113331778f12ae75.jpg', alt: 'Wohnzimmer mit Küche' },
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/7a58b1cdf61c9978d605ce5ac13d8444.jpg', alt: 'Terrasse mit Aussicht' },
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/a51beaa03a64488b44b71e4ddd1986e6.jpg', alt: 'Moderner Wohnbereich' },
    ],
    features: ['Moderne Architektur', 'Hochwertiger Ausbau', 'Zentrale Lage', 'Mietwohnungen'],
    amenities: [
      { icon: Home, label: 'Mietwohnungen' },
      { icon: Building, label: 'Neubau' },
      { icon: Car, label: 'Einstellhalle' },
    ],
    size: '3.200 m²',
    rooms: '24 Wohnungen',
    status: 'Fertiggestellt',
    owner: 'Hans Amonn AG',
    distances: []
  },
  {
    id: 4,
    slug: 'baeren-kerzers',
    title: "Bären Kerzers - Hotel & Restaurant",
    category: 'gewerbe',
    location: 'Kerzers, Schweiz',
    year: new Date().getFullYear().toString(),
    description: 'Umfassende Neugestaltung und Sanierung des historischen Hotel-Restaurants Bären in Kerzers. Ein Projekt, das Tradition ehrt und moderne Gastfreundschaft neu definiert.',
    fullDescription: 'Das Projekt "Bären Kerzers" ist eine ambitionierte Sanierung des traditionsreichen "Hotel de l\'Ours". Unser Ziel ist es, den historischen Charme des Gebäudes zu bewahren und es gleichzeitig in ein modernes Zentrum der Gastlichkeit zu verwandeln. Die Planung umfasst die vollständige Neugestaltung der Hotelzimmer, des Restaurants und der öffentlichen Bereiche, um ein unvergessliches Erlebnis für Gäste zu schaffen. Dieses Projekt befindet sich derzeit in der Planungs- und Entwicklungsphase.',
    coverImage: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/a505f564d9415d12a34fa3d685bbd058.jpg',
    gallery: [
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/a505f564d9415d12a34fa3d685bbd058.jpg', alt: 'Bären Kerzers - Frontansicht des historischen Gebäudes' },
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/fe297fbb5e380e78d726d6b65fa73785.jpg', alt: 'Bären Kerzers - Seitenansicht und Umgebung' },
      { type: 'image', url: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/82ab9fc9b84b376304fcb0e3a32a37eb.jpg', alt: 'Bären Kerzers - Charakteristische Dacharchitektur' },
    ],
    documents: [
      { type: 'pdf', title: 'Baupläne Erdgeschoss', description: 'Grundrisse und Schnitte für das neue Restaurantkonzept.', status: 'Verfügbar auf Anfrage' },
      { type: 'pdf', title: 'Visualisierungen Fassade', description: '3D-Renderings der geplanten Fassadenrenovierung.', status: 'In Erstellung' }
    ],
    features: ['Historische Bausubstanz', 'Neukonzeption Gastronomie', 'Moderne Hotelzimmer', 'Sanierung'],
    amenities: [
      { icon: UtensilsCrossed, label: 'Restaurant & Bar' },
      { icon: Bed, label: 'Hotelbetrieb' },
      { icon: Wrench, label: 'Kernsanierung' },
      { icon: ClipboardList, label: 'Projekt in Planung' }
    ],
    size: 'TBD',
    rooms: 'TBD',
    status: 'In Planung',
    owner: 'Hans Amonn AG',
    distances: []
  }
];

export const categories = [
  { id: 'alle', label: 'Alle Projekte' },
  { id: 'hotel', label: 'Hotel' },
  { id: 'gewerbe', label: 'Gewerbe & Gastronomie'},
  { id: 'wohnbau', label: 'Wohnungsbau' },
  { id: 'umbau', label: 'Umbau & Renovation' }
];