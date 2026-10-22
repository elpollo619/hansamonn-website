import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, ExternalLink, Loader2, Mail, MessageCircle, Phone, RotateCcw, Send, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { supabase } from '@/lib/supabase';
import { getSetting } from '@/data/settingsStore';
import { ALLOWED_LINKS, CASA_RETO, COMPANY, HOTEL } from '@/data/assistantKnowledge';
import { answer, availabilityText, chipsFor, pageSubject, subjectOf } from '@/lib/assistantEngine';

/**
 * Chat panel of the website assistant (loaded on first use, see VirtualAgent).
 * Answers from the website's own facts in the browser (assistantEngine). When the AI mode is
 * switched on in Vercel (ANTHROPIC_API_KEY), free-text questions go to /api/assistant instead;
 * chips and any failure still use the local answers.
 */

const STORE_KEY = 'ha_assistant_v1';
const AI_KEY = 'ha_assistant_ai';
const MAX_INPUT = 1000;

const UI = {
  de: {
    close: 'Chat schliessen', title: 'Fragen an Hans Amonn AG',
    modeLocal: 'Sofortantworten aus den Angaben dieser Website', modeAi: 'KI-Assistent: Antworten können Fehler enthalten',
    restart: 'Neues Gespräch', placeholder: 'Ihre Frage …', send: 'Senden', inputLabel: 'Ihre Frage an den Assistenten',
    call: 'Anrufen', whatsapp: 'WhatsApp', email: 'E-Mail', calendar: 'Ich prüfe den Kalender …', typing: 'Antwort wird geschrieben',
    note: 'Automatische Antworten ohne Gewähr. Bitte keine Personendaten eingeben.', privacy: 'Datenschutz',
    you: 'Sie', bot: 'Assistent', suggestions: 'Vorschläge', log: 'Gesprächsverlauf',
    mailSubject: 'Frage über den Website-Chat', mailIntro: 'Guten Tag\n\nIch habe eine Frage. Hier der bisherige Chat:', waIntro: 'Guten Tag, ich habe eine Frage:',
    welcome: {
      general: "Guten Tag! Ich beantworte Fragen zu unseren möblierten Zimmern, zum N's Hotel, zur Casa Reto und zu unseren Bauprojekten.",
      ls: 'Guten Tag! Fragen zu unseren möblierten Zimmern (Long Stay)? Preise, Ausstattung und Anfrage erkläre ich gern.',
      hotel: "Guten Tag! Fragen zum N's Hotel in Kerzers? Preise, Buchung und Parkplätze erkläre ich gern.",
      cr: 'Guten Tag! Fragen zur Casa Reto? Schreiben Sie mir Ihre Reisedaten, dann prüfe ich den Kalender.',
      arch: 'Guten Tag! Fragen zu Ihrem Bauvorhaben oder zu unseren Projekten?',
    },
  },
  en: {
    close: 'Close chat', title: 'Ask Hans Amonn AG',
    modeLocal: 'Instant answers from the facts on this website', modeAi: 'AI assistant: answers may contain mistakes',
    restart: 'New conversation', placeholder: 'Your question …', send: 'Send', inputLabel: 'Your question to the assistant',
    call: 'Call', whatsapp: 'WhatsApp', email: 'E-mail', calendar: 'Checking the calendar …', typing: 'Writing an answer',
    note: 'Automatic answers without guarantee. Please do not enter personal data.', privacy: 'Privacy',
    you: 'You', bot: 'Assistant', suggestions: 'Suggestions', log: 'Conversation',
    mailSubject: 'Question from the website chat', mailIntro: 'Hello\n\nI have a question. Here is the chat so far:', waIntro: 'Hello, I have a question:',
    welcome: {
      general: "Hello! I answer questions about our furnished rooms, N's Hotel, Casa Reto and our building projects.",
      ls: 'Hello! Questions about our furnished rooms (Long Stay)? I can explain prices, what is included and how to apply.',
      hotel: "Hello! Questions about N's Hotel in Kerzers? I can explain prices, booking and parking.",
      cr: 'Hello! Questions about Casa Reto? Tell me your travel dates and I will check the calendar.',
      arch: 'Hello! Questions about your building project or our work?',
    },
  },
  fr: {
    close: 'Fermer le chat', title: 'Questions à Hans Amonn AG',
    modeLocal: 'Réponses immédiates tirées de ce site', modeAi: 'Assistant IA : les réponses peuvent contenir des erreurs',
    restart: 'Nouvelle conversation', placeholder: 'Votre question …', send: 'Envoyer', inputLabel: 'Votre question à l’assistant',
    call: 'Appeler', whatsapp: 'WhatsApp', email: 'E-mail', calendar: 'Je vérifie le calendrier …', typing: 'Réponse en cours',
    note: 'Réponses automatiques sans garantie. N’indiquez pas de données personnelles.', privacy: 'Protection des données',
    you: 'Vous', bot: 'Assistant', suggestions: 'Suggestions', log: 'Conversation',
    mailSubject: 'Question depuis le chat du site', mailIntro: 'Bonjour\n\nJ’ai une question. Voici le chat :', waIntro: 'Bonjour, j’ai une question :',
    welcome: {
      general: "Bonjour ! Je réponds aux questions sur nos chambres meublées, le N's Hotel, la Casa Reto et nos projets de construction.",
      ls: 'Bonjour ! Des questions sur nos chambres meublées (Long Stay) ? Prix, équipement, demande : je vous explique.',
      hotel: "Bonjour ! Des questions sur le N's Hotel à Kerzers ? Prix, réservation, parking : je vous explique.",
      cr: 'Bonjour ! Des questions sur la Casa Reto ? Indiquez-moi vos dates et je vérifie le calendrier.',
      arch: 'Bonjour ! Des questions sur votre projet de construction ou nos réalisations ?',
    },
  },
  it: {
    close: 'Chiudi la chat', title: 'Domande a Hans Amonn AG',
    modeLocal: 'Risposte immediate dai dati di questo sito', modeAi: 'Assistente IA: le risposte possono contenere errori',
    restart: 'Nuova conversazione', placeholder: 'La sua domanda …', send: 'Invia', inputLabel: 'La sua domanda all’assistente',
    call: 'Chiamare', whatsapp: 'WhatsApp', email: 'E-mail', calendar: 'Controllo il calendario …', typing: 'Risposta in corso',
    note: 'Risposte automatiche senza garanzia. Non inserisca dati personali.', privacy: 'Privacy',
    you: 'Lei', bot: 'Assistente', suggestions: 'Suggerimenti', log: 'Conversazione',
    mailSubject: 'Domanda dalla chat del sito', mailIntro: 'Buongiorno\n\nHo una domanda. Ecco la chat:', waIntro: 'Buongiorno, ho una domanda:',
    welcome: {
      general: "Buongiorno! Rispondo a domande sulle camere arredate, il N's Hotel, la Casa Reto e i nostri progetti.",
      ls: 'Buongiorno! Domande sulle camere arredate (Long Stay)? Le spiego prezzi, dotazioni e richiesta.',
      hotel: "Buongiorno! Domande sul N's Hotel a Kerzers? Le spiego prezzi, prenotazione e parcheggio.",
      cr: 'Buongiorno! Domande sulla Casa Reto? Mi scriva le date e controllo il calendario.',
      arch: 'Buongiorno! Domande sul suo progetto edilizio o sui nostri lavori?',
    },
  },
  es: {
    close: 'Cerrar el chat', title: 'Preguntas a Hans Amonn AG',
    modeLocal: 'Respuestas inmediatas con los datos de esta web', modeAi: 'Asistente de IA: las respuestas pueden contener errores',
    restart: 'Nueva conversación', placeholder: 'Su pregunta …', send: 'Enviar', inputLabel: 'Su pregunta al asistente',
    call: 'Llamar', whatsapp: 'WhatsApp', email: 'E-mail', calendar: 'Compruebo el calendario …', typing: 'Escribiendo la respuesta',
    note: 'Respuestas automáticas sin garantía. No introduzca datos personales.', privacy: 'Privacidad',
    you: 'Usted', bot: 'Asistente', suggestions: 'Sugerencias', log: 'Conversación',
    mailSubject: 'Pregunta desde el chat de la web', mailIntro: 'Buenos días\n\nTengo una pregunta. Este es el chat:', waIntro: 'Buenos días, tengo una pregunta:',
    welcome: {
      general: "¡Hola! Respondo preguntas sobre nuestras habitaciones amuebladas, el N's Hotel, la Casa Reto y nuestros proyectos.",
      ls: '¡Hola! ¿Preguntas sobre nuestras habitaciones amuebladas (Long Stay)? Le explico precios, qué incluye y la solicitud.',
      hotel: "¡Hola! ¿Preguntas sobre el N's Hotel en Kerzers? Le explico precios, reserva y aparcamiento.",
      cr: '¡Hola! ¿Preguntas sobre la Casa Reto? Escríbame sus fechas y compruebo el calendario.',
      arch: '¡Hola! ¿Preguntas sobre su proyecto de obra o nuestros trabajos?',
    },
  },
  pt: {
    close: 'Fechar o chat', title: 'Perguntas à Hans Amonn AG',
    modeLocal: 'Respostas imediatas com os dados deste site', modeAi: 'Assistente de IA: as respostas podem conter erros',
    restart: 'Nova conversa', placeholder: 'A sua pergunta …', send: 'Enviar', inputLabel: 'A sua pergunta ao assistente',
    call: 'Ligar', whatsapp: 'WhatsApp', email: 'E-mail', calendar: 'Estou a verificar o calendário …', typing: 'A escrever a resposta',
    note: 'Respostas automáticas sem garantia. Não introduza dados pessoais.', privacy: 'Privacidade',
    you: 'Você', bot: 'Assistente', suggestions: 'Sugestões', log: 'Conversa',
    mailSubject: 'Pergunta a partir do chat do site', mailIntro: 'Bom dia\n\nTenho uma pergunta. Eis o chat:', waIntro: 'Bom dia, tenho uma pergunta:',
    welcome: {
      general: "Olá! Respondo a perguntas sobre os nossos quartos mobilados, o N's Hotel, a Casa Reto e os nossos projetos.",
      ls: 'Olá! Dúvidas sobre os quartos mobilados (Long Stay)? Explico preços, o que está incluído e o pedido.',
      hotel: "Olá! Dúvidas sobre o N's Hotel em Kerzers? Explico preços, reserva e estacionamento.",
      cr: 'Olá! Dúvidas sobre a Casa Reto? Diga-me as datas e verifico o calendário.',
      arch: 'Olá! Dúvidas sobre o seu projeto de construção ou os nossos trabalhos?',
    },
  },
};

