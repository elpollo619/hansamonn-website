import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'duplicate' | 'error'

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: email.trim().toLowerCase() });

    if (!error) {
      setStatus('success');
      setEmail('');
    } else if (
      error.code === '23505' ||
      (error.message && error.message.includes('unique'))
    ) {
      setStatus('duplicate');
    } else {
      setStatus('error');
    }
  };

  return (
    <section className="bg-gray-900 text-white py-20 px-4">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
          Neue Immobilien als Erster erfahren
        </h2>
        <p className="text-gray-400 mb-10 text-base sm:text-lg leading-relaxed">
          Melden Sie sich für unseren Newsletter an und erhalten Sie Benachrichtigungen
          bei neuen Objekten.
        </p>

        {status === 'success' ? (
          <div className="inline-flex items-center gap-2 bg-green-800/40 border border-green-600 text-green-300 px-6 py-4 rounded text-sm font-medium">
            ✓ Vielen Dank! Sie erhalten bald eine Bestätigung.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 justify-center"
            noValidate
          >
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
          </form>
        )}

        {status === 'duplicate' && (
          <p className="mt-3 text-sm text-amber-400">
            Diese E-Mail-Adresse ist bereits registriert.
          </p>
        )}
        {status === 'error' && (
          <p className="mt-3 text-sm text-red-400">
            Bitte geben Sie eine gültige E-Mail-Adresse ein.
          </p>
        )}
      </div>
    </section>
  );
}
