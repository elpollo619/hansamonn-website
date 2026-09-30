/**
 * Cookie / tracking consent (nDSG + FMG Art. 45c, GDPR-safe opt-in).
 * Stored in localStorage as JSON; the old string values ('accepted' / 'declined')
 * are still understood.
 */
export const CONSENT_KEY = 'ha_cookie_consent';
export const CONSENT_VERSION = 2;
const CHANGE_EVENT = 'ha:cookie-consent';
const OPEN_EVENT = 'ha:cookie-settings';

export function getConsent() {
  let raw = null;
  try { raw = localStorage.getItem(CONSENT_KEY); } catch { return null; }
  if (!raw) return null;
  if (raw === 'accepted') return { statistics: true, external: false };
  if (raw === 'declined') return { statistics: false, external: false };
  try {
    const c = JSON.parse(raw);
    return { statistics: !!c.statistics, external: !!c.external };
  } catch {
    return null;
  }
}

export function setConsent({ statistics = false, external = false }) {
  const value = { v: CONSENT_VERSION, date: new Date().toISOString(), statistics, external };
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(value)); } catch { /* private mode */ }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export const onConsentChange = (fn) => {
  window.addEventListener(CHANGE_EVENT, fn);
  return () => window.removeEventListener(CHANGE_EVENT, fn);
};

/** Re-open the cookie settings (footer link). */
export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_EVENT));
export const onOpenCookieSettings = (fn) => {
  window.addEventListener(OPEN_EVENT, fn);
  return () => window.removeEventListener(OPEN_EVENT, fn);
};
