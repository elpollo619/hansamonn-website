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
    coverImage: '/images/ns-hotel/aussen.jpg',
    gallery: [
      { type: 'image', url: '/images/ns-hotel/drohne-1.jpg', alt: "N's Hotel Kerzers – Luftaufnahme" },
      { type: 'image', url: '/images/ns-hotel/aussen.jpg', alt: "N's Hotel – Aussenansicht" },
      { type: 'image', url: '/images/ns-hotel/lounge.jpg', alt: "N's Hotel – Lounge" },
      { type: 'image', url: '/images/ns-hotel/zimmer-hell.jpg', alt: "N's Hotel – Hotelzimmer" },
      { type: 'image', url: '/images/ns-hotel/doppelzimmer.jpg', alt: "N's Hotel – Doppelzimmer" },
      { type: 'image', url: '/images/ns-hotel/lounge-kueche.jpg', alt: "N's Hotel – Gemeinschaftsküche" },
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
    coverImage: '/images/projekte/hoeheweg-3d.jpg',
    gallery: [{ type: 'image', url: '/images/projekte/hoeheweg-3d.jpg', alt: '3D-Modell aus den Fassadenplänen 1:100 (Aussenansicht)' }],
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
    coverImage: '/images/projekte/a4-gesamt.jpg',
    gallery: [
      { type: 'image', url: '/images/projekte/a4-gesamt.jpg', alt: '3D-Modell aus den Ausführungsplänen, mit Umgebung' },
      { type: 'image', url: '/images/projekte/a4-explosion.jpg', alt: '3D-Modell – Geschosse in der Explosionsansicht' },
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
    coverImage: '/images/projekte/baeren-3d.jpg',
    gallery: [{ type: 'image', url: '/images/projekte/baeren-3d.jpg', alt: '3D-Modell aus dem Umbauprojekt 754, mit Umgebung' }],
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
  },
  {
    id: 5,
    slug: 'neubau-wohnhaus-bremgarten',
    title: 'Neubau Wohnhaus am Hang',
    category: 'wohnbau',
    location: 'Bremgarten bei Bern',
    year: '2026',
    description: 'Neubau eines Wohnhauses in steiler Hanglage: Eingang über einen Liftturm direkt von der Strasse, Wohnen unter dem Satteldach mit Lukarnen und Balkon, Schlafräume und Gartengeschoss darunter.',
    fullDescription: 'Das Wohnhaus gräbt sich in den Hang: Von der Strasse aus erscheint nur das Dach, während sich das Haus zum Garten hin über drei Geschosse öffnet. Ein Liftturm verbindet Carport und Strasse mit allen Ebenen. Zuoberst liegt der Wohn- und Essbereich unter dem 45°-Satteldach, belichtet durch drei Lukarnen und einen Balkon; darunter die Schlafräume, zuunterst das Gartengeschoss mit grossen Festverglasungen. Hinter dem Haus sorgt ein durchgehender Lichtschacht für Tageslicht im erdberührten Teil. Die Ausführungsplanung läuft, der Bau ist 2026 gestartet.',
    coverImage: '/images/projekte/bremgarten-3d.jpg',
    gallery: [{ type: 'image', url: '/images/projekte/bremgarten-3d.jpg', alt: '3D-Modell aus den Ausführungsplänen, mit Umgebung (Aare, Gelände swissALTI3D)' }],
    features: ['Hanglage', 'Liftturm mit Zugang von der Strasse', 'Satteldach mit Lukarnen', 'Lichtschacht'],
    amenities: [
      { icon: Home, label: 'Einfamilienhaus' },
      { icon: Building, label: 'Neubau' },
      { icon: Car, label: 'Carport' },
      { icon: ClipboardList, label: 'In Ausführung' }
    ],
    size: '17.75 × 8.67 m',
    rooms: 'Level 0–2 + Galerie',
    status: 'In Ausführung',
    owner: 'Privat',
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