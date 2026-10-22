// Supabase Edge Function: send-email
// Sends transactional emails via Resend (https://resend.com — free: 100/day)
//
// Deploy:  supabase functions deploy send-email --project-ref teioztcidolgyqlwzlrb
// Secret:  supabase secrets set RESEND_API_KEY="re_..." --project-ref teioztcidolgyqlwzlrb
//          supabase secrets set FROM_EMAIL="noreply@yourdomain.com" (must be verified in Resend)
//          supabase secrets set NOTIFICATION_EMAIL="office@reto-amonn.ch"

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Only our own sites may call this function from a browser.
// Optional secret: ALLOWED_ORIGINS="https://www.hansamonn.ch,https://hansamonn.ch"
const ALLOWED = (Deno.env.get('ALLOWED_ORIGINS') ?? 'https://www.hansamonn.ch,https://hansamonn.ch')
  .split(',').map((o) => o.trim()).filter(Boolean);
const isAllowedOrigin = (origin: string | null) =>
  !!origin && (ALLOWED.includes(origin) || /^https:\/\/hansamonn-website[a-z0-9-]*\.vercel\.app$/.test(origin) || origin.startsWith('http://localhost'));

const EMAIL_RE = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;

const cors = (origin: string | null) => ({
  'Access-Control-Allow-Origin': isAllowedOrigin(origin) ? origin! : ALLOWED[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  Vary: 'Origin',
});

serve(async (req) => {
  const origin = req.headers.get('origin');
  const CORS = cors(origin);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (!isAllowedOrigin(origin)) return new Response('Forbidden', { status: 403, headers: CORS });

  try {
    const { to, subject, html, replyTo } = await req.json();

    const apiKey  = Deno.env.get('RESEND_API_KEY');
    const from    = Deno.env.get('FROM_EMAIL') ?? 'Hans Amonn AG <onboarding@resend.dev>';
    const notifyTo = to ?? Deno.env.get('NOTIFICATION_EMAIL');

    // One valid recipient, bounded content: no open relay for arbitrary mass mail
    if (!notifyTo || typeof notifyTo !== 'string' || !EMAIL_RE.test(notifyTo)) {
      throw new Error('Invalid or missing recipient (set NOTIFICATION_EMAIL)');
    }
    if ((subject && String(subject).length > 200) || (html && String(html).length > 60000)) {
      throw new Error('Message too large');
    }
    if (replyTo && (typeof replyTo !== 'string' || !EMAIL_RE.test(replyTo))) {
      throw new Error('Invalid reply-to');
    }

    if (!apiKey) {
      // No API key configured — log and return success silently
      console.warn('RESEND_API_KEY not set — email not sent');
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [notifyTo],
        subject: subject ?? 'Neue Nachricht – Hans Amonn AG',
        html: html ?? '<p>Neue Anfrage eingegangen.</p>',
        reply_to: replyTo ?? undefined,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error ${res.status}: ${err}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('send-email error:', err);
    // Return success anyway — don't fail the form submission because of email
    return new Response(JSON.stringify({ success: false, error: (err as Error).message }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
