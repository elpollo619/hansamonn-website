/**
 * Finds a stay period (arrival and departure) in free text, in German, English, French, Italian,
 * Spanish and Portuguese: "vom 10. bis 17. Juli", "10.7.–17.7.2027", "July 10 to 17",
 * "du 3 au 10 août", "dal 3 al 10 agosto", "del 3 al 10 de agosto", "2027-07-10 bis 2027-07-17",
 * or one date plus "7 Nächte / nights / nuits / notti / noches / noites".
 */

const MONTHS = {
  1: ['januar', 'jan', 'january', 'janvier', 'janv', 'gennaio', 'gen', 'enero', 'ene', 'janeiro'],
  2: ['februar', 'feb', 'february', 'fevrier', 'fev', 'febbraio', 'febrero', 'fevereiro'],
  3: ['marz', 'maerz', 'mar', 'march', 'mars', 'marzo', 'marco'],
  4: ['april', 'apr', 'avril', 'avr', 'aprile', 'abril', 'abr'],
  5: ['mai', 'may', 'maggio', 'mag', 'mayo', 'maio'],
  6: ['juni', 'jun', 'june', 'juin', 'giugno', 'giu', 'junio', 'junho'],
  7: ['juli', 'jul', 'july', 'juillet', 'juil', 'luglio', 'lug', 'julio', 'julho'],
  8: ['august', 'aug', 'aout', 'agosto', 'ago'],
  9: ['september', 'sep', 'sept', 'septembre', 'settembre', 'set', 'septiembre', 'setembro'],
  10: ['oktober', 'okt', 'october', 'oct', 'octobre', 'ottobre', 'ott', 'octubre', 'outubro', 'out'],
  11: ['november', 'nov', 'novembre', 'noviembre', 'novembro'],
  12: ['dezember', 'dez', 'december', 'dec', 'decembre', 'dicembre', 'dic', 'diciembre', 'dezembro'],
};
const MONTH_OF = Object.fromEntries(Object.entries(MONTHS).flatMap(([m, names]) => names.map((n) => [n, Number(m)])));
const MONTH_RE = Object.keys(MONTH_OF).sort((a, b) => b.length - a.length).join('|');

const strip = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const pad = (n) => String(n).padStart(2, '0');
const iso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
const valid = (y, m, d) => {
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
};

/** Returns { from, to } as YYYY-MM-DD, or null. `today` is a YYYY-MM-DD string. */
export function findStay(text, today) {
  const t = strip(text);
  const found = []; // { d, m|null, y|null, idx }

  // 2027-07-10
  for (const x of t.matchAll(/\b(20\d{2})-(\d{1,2})-(\d{1,2})\b/g)) found.push({ d: +x[3], m: +x[2], y: +x[1], idx: x.index });
  // 10.7. / 10.07.2027 / 10/7/27
  for (const x of t.matchAll(/\b(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?\.?(?!\d)/g)) {
    if (found.some((f) => Math.abs(f.idx - x.index) < 3)) continue;
    let y = x[3] ? +x[3] : null;
    if (y !== null && y < 100) y += 2000;
    found.push({ d: +x[1], m: +x[2], y, idx: x.index });
  }
  // 10. Juli 2027 / 10 de julio / 10 juillet
  for (const x of t.matchAll(new RegExp(`\\b(\\d{1,2})\\.?\\s*(?:de\\s+)?(${MONTH_RE})\\b\\.?(?:\\s*(?:de\\s+)?(20\\d{2}))?`, 'g'))) {
    found.push({ d: +x[1], m: MONTH_OF[x[2]], y: x[3] ? +x[3] : null, idx: x.index });
  }
  // July 10 / Juli 10
  for (const x of t.matchAll(new RegExp(`\\b(${MONTH_RE})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b(?:,?\\s*(20\\d{2}))?`, 'g'))) {
    if (found.some((f) => Math.abs(f.idx - x.index) < 6)) continue;
    found.push({ d: +x[2], m: MONTH_OF[x[1]], y: x[3] ? +x[3] : null, idx: x.index });
  }
  // bare day before a range word: "vom 10. bis 17. Juli", "du 3 au 10 aout", "from 3 to 10 August"
  const range = t.match(new RegExp(`\\b(\\d{1,2})\\.?\\s*(?:bis|-|–|to|until|au|al|a|ate|hasta|fino al|fino a)\\s*(?:(?:le|el|il|o)\\s+)?(\\d{1,2})\\.?\\s*(?:de\\s+)?(${MONTH_RE})\\b(?:\\s*(?:de\\s+)?(20\\d{2}))?`));
  if (range) {
    const m = MONTH_OF[range[3]];
    const y = range[4] ? +range[4] : null;
    return finish([{ d: +range[1], m, y }, { d: +range[2], m, y }], today);
  }

  found.sort((a, b) => a.idx - b.idx);
  if (found.length >= 2) return finish(found.slice(0, 2), today);
  if (found.length === 1) {
    const n = t.match(/\b(\d{1,2})\s*(?:nachte|nacht|nights?|nuits?|notti|notte|noches?|noites?)\b/);
    if (n) {
      const start = finish([found[0], found[0]], today);
      if (!start) return null;
      const dt = new Date(`${start.from}T12:00:00Z`);
      dt.setUTCDate(dt.getUTCDate() + Number(n[1]));
      return { from: start.from, to: dt.toISOString().slice(0, 10) };
    }
  }
  return null;
}

function finish([a, b], today) {
  const [ty] = today.split('-').map(Number);
  const m1 = a.m ?? b.m;
  const m2 = b.m ?? a.m;
  if (!m1 || !m2) return null;
  let y1 = a.y ?? b.y ?? ty;
  let y2 = b.y ?? y1;
  if (!a.y && !b.y && iso(y1, m1, a.d) < today) { y1 += 1; y2 += 1; }
  if (iso(y2, m2, b.d) <= iso(y1, m1, a.d) && !b.y) y2 = y1 + 1;
  if (!valid(y1, m1, a.d) || !valid(y2, m2, b.d)) return null;
  const from = iso(y1, m1, a.d);
  const to = iso(y2, m2, b.d);
  return to > from ? { from, to } : from === to ? { from, to } : null;
}
