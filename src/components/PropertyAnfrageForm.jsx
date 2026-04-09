import React, { useState } from 'react';
import { User, Mail, Phone, MessageSquare, Check, Loader2, AlertCircle, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const inp = 'w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition';
const lbl = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5';

const INIT = { vorname: '', nachname: '', email: '', telefon: '', einzug: '', nachricht: '' };

/**
 * Generic property inquiry form — works for long-stay, hotel, apartment, etc.
 * @prop {string} propertyName  - displayed in email subject
 * @prop {string} contactEmail  - recipient (falls back to office@reto-amonn.ch)
 * @prop {boolean} showDate     - show "Gewünschter Einzug" date field (long-stay)
 */
export default function PropertyAnfrageForm({ propertyName = '', contactEmail = 'office@reto-amonn.ch', showDate = false }) {
  const [form, setForm]     = useState(INIT);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  function validate() {
    const e = {};
    if (!form.vorname.trim())  e.vorname  = 'Vorname erforderlich';
    if (!form.nachname.trim()) e.nachname = 'Nachname erforderlich';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Gültige E-Mail erforderlich';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const subject = `Neue Anfrage: ${propertyName} – ${form.vorname} ${form.nachname}`;

    const companyHtml = `
<h2 style="font-family:sans-serif;color:#1D3D78">Neue Anfrage: ${propertyName}</h2>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
<tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td><strong>${form.vorname} ${form.nachname}</strong></td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">E-Mail</td><td>${form.email}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">Telefon</td><td>${form.telefon || '–'}</td></tr>
${form.einzug ? `<tr><td style="padding:4px 12px 4px 0;color:#666">Gew. Einzug</td><td>${new Date(form.einzug).toLocaleDateString('de-CH')}</td></tr>` : ''}
${form.nachricht ? `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">Nachricht</td><td>${form.nachricht.replace(/\n/g, '<br>')}</td></tr>` : ''}
</table>`;

    const confirmHtml = `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
<div style="background:#1D3D78;padding:24px 32px;color:white">
  <h1 style="margin:0;font-size:22px;font-weight:700">Hans Amonn AG</h1>
  <p style="margin:6px 0 0;opacity:.8;font-size:14px">Immobilien & Architektur</p>
</div>
<div style="padding:32px;background:#f9fafb;border:1px solid #e5e7eb">
  <h2 style="color:#1D3D78;font-size:18px;margin-top:0">Ihre Anfrage ist bei uns eingegangen!</h2>
  <p style="color:#374151">Guten Tag ${form.vorname} ${form.nachname},</p>
  <p style="color:#374151">vielen Dank für Ihre Anfrage bezüglich <strong>${propertyName}</strong>. Wir haben Ihre Nachricht erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden.</p>
  <div style="background:white;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:20px 0">
    <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.05em">Ihre Angaben</p>
    <p style="margin:4px 0;color:#374151"><strong>Objekt:</strong> ${propertyName}</p>
    ${form.einzug ? `<p style="margin:4px 0;color:#374151"><strong>Gew. Einzug:</strong> ${new Date(form.einzug).toLocaleDateString('de-CH')}</p>` : ''}
    ${form.nachricht ? `<p style="margin:4px 0;color:#374151"><strong>Ihre Nachricht:</strong> ${form.nachricht.replace(/\n/g, '<br>')}</p>` : ''}
  </div>
  <p style="color:#374151">Bei dringenden Fragen erreichen Sie uns auch direkt:</p>
  <p style="margin:4px 0;color:#1D3D78"><strong>Tel:</strong> +41 31 951 85 54</p>
  <p style="margin:4px 0;color:#1D3D78"><strong>E-Mail:</strong> office@reto-amonn.ch</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
  <p style="color:#9ca3af;font-size:12px;margin:0">Hans Amonn AG · Kerzers, Schweiz · hansamonn.ch</p>
</div>
</div>`;

    try {
      // Save to DB (fire-and-forget, table may not exist yet)
      supabase.from('property_anfragen').insert([{
        property_name: propertyName,
        vorname:   form.vorname,
        nachname:  form.nachname,
        email:     form.email,
        telefon:   form.telefon,
        einzug:    form.einzug || null,
        nachricht: form.nachricht,
      }]).then(() => {}).catch(() => {});

      // Company notification email (fire-and-forget)
      supabase.functions.invoke('send-email', {
        body: { subject, html: companyHtml, replyTo: form.email },
      }).catch(() => {});

      // Client confirmation email
      await supabase.functions.invoke('send-email', {
        body: {
          to: form.email,
          subject: `Ihre Anfrage für ${propertyName} – Hans Amonn AG`,
          html: confirmHtml,
        },
      });

      setDone(true);
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Fehler beim Senden. Bitte versuchen Sie es erneut.' });
    } finally {
      setLoading(false);
    }
  }

  if (done) return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mb-4">
        <Check size={28} className="text-gray-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Anfrage gesendet!</h3>
      <p className="text-gray-500 max-w-sm">Wir melden uns innerhalb von 24 Stunden. Eine Bestätigung wurde an {form.email} gesendet.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}><User size={11} className="inline mr-1" />Vorname *</label>
          <input type="text" value={form.vorname} onChange={e => set('vorname', e.target.value)} placeholder="Max" className={inp} />
          {errors.vorname && <p className="text-xs text-red-500 mt-1">{errors.vorname}</p>}
        </div>
        <div>
          <label className={lbl}>Nachname *</label>
          <input type="text" value={form.nachname} onChange={e => set('nachname', e.target.value)} placeholder="Mustermann" className={inp} />
          {errors.nachname && <p className="text-xs text-red-500 mt-1">{errors.nachname}</p>}
        </div>
      </div>

      <div>
        <label className={lbl}><Mail size={11} className="inline mr-1" />E-Mail *</label>
        <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="max@beispiel.ch" className={inp} />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className={lbl}><Phone size={11} className="inline mr-1" />Telefon</label>
        <input type="tel" value={form.telefon} onChange={e => set('telefon', e.target.value)} placeholder="+41 79 123 45 67" className={inp} />
      </div>

      {showDate && (
        <div>
          <label className={lbl}><Calendar size={11} className="inline mr-1" />Gewünschter Einzug</label>
          <input type="date" value={form.einzug} onChange={e => set('einzug', e.target.value)}
            min={new Date().toISOString().split('T')[0]} className={inp} />
        </div>
      )}

      <div>
        <label className={lbl}><MessageSquare size={11} className="inline mr-1" />Nachricht</label>
        <textarea rows={3} value={form.nachricht} onChange={e => set('nachricht', e.target.value)}
          placeholder="Ihre Fragen oder besonderen Wünsche…" className={inp + ' resize-none'} />
      </div>

      {errors.submit && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3">
          <AlertCircle size={14} /> {errors.submit}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 text-white font-semibold py-4 transition-colors disabled:opacity-50"
        style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
        onMouseOver={e => { if (!e.currentTarget.disabled) e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)'); }}
        onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
      >
        {loading ? <><Loader2 size={16} className="animate-spin" /> Senden…</> : <><Check size={16} /> Anfrage senden</>}
      </button>
      <p className="text-xs text-gray-400 text-center">Sie erhalten automatisch eine Bestätigung per E-Mail.</p>
    </form>
  );
}
