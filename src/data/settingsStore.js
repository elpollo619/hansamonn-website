/**
 * settingsStore.js — Global site settings (contact info, branding, integrations)
 * Stored in localStorage. Read by WhatsAppButton, Footer, Contact, etc.
 */

const KEY = 'ha_settings_v1';

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
  brandColor:      '#1D3D78',              // Primary brand colour (navy)

  // ── Hero content (Homepage) ─────────────────────────────────────────────────
  heroHeadline:    'Ihr Zuhause in der Region Bern',
  heroSubtitle:    'Vom möblierten Long Stay bis zum Ferienhaus am Lago Maggiore — Hans Amonn AG bietet Ihnen passende Wohnlösungen.',
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
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/** Darken a hex color by `amount` (0–1 fraction of 255). */
export function darkenHex(hex, amount = 0.14) {
  const clean = (hex || '').replace('#', '');
  if (clean.length !== 6) return hex;
  const r = Math.max(0, parseInt(clean.slice(0, 2), 16) - Math.round(255 * amount));
  const g = Math.max(0, parseInt(clean.slice(2, 4), 16) - Math.round(255 * amount));
  const b = Math.max(0, parseInt(clean.slice(4, 6), 16) - Math.round(255 * amount));
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
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
