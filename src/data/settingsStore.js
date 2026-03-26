/**
 * settingsStore.js — Global site settings (contact info, integrations)
 * Stored in localStorage. Read by WhatsAppButton, Footer, Contact, etc.
 */

const KEY = 'ha_settings_v1';

export const DEFAULT_SETTINGS = {
  whatsappNumber:  '41775350668',          // no leading +
  whatsappMessage: 'Hallo, ich interessiere mich für Ihre Angebote.',
  phone:           '+41 (0)31 951 85 54',
  email:           'office@reto-amonn.ch',
  address:         'Blümlisalpstrasse 4, 3074 Muri bei Bern',
  hours:           'Mo–Fr 08:00–12:00, 13:30–17:30',
  companyName:     'Hans Amonn AG',
  casaRetoIcalUrl: 'https://www.airbnb.ch/calendar/ical/625660996936132774.ics?t=82a02050ce864c73b599648976548358',
  // E-Mail Benachrichtigungen
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

export function saveSettings(patch) {
  const current = getSettings();
  const next = { ...current, ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function getSetting(key) {
  return getSettings()[key] ?? DEFAULT_SETTINGS[key];
}
