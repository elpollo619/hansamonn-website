import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getConsent, setConsent, onOpenCookieSettings } from '@/lib/consent';

const BRAND = 'var(--brand-color, #1D3D78)';

function Toggle({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${disabled ? 'opacity-60' : ''}`}
      style={{ backgroundColor: checked ? BRAND : '#d1d5db' }}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`} />
    </button>
  );
}

/**
 * CookieBanner — first-visit notice with a real choice, plus a settings panel
 * that can be re-opened any time from the footer ("Cookie-Einstellungen").
 * Only strictly necessary storage runs without consent.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [external, setExternal] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
    return onOpenCookieSettings(() => {
      const c = getConsent() || {};
      setStatistics(!!c.statistics);
      setExternal(!!c.external);
      setDetails(true);
      setVisible(true);
    });
  }, []);

  const save = (choice) => {
    setConsent(choice);
    setVisible(false);
    setDetails(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          role="dialog"
          aria-label="Cookie-Einstellungen"
          className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-2xl"
        >
          <div className="container mx-auto px-4 sm:px-6 py-5">
            <div className="flex flex-col lg:flex-row lg:items-start gap-5">
              <div className="flex-1 text-sm text-gray-600 leading-relaxed">
                <p className="font-semibold text-gray-900 mb-1">Wir respektieren Ihre Privatsphäre</p>
                <p>
                  Notwendig sind nur Ihre Sprach- und Cookie-Auswahl. Mit Ihrer Einwilligung nutzen wir Google
                  Analytics für anonyme Statistiken und laden externe Inhalte wie Google Maps; dabei können Daten
                  an Google (auch in die USA) übermittelt werden. Sie können Ihre Wahl jederzeit unter
                  «Cookie-Einstellungen» im Seitenfuss ändern. Mehr in der{' '}
                  <Link to="/cookies" className="underline text-gray-800 hover:text-black">Cookie-Richtlinie</Link> und der{' '}
                  <Link to="/datenschutz" className="underline text-gray-800 hover:text-black">Datenschutzerklärung</Link>.
                </p>

                {details && (
                  <ul className="mt-4 divide-y divide-gray-100 border-y border-gray-100">
                    <li className="flex items-center justify-between gap-4 py-3">
                      <span><strong className="text-gray-900">Notwendig</strong><br />Sprache, Merkliste und Cookie-Auswahl auf Ihrem Gerät.</span>
                      <Toggle checked disabled label="Notwendig" />
                    </li>
                    <li className="flex items-center justify-between gap-4 py-3">
                      <span><strong className="text-gray-900">Statistik</strong><br />Google Analytics (Google Ireland Ltd. / Google LLC, USA), Cookies bis 2 Jahre.</span>
                      <Toggle checked={statistics} onChange={setStatistics} label="Statistik" />
                    </li>
                    <li className="flex items-center justify-between gap-4 py-3">
                      <span><strong className="text-gray-900">Externe Inhalte</strong><br />Google Maps und Videos. Ihre IP-Adresse wird an diese Anbieter übermittelt.</span>
                      <Toggle checked={external} onChange={setExternal} label="Externe Inhalte" />
                    </li>
                  </ul>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-stretch lg:w-56 shrink-0">
                {details ? (
                  <button
                    onClick={() => save({ statistics, external })}
                    className="px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                    style={{ backgroundColor: BRAND }}
                  >
                    Auswahl speichern
                  </button>
                ) : (
                  <button
                    onClick={() => setDetails(true)}
                    className="px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-400 transition-colors"
                  >
                    Einstellungen
                  </button>
                )}
                <button
                  onClick={() => save({ statistics: false, external: false })}
                  className="px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Nur notwendige
                </button>
                <button
                  onClick={() => save({ statistics: true, external: true })}
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-[#0F1B2D] hover:bg-black transition-colors"
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
