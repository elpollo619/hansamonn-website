/**
 * GoogleAnalytics — loads gtag only with a real measurement ID *and* after the visitor
 * accepted cookies, then fires a page_view on every route change.
 *
 * Setup: set VITE_GA_ID=G-XXXXXXXXXX (e.g. in the Vercel project env). Without it this is a no-op.
 */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getConsent, onConsentChange } from '@/lib/consent';

const GA_ID = import.meta.env.VITE_GA_ID || '';

const hasConsent = () => !!getConsent()?.statistics;

// Revocation: stop gtag and remove its cookies on this domain.
function disableGtag() {
  window[`ga-disable-${GA_ID}`] = true;
  const host = window.location.hostname;
  document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => n.startsWith('_ga')).forEach((n) => {
    [host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`].forEach((d) => {
      document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
    });
    document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

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

  useEffect(() => onConsentChange(() => setConsent(hasConsent())), []);

  useEffect(() => {
    if (!GA_ID) return;
    if (!consent) { if (window.gtag) disableGtag(); return; }
    window[`ga-disable-${GA_ID}`] = false;
    loadGtag();
    window.gtag('config', GA_ID, { page_path: location.pathname });
  }, [location, consent]);

  return null;
}
