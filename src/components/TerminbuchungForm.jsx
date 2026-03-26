import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ART_OPTIONS = ['Besichtigung', 'Beratungsgespräch', 'Online-Meeting'];
const UHRZEIT_OPTIONS = ['08:00–10:00', '10:00–12:00', '13:00–15:00', '15:00–17:00'];

const TODAY = new Date().toISOString().split('T')[0];

const EMPTY = {
  name: '',
  email: '',
  telefon: '',
  art: 'Besichtigung',
  wunschtermin: '',
  uhrzeit: '10:00–12:00',
  nachricht: '',
};

export default function TerminbuchungForm({ propertyId = '', propertyName = '' }) {
  const [form, setForm] = useState({ ...EMPTY });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { error: dbError } = await supabase.from('termine').insert([
        {
          property_id: propertyId || null,
          property_name: propertyName || null,
          name: form.name,
          email: form.email,
          telefon: form.telefon || null,
          wunschtermin: form.wunschtermin,
          uhrzeit: form.uhrzeit,
          art: form.art,
          nachricht: form.nachricht || null,
          status: 'neu',
        },
      ]);

      if (dbError) throw dbError;

      // Fire-and-forget email notification (no blocking)
      supabase.functions.invoke('send-email', {
        body: {
          to: 'office@reto-amonn.ch',
          subject: `Neuer Terminwunsch – ${form.art}${propertyName ? ` – ${propertyName}` : ''}`,
          text: `Name: ${form.name}\nE-Mail: ${form.email}\nTelefon: ${form.telefon || '—'}\nArt: ${form.art}\nDatum: ${form.wunschtermin}\nZeit: ${form.uhrzeit}\nObjekt: ${propertyName || '—'}\nNachricht: ${form.nachricht || '—'}`,
        },
      }).catch(() => {});

      setSuccess(true);
      setForm({ ...EMPTY });
    } catch (err) {
      setError('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5';

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <CheckCircle2 size={40} className="mx-auto text-green-500 mb-3" />
        <p className="font-semibold text-green-800 text-base">
          Ihr Terminwunsch wurde übermittelt. Wir melden uns in Kürze.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm text-green-700 hover:underline"
        >
          Weiteren Termin anfragen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {propertyName && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800">
          Termin anfragen für: <strong>{propertyName}</strong>
        </div>
      )}

      {/* Name + Email */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>
            <span className="flex items-center gap-1.5"><User size={12} />Name *</span>
          </label>
          <input
            className={inputCls}
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Ihr vollständiger Name"
          />
        </div>
        <div>
          <label className={labelCls}>
            <span className="flex items-center gap-1.5"><Mail size={12} />E-Mail *</span>
          </label>
          <input
            className={inputCls}
            type="email"
            required
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="ihre@email.ch"
          />
        </div>
      </div>

      {/* Telefon + Art */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>
            <span className="flex items-center gap-1.5"><Phone size={12} />Telefon</span>
          </label>
          <input
            className={inputCls}
            type="tel"
            value={form.telefon}
            onChange={(e) => set('telefon', e.target.value)}
            placeholder="+41 ..."
          />
        </div>
        <div>
          <label className={labelCls}>Art der Besichtigung</label>
          <select
            className={inputCls}
            value={form.art}
            onChange={(e) => set('art', e.target.value)}
          >
            {ART_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Datum + Uhrzeit */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>
            <span className="flex items-center gap-1.5"><Calendar size={12} />Wunschdatum *</span>
          </label>
          <input
            className={inputCls}
            type="date"
            required
            min={TODAY}
            value={form.wunschtermin}
            onChange={(e) => set('wunschtermin', e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>
            <span className="flex items-center gap-1.5"><Clock size={12} />Wunschzeit</span>
          </label>
          <select
            className={inputCls}
            value={form.uhrzeit}
            onChange={(e) => set('uhrzeit', e.target.value)}
          >
            {UHRZEIT_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Nachricht */}
      <div>
        <label className={labelCls}>
          <span className="flex items-center gap-1.5"><MessageSquare size={12} />Nachricht (optional)</span>
        </label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={3}
          value={form.nachricht}
          onChange={(e) => set('nachricht', e.target.value)}
          placeholder="Weitere Angaben oder Wünsche..."
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors"
      >
        {submitting ? (
          <><Loader2 size={16} className="animate-spin" /> Wird gesendet…</>
        ) : (
          <><Calendar size={16} /> Terminwunsch absenden</>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Wir bestätigen Ihren Terminwunsch in der Regel innerhalb von 1 Werktag.
      </p>
    </form>
  );
}
