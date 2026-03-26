import { Building2, PenTool, Cog, Users, Key, Home, TrendingUp, Shield } from 'lucide-react';

export const servicesData = [
  // ── Architecture ────────────────────────────────────────────────
  {
    slug: 'planung-entwurf',
    category: 'architektur',
    icon: PenTool,
    title: 'Planung und Entwurf',
    shortDescription:
      'Jede erfolgreiche Baugeschichte beginnt mit einer klaren Vision. Gemeinsam entwickeln wir kreative und maßgeschneiderte Konzepte, die genau auf Ihre Anforderungen abgestimmt sind.',
    fullDescription:
      'Von der ersten Skizze bis zur baureifen Ausführungsplanung begleiten wir Sie durch sämtliche Phasen der Planung. Unser erfahrenes Team analysiert Ihre Bedürfnisse, berücksichtigt behördliche Vorgaben und entwickelt Konzepte, die Ästhetik, Funktion und Wirtschaftlichkeit in Einklang bringen. Dabei legen wir grossen Wert auf offene Kommunikation und enge Abstimmung mit Ihnen als Bauherrschaft.',
    features: ['Entwurfsplanung', 'Genehmigungsplanung', 'Ausführungsplanung'],
    bullets: [
      'Analyse Ihrer Anforderungen und des Standorts',
      'Entwicklung mehrerer Entwurfsalternativen',
      'Behördenabklärungen und Baugesuchsvorbereitung',
      'Detaillierte Ausführungspläne für alle Gewerke',
      'Koordination zwischen Architektur und Fachplanern',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
  },
  {
    slug: 'neubauten',
    category: 'architektur',
    icon: Building2,
    title: 'Neubauten',
    shortDescription:
      'Ob Wohnhäuser, Gewerbeimmobilien oder öffentliche Bauten – wir realisieren Projekte, die höchsten architektonischen und baulichen Ansprüchen genügen.',
    fullDescription:
      'Der Neubau eines Gebäudes ist ein komplexer Prozess, der höchste Präzision in Planung und Ausführung erfordert. Die Hans Amonn AG begleitet Sie von der ersten Idee bis zur Schlüsselübergabe. Wir koordinieren alle Beteiligten, überwachen die Qualität und sorgen für die Einhaltung von Terminen und Budget.',
    features: ['Wohnhäuser', 'Gewerbeimmobilien', 'Öffentliche Bauten'],
    bullets: [
      'Einfamilien- und Mehrfamilienhäuser',
      'Gewerbliche und industrielle Bauten',
      'Hotel- und Gastgewerbeimmobilien',
      'Termin- und Kostenkontrolle',
      'Abnahme und Übergabe',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
  },
  {
    slug: 'sanierungen-umbauten',
    category: 'architektur',
    icon: Cog,
    title: 'Sanierungen und Umbauten',
    shortDescription:
      'Bestehende Gebäude erhalten durch uns eine neue Perspektive. Wir schaffen moderne Lösungen, die den Charakter des Bestands bewahren und gleichzeitig zeitgemäße Standards erfüllen.',
    fullDescription:
      'Sanierungen und Umbauten stellen besondere Anforderungen an Planung und Ausführung. Wir analysieren den Bestand sorgfältig, erarbeiten massgeschneiderte Lösungen und setzen die Massnahmen fachgerecht um – ob denkmalgeschütztes Fachwerkhaus oder Nachkriegsblock. Das Ergebnis: mehr Komfort, höhere Energieeffizienz und ein stimmiges Erscheinungsbild.',
    features: ['Modernisierung', 'Energetische Sanierung', 'Umbauten'],
    bullets: [
      'Zustandsanalyse und Schadensdiagnose',
      'Planung unter Denkmalschutzauflagen',
      'Energetische Optimierung (MINERGIE-Standards)',
      'Modernisierung der Haustechnik',
      'Innenraumgestaltung und Ausbau',
    ],
    coverImage:
      'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/40ccd8d190aeb0a543c3ff4ab8cdf19d.jpg',
  },
  {
    slug: 'projektbegleitung',
    category: 'architektur',
    icon: Users,
    title: 'Projektbegleitung & Bauleitung',
    shortDescription:
      'Von der ersten Idee bis zur Fertigstellung – wir stehen Ihnen in jeder Phase Ihres Bauvorhabens zur Seite und sorgen für eine termingerechte, wirtschaftliche und hochwertige Umsetzung.',
    fullDescription:
      'Als Ihr Gesamtleiter und Bauleiter übernehmen wir die vollständige Koordination Ihres Projekts. Wir schreiben Unternehmerleistungen aus, vergleichen Offerten, vergeben Aufträge und überwachen die Ausführung lückenlos. Sie erhalten regelmässige Berichte und behalten stets den Überblick – ohne selbst in operative Details eingebunden zu sein.',
    features: ['Bauüberwachung', 'Qualitätskontrolle', 'Terminplanung'],
    bullets: [
      'Ausschreibung und Vergabe aller Gewerke',
      'Bauleitung und Koordination der Unternehmer',
      'Qualitätssicherung und Abnahme',
      'Kostenkontrolle und Nachtragsmanagement',
      'Schlussabrechnung und Gewährleistungsüberwachung',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80',
  },

  // ── Real Estate ─────────────────────────────────────────────────
  {
    slug: 'kauf-verkauf',
    category: 'immobilien',
    icon: Key,
    title: 'Kauf und Verkauf',
    shortDescription:
      'Profitieren Sie von unserer Expertise und unserem breiten Netzwerk, um Ihre Traumimmobilie zu finden oder Ihre Immobilie erfolgreich zu verkaufen.',
    fullDescription:
      'Der Kauf oder Verkauf einer Immobilie ist eine der grössten finanziellen Entscheidungen im Leben. Die Hans Amonn AG steht Ihnen mit umfassender Marktkenntnis, professioneller Bewertung und verlässlicher Begleitung bis zur Schlüsselübergabe zur Seite. Wir kennen den regionalen Markt in Muri bei Bern und Umgebung seit über 55 Jahren.',
    features: ['Immobilienbewertung', 'Professionelle Vermarktung', 'Verhandlungsführung'],
    bullets: [
      'Marktgerechte Bewertung Ihrer Liegenschaft',
      'Erstellung professioneller Verkaufsunterlagen',
      'Inseration auf allen relevanten Plattformen',
      'Durchführung von Besichtigungen',
      'Verhandlung und Vertragsabwicklung',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80',
  },
  {
    slug: 'vermietung',
    category: 'immobilien',
    icon: Home,
    title: 'Vermietung',
    shortDescription:
      'Ob Wohn- oder Gewerbeimmobilien – wir finden den passenden Mieter für Ihre Liegenschaft und kümmern uns um alle Details, von der Inseration bis zur Vertragsabwicklung.',
    fullDescription:
      'Eine leerstehende Wohnung kostet Geld. Wir vermarkten Ihre Mietobjekte zielgruppengerecht, prüfen Bewerber sorgfältig und erstellen rechtssichere Mietverträge. Damit minimieren Sie Leerstand und rechtliche Risiken.',
    features: ['Mietersuche', 'Vertragsabwicklung', 'Objektpräsentation'],
    bullets: [
      'Professionelle Objektfotografie und -beschreibung',
      'Inseration auf Immoscout, Homegate und weiteren Portalen',
      'Bonitätsprüfung und Referenzauskünfte',
      'Erstellung und Abschluss des Mietvertrags',
      'Wohnungsübergabe mit Protokoll',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
  },
  {
    slug: 'projektentwicklung',
    category: 'immobilien',
    icon: TrendingUp,
    title: 'Projektentwicklung',
    shortDescription:
      'Sie haben eine Vision? Wir entwickeln maßgeschneiderte Immobilienprojekte, die sowohl funktional als auch nachhaltig überzeugen.',
    fullDescription:
      'Von der Grundstückssuche über die Machbarkeitsstudie bis zur Realisierung: Wir begleiten Investoren und private Bauherren bei der Entwicklung von Immobilienprojekten jeder Größenordnung. Unser interdisziplinäres Team vereint Architektur, Marktkenntnis und Projektmanagement.',
    features: ['Standortanalyse', 'Konzeptentwicklung', 'Realisierung'],
    bullets: [
      'Grundstücksakquisition und Due Diligence',
      'Machbarkeitsstudie und Wirtschaftlichkeitsrechnung',
      'Baurechts- und Zonenplanung',
      'Koordination aller Fachplaner',
      'Vermarktung noch vor Baubeginn',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1590496793929-36417d3117de?w=1200&q=80',
  },
  {
    slug: 'immobilienbewirtschaftung',
    category: 'immobilien',
    icon: Shield,
    title: 'Immobilienbewirtschaftung',
    shortDescription:
      'Wir übernehmen die Verwaltung Ihrer Liegenschaften und sorgen für einen reibungslosen Ablauf – von der Mieterbetreuung bis zur Instandhaltung.',
    fullDescription:
      'Die professionelle Bewirtschaftung Ihrer Liegenschaft schützt den Wert Ihrer Investition und entlastet Sie als Eigentümer. Wir kümmern uns um alle administrativen, technischen und kaufmännischen Belange und berichten Ihnen regelmässig transparent über den Zustand Ihrer Immobilien.',
    features: ['Mieterbetreuung', 'Instandhaltung', 'Finanzmanagement'],
    bullets: [
      'Mietzinsinkasso und Buchhaltung',
      'Mieterkorrespondenz und Reklamationsmanagement',
      'Organisation von Reparaturen und Unterhaltsarbeiten',
      'Jährliche Liegenschaftsabrechnung',
      'Heiz- und Nebenkostenabrechnung',
    ],
    coverImage:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
  },
];

export const serviceCategories = [
  { id: 'architektur', label: 'Architektur' },
  { id: 'immobilien', label: 'Immobilien' },
];
