/**
 * Website assistant, AI mode (Vercel Serverless Function).
 *
 * Off by default: it only answers when ANTHROPIC_API_KEY is set in the Vercel project.
 * Without the key, GET reports { ai: false } and the browser keeps using its local answers.
 *
 * POST body: { messages: MessageParam[] }  (the conversation as returned by earlier turns)
 * Response: Server-Sent Events
 *   data: {"type":"text","text":"…"}            streamed answer text
 *   data: {"type":"status","text":"…"}          short progress note (e.g. checking the calendar)
 *   data: {"type":"done","turn":[…]}           messages to append to the history for the next request
 *   data: {"type":"error","code":"…"}          the browser falls back to its local answers
 */
/* global process */
import Anthropic from '@anthropic-ai/sdk';
import { knowledgeText, ALLOWED_LINKS, CASA_RETO } from '../src/data/assistantKnowledge.js';

export const config = { maxDuration: 60 };

const MODEL = 'claude-opus-5-5';
const MAX_MESSAGES = 40; // includes tool exchanges and date notes
const MAX_USER_CHARS = 1000;
const MAX_BODY_BYTES = 120_000;
const RATE = { windowMs: 10 * 60 * 1000, max: 30 }; // requests per IP per window, per function instance

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;

const SYSTEM = `Sie sind der Website-Assistent der Hans Amonn AG auf www.hansamonn.ch. Sie beantworten Fragen von Besucherinnen und Besuchern zu den Angeboten und zum Unternehmen: möblierte Zimmer (Long Stay), das N's Hotel in Kerzers, das Ferienhaus Casa Reto im Tessin, Wohnungen, Verkauf und die Architekturleistungen von AMONN ARCHITEKTUR.

So antworten Sie:
- In der Sprache der letzten Nachricht der Person. Auf Deutsch mit «Sie» und Schweizer Rechtschreibung (ss statt ß).
- Kurz und konkret: zwei bis vier Sätze oder eine kurze Liste mit «- ». Keine Überschriften, keine Tabellen, keine Emojis.
- Nur mit Fakten aus der Referenz unten. Steht etwas nicht darin (zum Beispiel ein Preis, ein freies Zimmer, ein Name, eine Frist), sagen Sie offen, dass Sie es nicht wissen, und nennen Sie den passenden Kontaktweg. Erfinden Sie nichts.
- Sie können nichts buchen, reservieren oder bestätigen. Verbindlich sind nur Bestätigungen der Hans Amonn AG oder der Buchungsplattform.
- Verfügbarkeit: Für die Casa Reto prüfen Sie Daten mit dem Werkzeug casa_reto_verfuegbarkeit und erwähnen, dass es der Airbnb-Kalender ist und die Hans Amonn AG die Anfrage bestätigt. Für Long Stay und das Hotel können Sie keine Verfügbarkeit prüfen; verweisen Sie auf die Mietanfrage oder die Buchungsseite.
- Links auf diese Website schreiben Sie als Markdown-Link mit einem dieser Pfade: ${ALLOWED_LINKS.join(', ')}. Externe Links nur, wenn sie in der Referenz stehen. Pro Antwort höchstens zwei Links.
- Fragen Sie nicht nach Personendaten wie Name, Geburtsdatum, Ausweis oder Adresse. Möchte jemand eine Anfrage stellen, verweisen Sie auf das passende Formular.
- Bei Themen, die nichts mit der Hans Amonn AG oder ihren Angeboten zu tun haben, sagen Sie freundlich, dass Sie dabei nicht helfen können, und bieten Hilfe zu den Angeboten an.

Referenz (Stand der Website):

${knowledgeText()}`;

const TOOLS = [
  {
    name: 'casa_reto_verfuegbarkeit',
    description:
      'Prüft im Airbnb-Kalender der Casa Reto, ob ein Zeitraum frei ist. Nur für die Casa Reto verwenden. Gibt belegte Nächte im Zeitraum zurück.',
    input_schema: {
      type: 'object',
      properties: {
        anreise: { type: 'string', description: 'Anreisedatum im Format YYYY-MM-DD' },
        abreise: { type: 'string', description: 'Abreisedatum im Format YYYY-MM-DD, nach der Anreise' },
      },
      required: ['anreise', 'abreise'],
      additionalProperties: false,
    },
    strict: true,
    eager_input_streaming: true,
  },
];

// ─── Small helpers ───────────────────────────────────────────────────────────

const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < RATE.windowMs);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > RATE.max;
}

function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // same-origin requests from some browsers omit it
  try {
    const host = new URL(origin).hostname;
    return (
      host === req.headers.host?.split(':')[0] ||
      host === 'hansamonn.ch' || host.endsWith('.hansamonn.ch') ||
      (host.startsWith('hansamonn-website') && host.endsWith('.vercel.app')) ||
      host === 'localhost' || host === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

const DATE_NOTE = /^Heutiges Datum: \d{4}-\d{2}-\d{2}\.$/;
const BLOCK_TYPES = new Set(['text', 'thinking', 'redacted_thinking', 'tool_use', 'tool_result', 'fallback']);

/** Accepts only conversation shapes this function itself produces. */
function validMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) return false;
  for (const m of messages) {
    if (!m || typeof m !== 'object') return false;
    if (m.role === 'system') {
      if (typeof m.content !== 'string' || !DATE_NOTE.test(m.content)) return false;
    } else if (m.role === 'user' || m.role === 'assistant') {
      if (typeof m.content === 'string') {
        if (m.content.length > MAX_USER_CHARS * 2) return false;
      } else if (Array.isArray(m.content)) {
        if (!m.content.every((b) => b && BLOCK_TYPES.has(b.type))) return false;
      } else return false;
    } else return false;
  }
  const last = messages[messages.length - 1];
  return last.role === 'user' && typeof last.content === 'string' && last.content.trim().length > 0 && last.content.length <= MAX_USER_CHARS;
}

