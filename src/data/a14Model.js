/**
 * A14 — Allmendstrasse 14, Kerzers (N's Hotel)
 * 3D model built from the AMONN ARCHITEKTUR plans:
 *  - Hotel floors (1./2. OG): walls extracted from the Ausführungsplan
 *    "760-ngh A14 1. Obergeschoss 1:50" (CAD PDF, 2022) → a14OgWalls.json
 *  - Erdgeschoss: traced from the Baueingabeplan 760.14 Grundriss EG (1:100)
 *
 * Units: metres. Plan coordinates: x → east, z → south (as drawn on the sheet),
 * origin at the north-west corner of Lager-Halle 1.
 * Walls: [x1, z1, x2, z2, heightOverride?]
 */

import ogWalls from './a14OgWalls.json';

// Hotel floor outline (as built, 1. OG Ausführungsplan)
const hotelOutline = [
  [0, 12.5], [33.4, 12.5], [33.4, 17.9], [37.09, 17.9], [37.09, 25.1],
  [11.8, 25.1], [11.8, 27.9], [5.1, 27.9], [5.1, 25.1], [0, 25.1],
];

const HALL1_H = 4.4;

const egWalls = [
  // Lager-Halle 1 (steel hall, single storey, flat roof)
  [0, 0, 27, 0, HALL1_H], [27, 0, 27, 12.67, HALL1_H], [0, 0, 0, 12.67, HALL1_H],
  // Lager-Halle 2 (under the hotel floors)
  [0, 12.67, 33.4, 12.67], [0, 12.67, 0, 25.3], [0, 25.3, 33.4, 25.3], [33.4, 12.67, 33.4, 17.2],
  // East annex: Garderoben / WC
  [33.4, 17.2, 34.8, 17.2], [34.8, 17.2, 34.8, 19.5], [34.8, 19.5, 37.1, 19.5],
  [37.1, 19.5, 37.1, 25.4], [37.1, 25.4, 33.4, 25.4], [34.8, 22.6, 37.1, 22.6],
  // Street front: Check-in, Lift, Treppenhaus, WC, Aufenthaltsraum, Korridor
  [0, 25.3, 0, 29.2], [0, 29.2, 2.6, 29.2], [4.24, 25.3, 4.24, 29.2], [4.24, 29.2, 17.1, 29.2],
  [17.1, 25.3, 17.1, 29.2], [6.3, 25.3, 6.3, 27.5], [7.55, 25.3, 7.55, 27.5],
  [10.5, 25.3, 10.5, 27.5], [11.7, 25.3, 11.7, 29.2], [4.24, 27.5, 11.7, 27.5],
];

// Extra 2D plan lines (dimension chains, Sitzplatz, hall frames) — plan only
const planExtras = [
  // Dimension: 27.00 (north) and 25.20 (west)
  [0, -1.8, 27, -1.8], [0, -2.1, 0, -1.5], [27, -2.1, 27, -1.5],
  [-1.8, 0, -1.8, 25.3], [-2.1, 0, -1.5, 0], [-2.1, 25.3, -1.5, 25.3],
  // Dimension: 37.07 (Hotelgeschoss)
  [0, 31.0, 37.07, 31.0], [0, 30.7, 0, 31.3], [37.07, 30.7, 37.07, 31.3],
  // Sitzplatz outline
  [17.1, 29.2, 33.4, 29.2], [33.4, 25.4, 33.4, 29.2],
  // Hall 1 steel frames
  ...[6.1, 11.96, 17.84, 23.72].map((x) => [x, 0, x, 12.67]),
];

const centers = (edges) => edges.slice(0, -1).map((e, i) => (e + edges[i + 1]) / 2);
const NORTH_ROOMS = [0, 3.8, 7.5, 11.2, 14.9, 18.6, 22.2, 25.8, 29.5, 33.4];
const SOUTH_ROOMS = [11.8, 14.9, 18.6, 22.2, 25.8, 29.5, 33.4, 37.09];

const hotelWindows = [
  ...centers(NORTH_ROOMS).map((x) => ({ x, z: 12.5 })),
  ...centers(SOUTH_ROOMS).map((x) => ({ x, z: 25.1 })),
  ...centers([0, 3.8]).map((x) => ({ x, z: 25.1 })),
];

export const a14Model = {
  id: 'a14',
  name: "N's Hotel",
  address: 'Allmendstrasse 14, 3210 Kerzers',
  sheet: 'A14 · Grundriss EG',
  scale: 'M 1:100',
  facts: [
    { label: 'Hallenbreite', value: '27.00 m' },
    { label: 'Hotelgeschoss', value: '37.07 m' },
    { label: 'Zimmer pro OG', value: '18' },
  ],
  bounds: { minX: -2.2, maxX: 37.1, minZ: -2.2, maxZ: 31.3 },
  plan: [...egWalls.map((w) => w.slice(0, 4)), ...planExtras],
  levels: [
    { key: 'eg', label: 'EG', base: 0, height: 3.4, walls: egWalls, windows: [] },
    { key: 'og1', label: '1. OG', base: 3.4, height: 3.0, walls: [], rects: ogWalls, windows: hotelWindows, rooms: '101–118' },
    { key: 'og2', label: '2. OG', base: 6.4, height: 3.0, walls: [], rects: ogWalls, windows: hotelWindows, rooms: '201–218' },
  ],
  slabs: [
    { level: 0, outline: hotelOutline, thickness: 0.25 },
    { level: 1, outline: hotelOutline, thickness: 0.25 },
    { level: 2, outline: hotelOutline, thickness: 0.4, roof: true },
    { level: 0, outline: [[0, 0], [27, 0], [27, 12.67], [0, 12.67]], thickness: 0.3, y: HALL1_H, roof: true },
  ],
};

export default a14Model;
