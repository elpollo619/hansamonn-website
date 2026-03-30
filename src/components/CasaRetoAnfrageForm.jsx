import React, { useState } from 'react';
import { Calendar, Users, User, Mail, Phone, MessageSquare, Check, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const inp = 'w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition';
const lbl = 'block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5';

const INIT = { ankunft: '', abreise: '', gaeste: 2, vorname: '', nachname: '', email: '', telefon: '', nachricht: '' };

export default function CasaRetoAnfrageForm() {
  const [form, setForm]   = useState(INIT);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]   = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  function validate() {
    const e = {};
    if (!form.ankunft)  e.ankunft  = 'Ankunftsdatum erforderlich';
    if (!form.abreise)  e.abreise  = 'Abreisedatum erforderlich';
    if (form.ankunft && form.abreise && form.abreise <= form.ankunft) e.abreise = 'Abreise muss nach Ankunft sein';
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
    try {
      const { error: insertError } = await supabase.from('casa_reto_anfragen').insert([{
        ankunft:  form.ankunft,
        abreise:  form.abreise,
        gaeste:   Number(form.gaeste),
        vorname:  form.vorname,
        nachname: form.nachname,
        email:    form.email,
        telefon:  form.telefon,
        nachricht: form.nachricht,
      }]);
      if (insertError) throw insertError;

      // Email notification (fire-and-forget)
      const nights = Math.ceil((new Date(form.abreise) - new Date(form.ankunft)) / 86400000);
      supabase.functions.invoke('send-email', {
        body: {
          subject: `Neue Casa Reto Anfrage: ${form.vorname} ${form.nachname}`,
          html: `<h2>Neue Anfrage für Casa Reto</h2>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
<tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td><strong>${form.vorname} ${form.nachname}</strong></td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">E-Mail</td><td>${form.email}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">Telefon</td><td>${form.telefon || '–'}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">Ankunft</td><td>${new Date(form.ankunft).toLocaleDateString('de-CH')}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">Abreise</td><td>${new Date(form.abreise).toLocaleDateString('de-CH')}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">Nächte</td><td>${nights}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">Gäste</td><td>${form.gaeste}</td></tr>
${form.nachricht ? `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">Nachricht</td><td>${form.nachricht}</td></tr>` : ''}
</table>`,
          replyTo: form.email,
        },
      }).catch(() => {});

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
      <p className="text-gray-500 max-w-sm">Wir melden uns innerhalb von 24 Stunden bei Ihnen. Vielen Dank!</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Dates + guests */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={lbl}><Calendar size={11} className="inline mr-1" />Ankunft *</label>
          <input type="date" value={form.ankunft} onChange={e => set('ankunft', e.target.value)}
            min={new Date().toISOString().split('T')[0]} className={inp} />
          {errors.ankunft && <p className="text-xs text-red-500 mt-1">{errors.ankunft}</p>}
        </div>
        <div>
          <label className={lbl}><Calendar size={11} className="inline mr-1" />Abreise *</label>
          <input type="date" value={form.abreise} onChange={e => set('abreise', e.target.value)}
            min={form.ankunft || new Date().toISOString().split('T')[0]} className={inp} />
          {errors.abreise && <p className="text-xs text-red-500 mt-1">{errors.abreise}</p>}
        </div>
      </div>

      <div>
        <label className={lbl}><Users size={11} className="inline mr-1" />Anzahl Gäste</label>
        <select value={form.gaeste} onChange={e => set('gaeste', e.target.value)} className={inp}>
          {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Personen'}</option>)}
        </select>
      </div>

      {/* Name */}
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

      <div>
        <label className={lbl}><MessageSquare size={11} className="inline mr-1" />Nachricht</label>
        <textarea rows={3} value={form.nachricht} onChange={e => set('nachricht', e.target.value)}
          placeholder="Besondere Wünsche, Fragen…" className={inp + ' resize-none'} />
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
      <p className="text-xs text-gray-400 text-center">Wir antworten innerhalb von 24 Stunden.</p>
    </form>
  );
}