/** After a mid-output fallback, earlier thinking and tool-use blocks are not echoed back. */
function echoable(content) {
  const lastFallback = content.map((b) => b.type).lastIndexOf('fallback');
  if (lastFallback < 0) return content;
  return content.filter((b, i) => i > lastFallback || !['thinking', 'redacted_thinking', 'tool_use'].includes(b.type));
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;
async function casaRetoAvailability(input) {
  const { anreise, abreise } = input || {};
  if (!ISO.test(anreise || '') || !ISO.test(abreise || '') || abreise <= anreise) {
    return { ok: false, text: 'Ungültige Daten. Bitte Anreise und Abreise als YYYY-MM-DD angeben, Abreise nach Anreise.' };
  }
  if (!CASA_RETO.icalUrl) return { ok: false, text: 'Der Kalender ist nicht verfügbar.' };
  try {
    const res = await fetch(CASA_RETO.icalUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { ok: false, text: 'Der Kalender konnte nicht geladen werden.' };
    const ics = await res.text();
    const busy = [];
    for (const block of ics.split('BEGIN:VEVENT').slice(1)) {
      const s = block.match(/DTSTART[^:]*:(\d{8})/)?.[1];
      const e = block.match(/DTEND[^:]*:(\d{8})/)?.[1];
      if (!s || !e) continue;
      const start = `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
      const end = `${e.slice(0, 4)}-${e.slice(4, 6)}-${e.slice(6, 8)}`;
      if (start < abreise && end > anreise) busy.push({ von: start, bis: end });
    }
    return {
      ok: true,
      text: busy.length
        ? `Im Zeitraum ${anreise} bis ${abreise} sind laut Airbnb-Kalender belegt: ${busy.map((b) => `${b.von} bis ${b.bis}`).join(', ')}.`
        : `Laut Airbnb-Kalender ist die Casa Reto vom ${anreise} bis ${abreise} frei.`,
    };
  } catch {
    return { ok: false, text: 'Der Kalender konnte nicht geladen werden.' };
  }
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') return res.status(200).json({ ai: Boolean(client) });
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (!client) return res.status(503).json({ error: 'disabled' });
  if (!originAllowed(req)) return res.status(403).json({ error: 'origin' });

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
  if (rateLimited(ip)) return res.status(429).json({ error: 'rate' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (JSON.stringify(body || {}).length > MAX_BODY_BYTES) return res.status(413).json({ error: 'size' });
  const history = body?.messages;
  if (!validMessages(history)) return res.status(400).json({ error: 'messages' });

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'X-Accel-Buffering': 'no',
  });
  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
  const turn = [{ role: 'system', content: `Heutiges Datum: ${today}.` }];
  const messages = [...history, ...turn];

  try {
    for (let round = 0; round < 3; round++) {
      const stream = client.beta.messages.stream({
        model: MODEL,
        max_tokens: 4000,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        output_config: { effort: 'low' },
        cache_control: { type: 'ephemeral' },
        system: SYSTEM,
        tools: TOOLS,
        messages,
      });
      stream.on('text', (text) => send({ type: 'text', text }));
      const final = await stream.finalMessage();

      if (final.stop_reason === 'refusal') {
        send({ type: 'error', code: 'refusal' });
        return res.end();
      }

      const content = echoable(final.content);
      messages.push({ role: 'assistant', content });
      turn.push({ role: 'assistant', content });

      const toolUses = final.content.filter((b) => b.type === 'tool_use');
      if (final.stop_reason !== 'tool_use' || toolUses.length === 0) break;

      send({ type: 'status', text: 'calendar' });
      const results = await Promise.all(
        toolUses.map(async (t) => {
          const r = t.name === 'casa_reto_verfuegbarkeit'
            ? await casaRetoAvailability(t.input)
            : { ok: false, text: 'Unbekanntes Werkzeug.' };
          return { type: 'tool_result', tool_use_id: t.id, content: r.text, is_error: !r.ok };
        }),
      );
      const toolTurn = { role: 'user', content: results };
      messages.push(toolTurn);
      turn.push(toolTurn);
    }
    send({ type: 'done', turn });
  } catch (err) {
    const code = err instanceof Anthropic.RateLimitError ? 'busy'
      : err instanceof Anthropic.AuthenticationError ? 'config'
      : err instanceof Anthropic.BadRequestError ? 'request'
      : err instanceof Anthropic.APIError ? 'api'
      : 'network';
    console.error('assistant error', code, err?.status ?? '');
    send({ type: 'error', code });
  }
  res.end();
}
