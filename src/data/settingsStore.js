/**
 * settingsStore.js — Global site settings (contact info, branding, integrations)
 * Stored in localStorage. Read by WhatsAppButton, Footer, Contact, etc.
 */

const KEY = 'ha_settings_v2';

export const DEFAULT_SETTINGS = {
  // ── Contact ─────────────────────────────────────────────────────────────────
  whatsappNumber:  '41775350668',          // no leading +
  whatsappMessage: 'Hallo, ich interessiere mich für Ihre Angebote.',
  phone:           '+41 (0)31 951 85 54',
  email:           'office@reto-amonn.ch',
  address:         'Blümlisalpstrasse 4, 3074 Muri bei Bern',
  hours:           'Mo–Fr 08:00–12:00, 13:30–17:30',
  companyName:     'Hans Amonn AG',

  // ── Branding ────────────────────────────────────────────────────────────────
  brandColor:      '#1F497D',              // Primary brand colour (navy)

  // ── Hero content (Homepage) ─────────────────────────────────────────────────
  heroHeadline:    'Ihr Zuhause in der Region Bern',
  heroSubtitle:    'Vom möblierten Long Stay bis zum Ferienhaus am Lago Maggiore: Hans Amonn AG bietet Ihnen passende Wohnlösungen.',
  heroCtaLabel:    'Alle Angebote entdecken',
  heroCtaLink:     '/immobilien',

  // ── iCal / Integrations ──────────────────────────────────────────────────────
  casaRetoIcalUrl: 'https://www.airbnb.ch/calendar/ical/625660996936132774.ics?t=82a02050ce864c73b599648976548358',

  // ── E-Mail Benachrichtigungen ────────────────────────────────────────────────
  notifyMietanfragen: true,
  notifyKontakt:      true,
  notifyTermine:      true,
  notifyNewsletter:   false,
  notificationEmail:  'office@reto-amonn.ch',
};

export function getSettings() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const stored = JSON.parse(raw);
    // Old default navy (before the logo colour was matched): fall back to the current default
    if (stored.brandColor && stored.brandColor.toUpperCase() === '#1D3D78') delete stored.brandColor;
    return { ...DEFAULT_SETTINGS, ...stored };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/** Darken a hex color by scaling each channel towards black (amount 0–1), which keeps the hue. */
export function darkenHex(hex, amount = 0.24) {
  const clean = (hex || '').replace('#', '');
  if (clean.length !== 6) return hex;
  const ch = (i) => Math.round(parseInt(clean.slice(i, i + 2), 16) * (1 - amount));
  return '#' + [ch(0), ch(2), ch(4)].map(x => x.toString(16).padStart(2, '0')).join('');
}

export function saveSettings(patch) {
  const current = getSettings();
  const next = { ...current, ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  // Immediately update CSS variables so UI reflects changes without a reload
  if (patch.brandColor) {
    document.documentElement.style.setProperty('--brand-color', patch.brandColor);
    document.documentElement.style.setProperty('--brand-color-dark', darkenHex(patch.brandColor));
  }
  return next;
}

export function getSetting(key) {
  return getSettings()[key] ?? DEFAULT_SETTINGS[key];
}

/** Returns the current brand colour (from settings or default). */
export function getBrandColor() {
  return getSetting('brandColor') || DEFAULT_SETTINGS.brandColor;
}
