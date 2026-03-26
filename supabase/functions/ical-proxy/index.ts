// Supabase Edge Function: ical-proxy
// Fetches an iCal (.ics) URL server-side (avoids CORS), parses VEVENT blocks,
// and returns blocked date ranges as JSON.
//
// Deploy: supabase functions deploy ical-proxy
// Set secret: supabase secrets set CASA_RETO_ICAL_URL="https://www.airbnb.com/calendar/ical/..."

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function parseDate(raw: string): string | null {
  // Handles DTSTART;VALUE=DATE:20240101 or DTSTART:20240101T000000Z
  const m = raw.match(/(\d{8})/);
  if (!m) return null;
  const d = m[1];
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
}

function parseIcal(text: string) {
  const events: { start: string; end: string }[] = [];
  const blocks = text.split('BEGIN:VEVENT');

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const startLine = block.match(/DTSTART[^:]*:([^\r\n]+)/)?.[1];
    const endLine   = block.match(/DTEND[^:]*:([^\r\n]+)/)?.[1];
    const start = startLine ? parseDate(startLine) : null;
    const end   = endLine   ? parseDate(endLine)   : null;
    if (start && end) events.push({ start, end });
  }

  return events;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    // Accept URL from POST body or query param (fallback: env var)
    let icalUrl: string | null = null;

    if (req.method === 'POST') {
      try {
        const body = await req.json();
        icalUrl = body?.url ?? null;
      } catch { /* ignore */ }
    }

    if (!icalUrl) {
      const qp = new URL(req.url).searchParams.get('url');
      icalUrl = qp;
    }

    if (!icalUrl) {
      icalUrl = Deno.env.get('CASA_RETO_ICAL_URL') ?? null;
    }

    if (!icalUrl) {
      return new Response(JSON.stringify({ error: 'No iCal URL provided' }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(icalUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HansAmonn/1.0)' },
    });

    if (!res.ok) throw new Error(`iCal fetch failed: HTTP ${res.status}`);

    const text   = await res.text();
    const events = parseIcal(text);

    return new Response(JSON.stringify({ events }), {
      headers: {
        ...CORS,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=1800', // cache 30 min
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
