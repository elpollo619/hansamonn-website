/**
 * Casa Reto, Gordemo (Gordola TI): content for the holiday house page.
 * Room data follows the CAD floor plans (cr-eg / cr-og), photos and amenities
 * come from the owner's own Airbnb listing (as of September 2026).
 */

const IMG = '/images/casa-reto';
const img = (name, alt) => ({ url: `${IMG}/${name}.jpg`, alt });

export const CR_FACTS = [
  { value: '8', label: 'Gäste' },
  { value: '4', label: 'Schlafzimmer' },
  { value: '5', label: 'Betten' },
  { value: '2', label: 'Duschbäder' },
  { value: 'ca. 80 m²', label: 'Wohnfläche' },
];

export const CR_RATING = {
  score: 4.72,
  count: 47,
  source: 'Airbnb',
  asOf: 'September 2026',
  categories: [
    { label: 'Check-in', value: 5.0 },
    { label: 'Kommunikation', value: 4.9 },
    { label: 'Lage', value: 4.9 },
    { label: 'Genauigkeit', value: 4.7 },
    { label: 'Preis-Leistung', value: 4.5 },
    { label: 'Sauberkeit', value: 4.4 },
  ],
  mentions: ['Aussicht', 'Gastfreundschaft', 'Lage', 'Küche', 'Sauberkeit'],
};

/**
 * Virtual tour: one stop per room. `level` + `spot` (percent of the cropped
 * plan image) place the hotspot on the floor plan.
 */
export const CR_PLANS = {
  eg: { label: 'Erdgeschoss', src: `${IMG}/plan-eg.webp`, w: 1250, h: 670 },
  og: { label: 'Obergeschoss', src: `${IMG}/plan-og.webp`, w: 1250, h: 670 },
};