const WELCOME_GROUP = { ls: 'ls', kerzers: 'ls', muenchenbuchsee: 'ls', muri: 'ls', hotel: 'hotel', cr: 'cr', arch: 'arch' };

// External links the AI answers may show as links (everything else stays plain text)
const EXTERNAL_HOSTS = new Set(
  [...HOTEL.booking, ...CASA_RETO.booking].map((b) => { try { return new URL(b.url).hostname; } catch { return null; } }).filter(Boolean),
);
const internalAllowed = (href) => ALLOWED_LINKS.includes(href) || ALLOWED_LINKS.includes(href.split('#')[0]);

const todayZurich = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
let idSeq = 0;
const newId = () => `${Date.now().toString(36)}${(idSeq++).toString(36)}`;
const freshConversation = () => ({ messages: [{ id: 'welcome', role: 'bot', welcome: true }], api: [], ctx: { subject: null, lang: null, lastIntent: null } });

function loadConversation() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null');
    if (saved && Array.isArray(saved.messages) && saved.messages.length) return { api: [], ctx: {}, ...saved };
  } catch { /* storage blocked or invalid */ }
  return freshConversation();
}

/** Keeps the AI history within the server limits, cutting only at a plain user question. */
function trimHistory(history) {
  const startsTurn = (m) => m.role === 'user' && typeof m.content === 'string';
  let h = history;
  while (h.length > 30 || JSON.stringify(h).length > 100_000) {
    const next = h.findIndex((m, i) => i > 0 && startsTurn(m));
    if (next <= 0) break;
    h = h.slice(next);
  }
  return h;
}

