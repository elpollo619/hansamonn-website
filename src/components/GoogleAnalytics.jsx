/**
 * GoogleAnalytics — fires a page_view event on every route change.
 *
 * Setup:
 *   1. Create a `.env.local` file in the project root (never commit this file).
 *   2. Add your real Google Analytics measurement ID:
 *        VITE_GA_ID=G-XXXXXXXXXX
 *   3. The component is a no-op when VITE_GA_ID is not set, so it is safe in dev.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = import.meta.env.VITE_GA_ID || '';

export default function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    if (!GA_ID || !window.gtag) return;
    window.gtag('config', GA_ID, { page_path: location.pathname });
  }, [location]);

  if (!GA_ID) return null;

  return null;
}
