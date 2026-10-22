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
    <section className="surface-warm border-t border-gray-200 py-16 md:py-20">
      <div className="container mx-auto px-6 grid gap-8 md:grid-cols-2 md:gap-16 md:items-center">
        <div>
          <h2 className="display-heading text-3xl md:text-4xl mb-4">Neue Immobilien als Erste erfahren</h2>
          <p className="text-gray-600 leading-relaxed max-w-md">
            Melden Sie sich an und erhalten Sie eine E-Mail, sobald ein neues Objekt verfügbar ist. Abmelden können Sie sich jederzeit.
          </p>
        </div>

        <div>
          {status === 'success' ? (
            <p className="bg-white border border-gray-200 px-5 py-4 text-sm text-gray-800" role="status">
              Vielen Dank! Wir informieren Sie über neue Objekte. Abmelden können Sie sich jederzeit.
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="newsletter-email" className="block text-sm font-semibold text-gray-800 mb-2">E-Mail-Adresse</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="newsletter-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  placeholder="ihre@email.ch"
                  required
                  aria-invalid={status === 'invalid' || undefined}
                  className="flex-1 min-w-0 bg-white border border-gray-300 text-gray-900 placeholder-gray-400 px-4 py-3 text-base focus:outline-none focus:border-[#1F497D] focus:ring-1 focus:ring-[#1F497D] transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 bg-[#1F497D] text-white text-sm font-semibold hover:bg-[#173963] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                >
                  {status === 'loading' ? 'Wird gesendet…' : 'Anmelden'}
                </button>
              </div>
              <label className="mt-4 flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => { setConsent(e.target.checked); if (status === 'consent') setStatus('idle'); }}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#1F497D]"
                />
                <span>
                  Ich möchte per E-Mail über neue Objekte der Hans Amonn AG informiert werden. Die Einwilligung kann
                  ich jederzeit widerrufen. Mehr in der{' '}
                  <Link to="/datenschutz" className="underline hover:text-gray-900">Datenschutzerklärung</Link>.
                </span>
              </label>
            </form>
          )}

          {status === 'invalid' && (
            <p className="mt-3 text-sm font-semibold text-red-700" role="alert">Bitte geben Sie eine gültige E-Mail-Adresse ein.</p>
          )}
          {status === 'consent' && (
            <p className="mt-3 text-sm font-semibold text-red-700" role="alert">Bitte bestätigen Sie die Einwilligung.</p>
          )}
          {status === 'error' && (
            <p className="mt-3 text-sm font-semibold text-red-700" role="alert">Die Anmeldung ist gerade nicht möglich. Bitte versuchen Sie es später erneut.</p>
          )}
        </div>
      </div>
    </section>
  );
}