async function bookedRanges(stay) {
  if (!CASA_RETO.icalUrl) return null;
  try {
    const call = supabase.functions.invoke('ical-proxy', { body: { url: CASA_RETO.icalUrl } });
    const timeout = new Promise((resolve) => setTimeout(() => resolve({ error: 'timeout' }), 9000));
    const { data, error } = await Promise.race([call, timeout]);
    if (error || !data) return null;
    return (data.events || [])
      .filter((ev) => ev.start < stay.to && ev.end > stay.from)
      .sort((a, b) => a.start.localeCompare(b.start));
  } catch {
    return null;
  }
}

// ─── Text rendering (a small, safe subset of Markdown) ─────────────────────────

const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)|(\+41[\d\s()]{8,18}\d)/g;

function Inline({ text, onNavigate }) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${m.index}`;
    const linkCls = 'font-semibold text-[#1F497D] underline decoration-[#1F497D]/40 underline-offset-2 hover:decoration-[#1F497D]';
    if (m[1]) {
      const [label, href] = [m[1], m[2]];
      if (href.startsWith('/') && internalAllowed(href)) {
        out.push(<Link key={key} to={href} onClick={onNavigate} className={linkCls}>{label}</Link>);
      } else {
        let host = null;
        try { host = new URL(href).hostname; } catch { /* not a URL */ }
        out.push(host && EXTERNAL_HOSTS.has(host)
          ? <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>{label}</a>
          : label);
      }
    } else if (m[3]) {
      out.push(<strong key={key} className="font-semibold">{m[3]}</strong>);
    } else if (m[4]) {
      out.push(<a key={key} href={`mailto:${m[4]}`} className={`${linkCls} break-all`}>{m[4]}</a>);
    } else if (m[5]) {
      out.push(<a key={key} href={`tel:${m[5].replace(/[^\d+]/g, '').replace('+410', '+41')}`} className={`${linkCls} whitespace-nowrap`}>{m[5]}</a>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function RichText({ text, onNavigate }) {
  const blocks = [];
  let list = null;
  text.split('\n').forEach((raw, i) => {
    const line = raw.trimEnd();
    const item = line.match(/^\s*(?:[-*•]|\d+\.)\s+(.*)$/);
    if (item) {
      if (!list) { list = []; blocks.push({ list, key: i }); }
      list.push(item[1]);
      return;
    }
    list = null;
    if (line.trim()) blocks.push({ p: line, key: i });
  });
  return blocks.map((b) => (b.list
    ? (
      <ul key={b.key} className="my-1.5 space-y-1 pl-4 list-disc marker:text-[#1F497D]">
        {b.list.map((li, j) => <li key={j}><Inline text={li} onNavigate={onNavigate} /></li>)}
      </ul>
    )
    : <p key={b.key} className="[&:not(:first-child)]:mt-2"><Inline text={b.p} onNavigate={onNavigate} /></p>));
}

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16.004c0 2.352.627 4.643 1.816 6.653L2.667 29.333l6.89-1.787a13.27 13.27 0 0 0 6.447 1.654h.004c7.364 0 13.325-5.973 13.325-13.337 0-7.364-5.961-13.196-13.329-13.196zm0 24.267a11.04 11.04 0 0 1-5.63-1.543l-.403-.24-4.086 1.059 1.085-3.963-.264-.416A11.017 11.017 0 0 1 5 16.004c0-6.072 4.932-11.004 11.004-11.004 6.073 0 11.005 4.932 11.005 11.004 0 6.073-4.932 11.004-11.005 11.004v-.074zm6.04-8.25c-.331-.165-1.957-.965-2.261-1.075-.304-.11-.525-.165-.747.165-.22.33-.855 1.075-1.046 1.297-.193.22-.385.247-.716.083-.33-.165-1.397-.516-2.66-1.64-.984-.875-1.648-1.956-1.84-2.287-.193-.33-.02-.51.145-.675.15-.148.33-.385.496-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.747-1.804-1.023-2.47-.27-.647-.543-.56-.747-.57-.193-.01-.413-.013-.633-.013-.22 0-.578.083-.88.413-.303.33-1.155 1.128-1.155 2.752 0 1.624 1.183 3.193 1.348 3.413.165.22 2.326 3.549 5.637 4.975.788.341 1.403.544 1.882.697.79.25 1.51.215 2.079.13.634-.094 1.957-.8 2.233-1.572.276-.77.276-1.43.193-1.572-.082-.14-.302-.22-.634-.385z" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function AssistantPanel({ open, onClose, panelId }) {
  const { lang: siteLang } = useTranslation();
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const ui = UI[siteLang] || UI.de;

  const [conv, setConv] = useState(loadConversation);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(null);
  const [announce, setAnnounce] = useState('');
  const [aiMode, setAiMode] = useState(() => {
    try { const v = sessionStorage.getItem(AI_KEY); return v === null ? null : v === '1'; } catch { return null; }
  });

  const convRef = useRef(conv);
  convRef.current = conv;
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const abortRef = useRef(null);
  const titleId = useId();

  const page = pageSubject(pathname);
  const subject = conv.ctx.subject || page;

  // Save the conversation for this browser tab
  useEffect(() => {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(conv)); } catch { /* storage full or blocked */ }
  }, [conv]);

  // Ask once per tab whether the AI mode is switched on
  useEffect(() => {
    if (!open || aiMode !== null) return;
    let cancelled = false;
    fetch('/api/assistant', { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok && (r.headers.get('content-type') || '').includes('json') ? r.json() : { ai: false }))
      .catch(() => ({ ai: false }))
      .then((d) => {
        if (cancelled) return;
        const on = d?.ai === true;
        setAiMode(on);
        try { sessionStorage.setItem(AI_KEY, on ? '1' : '0'); } catch { /* ignore */ }
      });
    return () => { cancelled = true; };
  }, [open, aiMode]);

  // Focus: the input on desktop, the dialog itself on touch screens (no keyboard popping up)
  useEffect(() => {
    if (!open) return;
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    const t = setTimeout(() => (coarse ? panelRef.current : inputRef.current)?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  // Phones: the chat is a full-screen sheet, so the page behind must not scroll
  useEffect(() => {
    if (!open || !window.matchMedia?.('(max-width: 639px)').matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Keep the newest message in view
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conv.messages, status, busy, open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const close = onClose;

  const onNavigate = useCallback(() => {
    if (window.matchMedia?.('(max-width: 639px)').matches) onClose();
  }, [onClose]);

  const update = (fn) => setConv((c) => fn(c));
  const pushMessage = (m) => update((c) => ({ ...c, messages: [...c.messages, m] }));
  const patchMessage = (id, patch) => update((c) => ({ ...c, messages: c.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
  const dropMessage = (id) => update((c) => ({ ...c, messages: c.messages.filter((m) => m.id !== id) }));

  /** Streams an answer from /api/assistant. Returns false when the local answers should take over. */
  async function askAi(question) {
    const history = trimHistory([...convRef.current.api, { role: 'user', content: question }]);
    const controller = new AbortController();
    abortRef.current = controller;
    let res;
    try {
      res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
    } catch {
      return false;
    }
    if (!res.ok || !res.body) {
      if (res.status === 503) setAiMode(false);
      return false;
    }

    const id = newId();
    let text = '';
    let turn = null;
    let failed = false;
    let shown = false;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let cut;
        while ((cut = buf.indexOf('\n\n')) >= 0) {
          const line = buf.slice(0, cut).split('\n').find((l) => l.startsWith('data: '));
          buf = buf.slice(cut + 2);
          if (!line) continue;
          let ev;
          try { ev = JSON.parse(line.slice(6)); } catch { continue; }
          if (ev.type === 'text') {
            text += ev.text;
            if (!shown) { shown = true; setStatus(null); pushMessage({ id, role: 'bot', text, streaming: true }); }
            else patchMessage(id, { text });
          } else if (ev.type === 'status') {
            if (text && !/\s$/.test(text)) text += '\n\n';
            setStatus('calendar');
          } else if (ev.type === 'done') {
            turn = ev.turn;
          } else if (ev.type === 'error') {
            failed = true;
            if (ev.code === 'config') setAiMode(false);
          }
        }
      }
    } catch {
      failed = true;
    }
    setStatus(null);
    if (failed || !Array.isArray(turn) || !text.trim()) {
      if (shown) dropMessage(id);
      return false;
    }
    patchMessage(id, { text: text.trim(), streaming: false });
    const named = subjectOf(question);
    update((c) => ({ ...c, api: [...history, ...turn], ctx: { ...c.ctx, subject: named || c.ctx.subject } }));
    setAnnounce(text.trim());
    return true;
  }

  async function send(raw, chip = null) {
    const question = (chip ? chip.label : raw).trim().slice(0, MAX_INPUT);
    if (!question || busy) return;
    setBusy(true);
    setInput('');
    pushMessage({ id: newId(), role: 'user', text: question });

    if (aiMode && !chip && (await askAi(question))) {
      setBusy(false);
      return;
    }

    // Local answer (a short pause reads more naturally than an instant wall of text)
    const ctx = { ...convRef.current.ctx, lang: convRef.current.ctx.lang || siteLang, path: pathname, today: todayZurich() };
    let a = answer(question, ctx, chip ? { subject: chip.subject, intent: chip.intent } : null);
    if (a.check) {
      setStatus('calendar');
      const busyRanges = await bookedRanges(a.check);
      setStatus(null);
      a = { ...availabilityText(a.check, busyRanges, a.lang), intent: 'avail', lang: a.lang };
    } else if (!reduceMotion) {
      await new Promise((r) => setTimeout(r, 380));
    }
    pushMessage({ id: newId(), role: 'bot', text: a.text, links: a.links || [] });
    update((c) => ({
      ...c,
      ctx: { subject: a.subject ?? c.ctx.subject, lang: a.lang || c.ctx.lang, lastIntent: a.intent || null },
      // with the AI mode on, the AI sees the local answers too and can build on them
      api: aiMode ? trimHistory([...c.api, { role: 'user', content: question }, { role: 'assistant', content: [{ type: 'text', text: a.text }] }]) : c.api,
    }));
    setAnnounce(a.text);
    setBusy(false);
  }

  function restart() {
    abortRef.current?.abort();
    setBusy(false);
    setStatus(null);
    setInput('');
    setConv(freshConversation());
    inputRef.current?.focus();
  }

  const onSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  const onInputKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };

  // Grow the input with its text, up to four lines
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input, open]);

  // Hand-over to a person, with the conversation so far
  const transcript = conv.messages
    .filter((m) => !m.welcome && m.text)
    .map((m) => `${m.role === 'user' ? ui.you : ui.bot}: ${m.text}`)
    .join('\n\n');
  const lastQuestion = [...conv.messages].reverse().find((m) => m.role === 'user')?.text;
  const waNumber = (getSetting('whatsappNumber') || COMPANY.whatsapp).replace(/\D/g, '');
  const waText = lastQuestion ? `${ui.waIntro} ${lastQuestion}` : getSetting('whatsappMessage');
  const mailBody = transcript ? `${ui.mailIntro}\n\n${transcript.slice(-1500)}` : '';
  const mailHref = `mailto:${COMPANY.email}?subject=${encodeURIComponent(ui.mailSubject)}${mailBody ? `&body=${encodeURIComponent(mailBody)}` : ''}`;

  const lastBotIndex = conv.messages.map((m) => m.role).lastIndexOf('bot');
  const chips = !busy ? chipsFor(subject, conv.ctx.lang || siteLang) : [];
  const welcomeText = ui.welcome[WELCOME_GROUP[page] || 'general'];
  const motionProps = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 16 }, transition: { duration: 0.2, ease: 'easeOut' } };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          tabIndex={-1}
          onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } }}
          {...motionProps}
          className="floating-raise-panel fixed inset-0 z-[60] flex flex-col bg-white outline-none sm:inset-auto sm:bottom-[5.25rem] sm:right-6 sm:h-[min(640px,calc(100vh-7.5rem))] sm:w-[400px] sm:border sm:border-gray-200 sm:shadow-[0_24px_60px_-16px_rgba(18,29,43,0.35)]"
        >
          {/* Header */}
          <div className="flex items-start gap-3 border-b border-gray-200 px-4 py-3" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-[#1F497D] text-white" aria-hidden="true">
              <MessageCircle size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="text-base font-semibold leading-snug text-[#121D2B]">{ui.title}</h2>
              <p className="text-xs leading-snug text-gray-500">{aiMode ? ui.modeAi : ui.modeLocal}</p>
            </div>
            <button
              type="button"
              onClick={restart}
              aria-label={ui.restart}
              title={ui.restart}
              className="flex h-10 w-10 shrink-0 items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#121D2B]"
            >
              <RotateCcw size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={close}
              aria-label={ui.close}
              className="-mr-1 flex h-10 w-10 shrink-0 items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#121D2B]"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {/* A person, one tap away */}
          <div className="grid grid-cols-3 border-b border-gray-200 text-sm font-semibold text-[#121D2B]">
            <a href={COMPANY.phoneHref} className="flex items-center justify-center gap-1.5 py-2.5 transition-colors hover:bg-gray-50 hover:text-[#1F497D]">
              <Phone size={15} className="text-[#1F497D]" aria-hidden="true" /> {ui.call}
            </a>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 border-x border-gray-200 py-2.5 transition-colors hover:bg-gray-50 hover:text-[#1F497D]"
            >
              <WhatsAppIcon className="text-[#1F497D]" /> {ui.whatsapp}
            </a>
            <a href={mailHref} className="flex items-center justify-center gap-1.5 py-2.5 transition-colors hover:bg-gray-50 hover:text-[#1F497D]">
              <Mail size={15} className="text-[#1F497D]" aria-hidden="true" /> {ui.email}
            </a>
          </div>

          {/* Conversation */}
          <div ref={logRef} role="log" aria-label={ui.log} className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-gray-50 px-4 py-4 text-[15px] leading-relaxed">
            {conv.messages.map((m, i) => (
              m.role === 'user' ? (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] whitespace-pre-wrap break-words bg-[#1F497D] px-3.5 py-2.5 text-white">
                    <span className="sr-only">{ui.you}: </span>{m.text}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="max-w-[94%]">
                  <div className="break-words border border-gray-200 bg-white px-3.5 py-2.5 text-[#121D2B]">
                    <span className="sr-only">{ui.bot}: </span>
                    <RichText text={m.welcome ? welcomeText : m.text} onNavigate={onNavigate} />
                    {m.streaming && <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-[#1F497D]/60" aria-hidden="true" />}
                  </div>
                  {m.links?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.links.slice(0, 3).map((l) => (l.external ? (
                        <a key={l.to} href={l.to} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 border border-[#1F497D]/30 bg-white px-3 py-1.5 text-sm font-semibold text-[#1F497D] transition-colors hover:border-[#1F497D]">
                          {l.label} <ExternalLink size={13} aria-hidden="true" />
                        </a>
                      ) : (
                        <Link key={l.to} to={l.to} onClick={onNavigate} className="inline-flex items-center gap-1.5 border border-[#1F497D]/30 bg-white px-3 py-1.5 text-sm font-semibold text-[#1F497D] transition-colors hover:border-[#1F497D]">
                          {l.label} <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                      )))}
                    </div>
                  )}
                  {i === lastBotIndex && chips.length > 0 && (
                    <div className="mt-3" role="group" aria-label={ui.suggestions}>
                      <div className="flex flex-wrap gap-2">
                        {chips.map((c) => (
                          <button
                            key={`${c.subject}-${c.intent}`}
                            type="button"
                            onClick={() => send('', c)}
                            className="border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-[#1F497D] hover:text-[#1F497D]"
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            ))}

            {busy && !conv.messages[conv.messages.length - 1]?.streaming && (
              <div className="inline-flex items-center gap-2 border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-500">
                {status === 'calendar' ? (
                  <><Loader2 size={15} className="animate-spin text-[#1F497D]" aria-hidden="true" /> {ui.calendar}</>
                ) : (
                  <>
                    <span className="sr-only">{ui.typing}</span>
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400" style={{ animationDelay: `${d * 150}ms` }} aria-hidden="true" />
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Only finished answers are read out, not every streamed word */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">{announce}</div>

          {/* Input */}
          <form onSubmit={onSubmit} className="border-t border-gray-200 bg-white px-3 pt-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
            <div className="flex items-end gap-2">
              <label htmlFor={`${panelId}-input`} className="sr-only">{ui.inputLabel}</label>
              <textarea
                id={`${panelId}-input`}
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_INPUT}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onInputKey}
                placeholder={ui.placeholder}
                className="min-h-[44px] flex-1 resize-none border border-gray-300 px-3 py-2.5 text-base leading-snug text-[#121D2B] placeholder:text-gray-400 focus:border-[#1F497D] focus:outline-none focus:ring-2 focus:ring-[#1F497D]/20 sm:text-[15px]"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                aria-label={ui.send}
                className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#1F497D] text-white transition-colors hover:bg-[#173963] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                <Send size={16} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-xs leading-snug text-gray-500">
              {ui.note}{' '}
              <Link to="/datenschutz" onClick={onNavigate} className="underline underline-offset-2 hover:text-[#1F497D]">{ui.privacy}</Link>
            </p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
