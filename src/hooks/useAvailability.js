import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Fetches iCal blocked date ranges via the Supabase ical-proxy edge function.
 * Accepts a single URL string or an array of URLs — merges all into one event list.
 * @param {string|string[]|null} icalUrls
 */
export function useAvailability(icalUrls) {
  const urls = Array.isArray(icalUrls)
    ? icalUrls.filter(Boolean)
    : icalUrls
    ? [icalUrls]
    : [];

  const urlKey = urls.join(',');

  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (urls.length === 0) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all(
      urls.map((url) =>
        supabase.functions.invoke('ical-proxy', { body: { url } })
      )
    )
      .then((results) => {
        if (cancelled) return;
        const seen   = new Set();
        const merged = [];
        for (const { data, error: fnErr } of results) {
          if (fnErr) throw fnErr;
          for (const ev of data?.events ?? []) {
            const key = `${ev.start}|${ev.end}`;
            if (!seen.has(key)) {
              seen.add(key);
              merged.push(ev);
            }
          }
        }
        setEvents(merged);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? 'Fehler');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey]);

  /** Returns true if a YYYY-MM-DD date string falls inside any blocked range */
  function isBlocked(dateStr) {
    return events.some(({ start, end }) => dateStr >= start && dateStr < end);
  }

  return { events, loading, error, isBlocked };
}
