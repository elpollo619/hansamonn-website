import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Returns the next free period start date (YYYY-MM-DD) for a property
 * by checking its iCal feed. Returns null while loading or if no URL.
 */
export function useNextFree(icalUrl) {
  const [nextFree, setNextFree] = useState(null);

  useEffect(() => {
    if (!icalUrl) return;
    let cancelled = false;

    supabase.functions
      .invoke('ical-proxy', { body: { url: icalUrl } })
      .then(({ data }) => {
        if (cancelled || !data?.events?.length) return;

        const today = new Date().toISOString().split('T')[0];

        // Build sorted list of blocked ranges
        const ranges = data.events
          .map(e => ({ start: e.start, end: e.end }))
          .filter(e => e.end > today)
          .sort((a, b) => a.start.localeCompare(b.start));

        // Walk from today forward to find first gap of >= 2 days
        let cursor = today;
        for (const r of ranges) {
          if (r.start > cursor) {
            // Gap found — cursor to r.start is free
            setNextFree(cursor === today ? null : cursor); // if free now, don't show banner
            return;
          }
          if (r.end > cursor) cursor = r.end;
        }
        // After all ranges — free from cursor
        if (cursor > today) setNextFree(cursor);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [icalUrl]);

  return nextFree;
}
