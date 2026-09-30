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
      '/images/projekte/a4-explosion.jpg',
  },
  {
    slug: 'neubauten',
    category: 'architektur',
    icon: Building2,
    title: 'Neubauten',
    shortDescription:
      'Ob Wohnhäuser, Gewerbeimmobilien oder öffentliche Bauten: Wir planen und realisieren Projekte mit hohem gestalterischem und baulichem Anspruch.',
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
      '/images/ns-hotel/aussen.jpg',
  },
  {
    slug: 'sanierungen-umbauten',
    category: 'architektur',
    icon: Cog,
    title: 'Sanierungen und Umbauten',
    shortDescription:
      'Bestehende Gebäude erhalten durch uns eine neue Perspektive. Wir schaffen moderne Lösungen, die den Charakter des Bestands bewahren und gleichzeitig zeitgemäße Standards erfüllen.',
    fullDescription:
      'Sanierungen und Umbauten stellen besondere Anforderungen an Planung und Ausführung. Wir analysieren den Bestand sorgfältig, erarbeiten massgeschneiderte Lösungen und setzen die Massnahmen fachgerecht um, ob denkmalgeschütztes Fachwerkhaus oder Nachkriegsblock. Das Ergebnis: mehr Komfort, höhere Energieeffizienz und ein stimmiges Erscheinungsbild.',
    features: ['Modernisierung', 'Energetische Sanierung', 'Umbauten'],
    bullets: [
      'Zustandsanalyse und Schadensdiagnose',
      'Planung unter Denkmalschutzauflagen',
      'Energetische Optimierung (MINERGIE-Standards)',
      'Modernisierung der Haustechnik',
      'Innenraumgestaltung und Ausbau',
    ],
    coverImage: '/images/muenchenbuchsee/titel.jpg',
  },
  {
    slug: 'projektbegleitung',
    category: 'architektur',
    icon: Users,
    title: 'Projektbegleitung & Bauleitung',
    shortDescription:
      'Von der ersten Idee bis zur Fertigstellung: Wir stehen Ihnen in jeder Phase Ihres Bauvorhabens zur Seite und sorgen für eine termingerechte, wirtschaftliche und hochwertige Umsetzung.',
    fullDescription:
      'Als Ihr Gesamtleiter und Bauleiter übernehmen wir die vollständige Koordination Ihres Projekts. Wir schreiben Unternehmerleistungen aus, vergleichen Offerten, vergeben Aufträge und überwachen die Ausführung lückenlos. Sie erhalten regelmässige Berichte und behalten stets den Überblick, ohne selbst in operative Details eingebunden zu sein.',
    features: ['Bauüberwachung', 'Qualitätskontrolle', 'Terminplanung'],
    bullets: [
      'Ausschreibung und Vergabe aller Gewerke',
      'Bauleitung und Koordination der Unternehmer',
      'Qualitätssicherung und Abnahme',
      'Kostenkontrolle und Nachtragsmanagement',
      'Schlussabrechnung und Gewährleistungsüberwachung',
    ],
    coverImage:
      '/images/projekte/bremgarten/kran.jpg',
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
      '/images/ns-hotel/drohne-2.jpg',
  },
  {
    slug: 'vermietung',
    category: 'immobilien',
    icon: Home,
    title: 'Vermietung',
    shortDescription:
      'Ob Wohn- oder Gewerbeimmobilien: Wir finden den passenden Mieter für Ihre Liegenschaft und kümmern uns um alle Details, von der Inseration bis zur Vertragsabwicklung.',
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
      '/images/ns-hotel/doppelzimmer.jpg',
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
      '/images/projekte/baeren-3d.jpg',
  },
  {
    slug: 'immobilienbewirtschaftung',
    category: 'immobilien',
    icon: Shield,
    title: 'Immobilienbewirtschaftung',
    shortDescription:
      'Wir übernehmen die Verwaltung Ihrer Liegenschaften und sorgen für einen reibungslosen Ablauf, von der Mieterbetreuung bis zur Instandhaltung.',
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
      '/images/kerzers/titel.jpg',
  },
];

export const serviceCategories = [
  { id: 'architektur', label: 'Architektur' },
  { id: 'immobilien', label: 'Immobilien' },
];
