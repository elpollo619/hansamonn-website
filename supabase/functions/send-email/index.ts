// Supabase Edge Function: send-email
// Sends transactional emails via Resend (https://resend.com — free: 100/day)
//
// Deploy:  supabase functions deploy send-email --project-ref teioztcidolgyqlwzlrb
// Secret:  supabase secrets set RESEND_API_KEY="re_..." --project-ref teioztcidolgyqlwzlrb
//          supabase secrets set FROM_EMAIL="noreply@yourdomain.com" (must be verified in Resend)
//          supabase secrets set NOTIFICATION_EMAIL="office@reto-amonn.ch"

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const { to, subject, html, replyTo } = await req.json();

    const apiKey  = Deno.env.get('RESEND_API_KEY');
    const from    = Deno.env.get('FROM_EMAIL') ?? 'Hans Amonn AG <noreply@hansamonn.ch>';
    const notifyTo = to ?? Deno.env.get('NOTIFICATION_EMAIL') ?? 'office@reto-amonn.ch';

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