export const CR_TOUR = [
  {
    id: 'ankunft',
    level: 'eg',
    title: 'Ankunft',
    meta: '2 Parkplätze · E-Ladestation',
    text: 'Sie parkieren direkt beim Haus, zwei Plätze gehören dazu. Den Schlüssel holen Sie aus der Schlüsselbox, einchecken können Sie ab 15 Uhr selbstständig.',
    images: [img('zugang', 'Zugang zur Casa Reto mit Parkplatz'), img('ladestation', 'Ladestation für Elektroautos beim Haus')],
  },
  {
    id: 'wohnen',
    level: 'eg',
    spot: [45, 42],
    title: 'Wohnzimmer',
    meta: '13 m² · Holzofen · Terrassentür',
    text: 'Terracotta-Boden, ein Holzofen mit Holzvorrat für kühle Abende und eine Glastür direkt in den Garten. Sonos-Soundsystem, TV mit Netflix, Bücher und Brettspiele.',
    images: [
      img('wohnzimmer-1', 'Wohnzimmer mit Holzofen und Sitzgruppe'),
      img('wohnzimmer-ausblick', 'Blick vom Wohnzimmer über den Garten auf den Lago Maggiore'),
      img('wohnzimmer-2', 'Wohnzimmer mit Blick zur Küche'),
      img('wohnzimmer-ofen', 'Feuer im Holzofen'),
      img('wohnzimmer-3', 'Sitzecke im Wohnzimmer'),
    ],
  },
  {
    id: 'kueche',
    level: 'eg',
    spot: [83, 43],
    title: 'Küche & Essplatz',
    meta: '9.6 m² · Tisch für 8',
    text: 'Voll ausgestattet mit Backofen, Geschirrspüler, Mikrowelle, Espressomaschine und Gefrierfach. Der lange Holztisch für acht Personen steht direkt an den Fenstern mit Seeblick.',
    images: [
      img('essen-1', 'Essplatz mit Holztisch und Küche'),
      img('kueche-1', 'Küchenzeile mit Backofen und Mikrowelle'),
      img('essen-2', 'Esstisch am Fenster mit Blick auf den See'),
      img('kueche-3', 'Espressomaschine und Wasserkocher'),
      img('essen-4', 'Blick vom Essplatz auf den Lago Maggiore'),
      img('kueche-2', 'Küche mit Geschirrspüler'),
    ],
  },
  {
    id: 'zimmer1',
    level: 'eg',
    spot: [18, 51],
    title: 'Zimmer 1',
    meta: '14 m² · Doppelbett · Erdgeschoss',
    text: 'Das halboffene Schlafzimmer neben dem Wohnraum, mit Doppelbett, Deckenventilator und eigener Tür in den Garten.',
    images: [img('zimmer1-1', 'Zimmer 1 mit Doppelbett'), img('zimmer1-2', 'Zimmer 1 mit Blick in den Wohnraum'), img('zimmer1-3', 'Fenster in Zimmer 1')],
  },
  {
    id: 'bad-eg',
    level: 'eg',
    spot: [80, 21],
    title: 'Bad im Erdgeschoss',
    meta: '3.9 m² · Dusche · Waschmaschine',
    text: 'Dusche, WC und Lavabo, dazu Waschmaschine und Tumbler. Handtücher, Shampoo und Duschgel sind vorhanden.',
    images: [img('bad-eg-1', 'Duschbad im Erdgeschoss'), img('bad-eg-2', 'Waschmaschine im Bad'), img('bad-eg-3', 'Fenster im Bad')],
  },
  {
    id: 'zimmer2',
    level: 'og',
    spot: [16, 63],
    title: 'Zimmer 2',
    meta: '13.7 m² · Doppelbett · Balkon',
    text: 'Das grösste Schlafzimmer oben: Holzdecke, Doppelbett und Flügeltür auf den Balkon mit freiem Blick über den See.',
    images: [
      img('zimmer2-1', 'Zimmer 2 mit Doppelbett und Balkontür'),
      img('zimmer2-balkon', 'Aussicht vom Balkon vor Zimmer 2'),
      img('zimmer2-2', 'Zimmer 2 mit Holzdecke'),
      img('zimmer2-3', 'Balkontür in Zimmer 2'),
      img('zimmer2-4', 'Bett in Zimmer 2'),
    ],
  },
  {
    id: 'zimmer3',
    level: 'og',
    spot: [50, 63],
    title: 'Zimmer 3',
    meta: '10.5 m² · 2 Einzelbetten · Balkon',
    text: 'Zwei Einzelbetten, ideal für Kinder oder Freunde. Auch dieses Zimmer öffnet sich auf den Balkon.',
    images: [img('zimmer3-1', 'Zimmer 3 mit Einzelbett'), img('zimmer3-3', 'Zimmer 3 mit Balkontür'), img('zimmer3-2', 'Zweites Einzelbett in Zimmer 3'), img('zimmer3-balkon', 'Balkon vor Zimmer 3')],
  },
  {
    id: 'zimmer4',
    level: 'og',
    spot: [80, 69],
    title: 'Zimmer 4',
    meta: '9.5 m² · Doppelbett · Seeblick',
    text: 'Ruhiges Doppelzimmer mit Holzdecke und Fensterläden, der Blick geht direkt auf den Lago Maggiore.',
    images: [img('zimmer4-1', 'Zimmer 4 mit Doppelbett'), img('zimmer4-2', 'Fenster mit Seeblick in Zimmer 4')],
  },
  {
    id: 'bad-og',
    level: 'og',
    spot: [80, 21],
    title: 'Bad im Obergeschoss',
    meta: '3.9 m² · Dusche · WC',
    text: 'Zweites Duschbad mit WC und Lavabo, direkt bei den drei Schlafzimmern.',
    images: [img('bad-og-1', 'Duschbad im Obergeschoss')],
  },
  {
    id: 'garten',
    level: 'eg',
    title: 'Garten & Pergola',
    meta: 'Granittisch · Grill · Hängematte',
    text: 'Unter der Pergola steht ein Granittisch mit Sitzbänken, daneben Rasen, Liegestühle, Hängematte und ein Holzkohlegrill. Die Terrassentüren von Wohnzimmer und Zimmer 1 führen direkt hinaus.',
    images: [
      img('garten-pergola', 'Granittisch unter der Pergola mit Seeblick'),
      img('garten-rasen', 'Rasen und Pergola im Garten'),
      img('garten-sitzplatz', 'Sitzplatz vor dem Haus'),
      img('garten-pergola-2', 'Pergola mit Blick auf den Lago Maggiore'),
      img('garten-baum', 'Kamelienbaum im Garten'),
      img('garten-rasen-2', 'Garten mit Geländer und Aussicht'),
    ],
  },
  {
    id: 'aussicht',
    level: 'og',
    title: 'Aussicht',
    meta: 'Lago Maggiore · Tag und Nacht',
    text: 'Vom Garten und vom Balkon reicht der Blick über die Dächer von Tenero weit über den Lago Maggiore, abends mit den Lichtern am Seeufer.',
    images: [
      img('aussicht-panorama', 'Panorama über den Lago Maggiore'),
      img('aussicht-garten', 'Aussicht vom Garten auf See und Berge'),
      img('aussicht-nacht', 'Lichter am Lago Maggiore bei Nacht'),
      img('aussicht-balkon', 'Blick vom Balkon auf den See'),
    ],
  },
];

