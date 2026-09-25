/**
 * GoogleAnalytics — loads gtag only with a real measurement ID *and* after the visitor
 * accepted cookies, then fires a page_view on every route change.
 *
 * Setup: set VITE_GA_ID=G-XXXXXXXXXX (e.g. in the Vercel project env). Without it this is a no-op.
 */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = import.meta.env.VITE_GA_ID || '';
const CONSENT_KEY = 'ha_cookie_consent';

const hasConsent = () => {
  try { return localStorage.getItem(CONSENT_KEY) === 'accepted'; } catch { return false; }
};

function loadGtag() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); }; // eslint-disable-line prefer-rest-params
  window.gtag('js', new Date());
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

export default function GoogleAnalytics() {
  const location = useLocation();
  const [consent, setConsent] = useState(hasConsent);

  useEffect(() => {
    const onConsent = () => setConsent(hasConsent());
    window.addEventListener('ha:cookie-consent', onConsent);
    return () => window.removeEventListener('ha:cookie-consent', onConsent);
  }, []);

  useEffect(() => {
    if (!GA_ID || !consent) return;
    loadGtag();
    window.gtag('config', GA_ID, { page_path: location.pathname });
  }, [location, consent]);

  return null;
}
