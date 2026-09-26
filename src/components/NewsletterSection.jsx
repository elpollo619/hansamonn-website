import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'invalid' | 'consent' | 'error'
  const [consent, setConsent] = useState(false);

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus('invalid');
      return;
    }
    if (!consent) {
      setStatus('consent');
      return;
    }

    setStatus('loading');

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.trim().toLowerCase() });

    // Same answer for new and already registered addresses, so nobody can probe who is subscribed
    if (!error || error.code === '23505' || (error.message && error.message.includes('unique'))) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('error');
    }
  };

  return (
    <section className="text-white py-20 px-4" style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}>
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="font-display uppercase text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
          Neue Immobilien als Erster erfahren
        </h2>
        <p className="text-white/75 mb-10 text-base sm:text-lg leading-relaxed">
          Melden Sie sich für unseren Newsletter an und erhalten Sie Benachrichtigungen
          bei neuen Objekten.
        </p>

        {status === 'success' ? (
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-6 py-4 text-sm font-medium">
            ✓ Vielen Dank! Wir informieren Sie über neue Objekte. Abmelden können Sie sich jederzeit.
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== 'idle') setStatus('idle');
              }}
              placeholder="ihre@email.ch"
              required
              className="flex-1 max-w-sm bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 text-sm rounded focus:outline-none focus:border-white/50 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-white text-gray-900 text-sm font-semibold tracking-wide rounded hover:bg-gray-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
            >
              {status === 'loading' ? 'Wird gesendet…' : 'Anmelden'}
            </button>
          </div>
          <label className="mt-4 flex items-start justify-center gap-2.5 text-left text-xs text-white/75 leading-relaxed max-w-lg mx-auto">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => { setConsent(e.target.checked); if (status === 'consent') setStatus('idle'); }}
              className="mt-0.5 shrink-0 accent-white"
            />
            <span>
              Ich möchte per E-Mail über neue Objekte der Hans Amonn AG informiert werden. Die Einwilligung kann
              ich jederzeit widerrufen. Mehr in der{' '}
              <Link to="/datenschutz" className="underline hover:text-white">Datenschutzerklärung</Link>.
            </span>
          </label>
          </form>
        )}

        {status === 'invalid' && (
          <p className="mt-3 text-sm text-red-300">Bitte geben Sie eine gültige E-Mail-Adresse ein.</p>
        )}
        {status === 'consent' && (
          <p className="mt-3 text-sm text-red-300">Bitte bestätigen Sie die Einwilligung.</p>
        )}
        {status === 'error' && (
          <p className="mt-3 text-sm text-red-300">Die Anmeldung ist gerade nicht möglich. Bitte versuchen Sie es später erneut.</p>
        )}
      </div>
    </section>
  );
}