export const CR_AMENITIES = [
  {
    group: 'Küche & Essen',
    items: ['Backofen und Elektroherd', 'Geschirrspüler', 'Mikrowelle', 'Kühlschrank mit Gefrierfach', 'Espressomaschine und Kaffee', 'Wasserkocher, Toaster, Standmixer', 'Geschirr, Weingläser, Grundausstattung zum Kochen', 'Esstisch für 8 Personen'],
  },
  {
    group: 'Schlafen & Bad',
    items: ['Bettwäsche aus Baumwolle', 'Handtücher, Seife, Shampoo', 'Föhn', 'Verdunkelung, Kleiderschrank und Kommode', 'Waschmaschine und Tumbler', 'Bügeleisen, Wäscheständer'],
  },
  {
    group: 'Wohnen',
    items: ['Holzofen mit Holzvorrat', 'Deckenventilatoren', 'Heizung', 'TV mit Netflix', 'Sonos-Soundsystem', 'Bücher und Brettspiele', 'WLAN und Arbeitsplatz mit Bildschirm und Drucker'],
  },
  {
    group: 'Draussen',
    items: ['Privater Garten mit Rasen', 'Pergola mit Granittisch', 'Holzkohlegrill und Aussenküche', 'Feuerstelle', 'Liegestühle und Hängematte', 'Balkon im Obergeschoss'],
  },
  {
    group: 'Familie',
    items: ['Babybett', 'Kinderbücher und Spielzeug', 'Platz für 8 Gäste'],
  },
  {
    group: 'Parken & Anreise',
    items: ['2 Parkplätze beim Haus', 'Ladestation für Elektroautos', 'Weitere Parkplätze an der Strasse', 'Self Check-in mit Schlüsselbox'],
  },
];

/** Travel times are approximate, by car, depending on traffic. */
export const CR_DISTANCES = [
  { place: 'Verzasca-Staumauer', time: 'ca. 5 Min.' },
  { place: 'Bahnhof Gordola / Tenero', time: 'ca. 5 Min.' },
  { place: 'Tenero, Lido und Seeufer', time: 'ca. 10 Min.' },
  { place: 'Locarno, Piazza Grande', time: 'ca. 15 Min.' },
  { place: 'Ascona, Seepromenade', time: 'ca. 20 Min.' },
  { place: 'Lavertezzo, Ponte dei Salti', time: 'ca. 20 Min.' },
  { place: 'Bellinzona', time: 'ca. 20 Min.' },
  { place: 'Lugano', time: 'ca. 45 Min.' },
];

export const CR_ACTIVITIES = [
  { title: 'Valle Verzasca', text: 'Smaragdgrünes Wasser, die Steinbrücke von Lavertezzo und Wanderwege bis Sonogno.' },
  { title: 'Lago Maggiore', text: 'Baden am Lido von Tenero, Schiffsrundfahrten ab Locarno, Brissago-Inseln.' },
  { title: 'Locarno & Ascona', text: 'Piazza Grande, Altstadtgassen, Seepromenade und Märkte.' },
  { title: 'Wandern & Velo', text: 'Wanderwege ab Gordemo, Veloroute von Gordola durch das Verzascatal bis Sonogno.' },
];

export const CR_RULES = [
  { label: 'Check-in', value: '15 bis 24 Uhr, selbstständig mit Schlüsselbox' },
  { label: 'Check-out', value: 'bis 10 Uhr' },
  { label: 'Gäste', value: 'höchstens 8 Personen' },
  { label: 'Haustiere', value: 'willkommen, bitte bei der Anfrage angeben' },
  { label: 'Rauchen', value: 'im Haus nicht erlaubt' },
  { label: 'Partys', value: 'keine Partys oder Veranstaltungen' },
  { label: 'Treppen', value: 'die Schlafzimmer 2 bis 4 liegen im Obergeschoss' },
  { label: 'Sicherheit', value: 'Rauchmelder vorhanden' },
];

/** Tourism registration number of the canton of Ticino (shown on Airbnb). */
export const CR_REGISTRATION = 'NL-00011152';

export const CR_FAQ = [
  {
    q: 'Wie viele Personen haben Platz?',
    a: 'Bis zu acht Gäste: drei Zimmer mit Doppelbett und ein Zimmer mit zwei Einzelbetten, dazu ein Babybett.',
  },
  {
    q: 'Gibt es Bettwäsche und Handtücher?',
    a: 'Ja, Bettwäsche, Handtücher, Seife und Shampoo sind vorhanden.',
  },
  {
    q: 'Kann ich mit dem Auto anreisen?',
    a: 'Ja, zwei Parkplätze gehören zum Haus, eine Ladestation für Elektroautos ist vorhanden. Weitere Plätze gibt es an der Strasse.',
  },
  {
    q: 'Sind Haustiere erlaubt?',
    a: 'Ja, Haustiere sind willkommen. Bitte geben Sie bei der Anfrage an, welches Tier Sie mitbringen.',
  },
  {
    q: 'Gibt es eine Klimaanlage?',
    a: 'Nein, in den Zimmern gibt es Deckenventilatoren.',
  },
  {
    q: 'Kann ich im Haus arbeiten?',
    a: 'Ja, es gibt WLAN und einen Arbeitsplatz mit Bildschirm und Drucker. Aufenthalte ab 28 Tagen sind möglich.',
  },
  {
    q: 'Wie buche ich?',
    a: 'Direkt über das Anfrageformular auf dieser Seite, oder über Airbnb und Booking.com.',
  },
];
