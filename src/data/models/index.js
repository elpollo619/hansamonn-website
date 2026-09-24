/**
 * 3D building models generated from AMONN ARCHITEKTUR CAD plans (1:50).
 * The geometry JSON is loaded on demand; the metadata below is available
 * immediately for labels and buttons.
 *
 * Geometry per level (metres, plan x → east, z → south, centred):
 *   walls / partitions: polygons { o: outer ring, h: holes }
 *   openings: facade segments [x1, z1, x2, z2] (windows / doors)
 *   footprint: outline ring
 *
 * <id>-site.json: surroundings — land cover from the official survey (geodienste.ch),
 * neighbour heights from the building register (GWR) and trees from SWISSIMAGE (swisstopo).
 */
export const BUILDING_MODELS = {
  a14: {
    id: 'a14',
    name: "N's Hotel",
    short: 'A14',
    address: 'Allmendstrasse 14, 3210 Kerzers',
    kind: 'Hotel & Gewerbe',
    source: 'Ausführungspläne A14, 1:50 · 2022',
    facts: [
      { label: 'Hotelgeschoss', value: '37.07 m' },
      { label: 'Zimmer', value: '36' },
      { label: 'Geschosse', value: 'UG + EG + 2 OG' },
    ],
    load: () => import('./a14.json').then((m) => m.default),
    site: () => import('./a14-site.json').then((m) => m.default),
  },
  a12: {
    id: 'a12',
    name: 'Allmendstrasse 12/12a',
    short: 'A12',
    address: 'Allmendstrasse 12/12a, 3210 Kerzers',
    kind: 'Wohnen & Dienstleistung',
    source: 'Ausführungspläne A12, 1:50 · 2022',
    facts: [
      { label: 'Länge', value: '39.30 m' },
      { label: 'Tiefe', value: '12.50 m' },
      { label: 'Geschosse', value: 'EG + 3 OG' },
    ],
    load: () => import('./a12.json').then((m) => m.default),
    site: () => import('./a12-site.json').then((m) => m.default),
  },
  a4: {
    id: 'a4',
    name: 'Allmendstrasse 4/4a',
    short: 'A4',
    address: 'Allmendstrasse 4/4a, 3210 Kerzers',
    kind: 'Wohnkomplex',
    source: 'Ausführungspläne 759, 1:50 · 2019',
    facts: [
      { label: 'Länge', value: '43.60 m' },
      { label: 'Tiefe', value: '15.05 m' },
      { label: 'Geschosse', value: 'UG + EG + 3 OG' },
    ],
    load: () => import('./a4.json').then((m) => m.default),
    site: () => import('./a4-site.json').then((m) => m.default),
  },
  cr: {
    id: 'cr',
    name: 'Casa Reto',
    short: 'CR',
    address: 'Gordemo, Tessin',
    kind: 'Ferienhaus',
    source: 'Pläne 248, 1:50 · 2024',
    facts: [
      { label: 'Grundfläche', value: '10.00 × 5.00 m' },
      { label: 'Dach', value: 'Pultdach 8.3°' },
      { label: 'Geschosse', value: 'EG + OG' },
    ],
    siteNote: 'Umgebung schematisch',
    load: () => import('./cr.json').then((m) => m.default),
    site: () => import('./cr-site.json').then((m) => m.default),
  },
};

export const MODEL_LIST = Object.values(BUILDING_MODELS);
