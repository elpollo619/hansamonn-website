import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, LogIn, ShieldAlert } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminLoginScreen() {
  const { login } = useAdminAuth();
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Brief UX delay
    await new Promise((r) => setTimeout(r, 400));

    const result = await login(email.trim(), password);

    if (!result.ok) {
      if (result.locked) {
        setError(`Zu viele Fehlversuche. Zugang gesperrt für ${result.remainingMinutes} Minute(n). Bitte später erneut versuchen.`);
      } else if (result.attemptsLeft !== undefined && result.attemptsLeft <= 2) {
        setError(`Ungültige Anmeldedaten. Noch ${result.attemptsLeft} Versuch(e) bevor der Zugang vorübergehend gesperrt wird.`);
      } else {
        setError('Ungültige E-Mail-Adresse oder falsches Passwort.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#111827' }}>
      <div className="w-full max-w-md px-6">

        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-xs text-gray-400 tracking-[0.3em] uppercase mb-1">Admin Panel</p>
          <h1 className="text-3xl font-black tracking-widest text-white uppercase">
            Hans Amonn AG
          </h1>
          <div className="mt-3 h-px w-16 mx-auto" style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }} />
        </div>

        {/* Login card */}
        <div className="bg-white/5 border border-white/10 p-8">
          <h2 className="text-lg font-semibold text-white mb-6 text-center">
            Anmeldung
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                E-Mail
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@hansamonn.ch"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 pl-10 pr-4 py-3 focus:outline-none focus:border-white/50 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Passwort
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 pl-10 pr-12 py-3 focus:outline-none focus:border-white/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                  aria-label={showPassword ? 'Passwort ausblenden' : 'Passwort anzeigen'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="border border-white/20 bg-white/5 text-gray-200 text-sm px-4 py-3 flex items-start gap-2">
                <ShieldAlert size={15} className="flex-shrink-0 mt-0.5 text-gray-300" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 flex items-center justify-center gap-2 transition-colors mt-2"
              style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
              onMouseOver={e => !loading && e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
              onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {loading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Hans Amonn AG &copy; {new Date().getFullYear()} &mdash; Interner Bereich
        </p>
      </div>
    </div>
  );
}
