import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Fetches iCal blocked date ranges via the Supabase ical-proxy edge function.
 * @param {string|null} icalUrl  - The .ics export URL (e.g. from Airbnb)
 */
export function useAvailability(icalUrl) {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!icalUrl) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    supabase.functions
      .invoke('ical-proxy', { body: { url: icalUrl } })
      .then(({ data, error: fnErr }) => {
        if (cancelled) return;
        if (fnErr) throw fnErr;
        setEvents(data?.events ?? []);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? 'Fehler');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [icalUrl]);

  /** Returns true if a YYYY-MM-DD date string falls inside any blocked range */
  function isBlocked(dateStr) {
    return events.some(({ start, end }) => dateStr >= start && dateStr < end);
  }

  return { events, loading, error, isBlocked };
}
