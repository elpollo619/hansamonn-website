import React, { useEffect, useState } from 'react';
import { getConsent, onConsentChange, setConsent } from '@/lib/consent';

/**
 * ConsentEmbed — renders a third-party iframe (Google Maps, video) only after the
 * visitor allowed external content, or clicked "load" for this one embed.
 */
export default function ConsentEmbed({ provider = 'Google Maps', label = 'Karte laden', children, className = '' }) {
  const [allowed, setAllowed] = useState(() => !!getConsent()?.external);
  const [once, setOnce] = useState(false);

  useEffect(() => onConsentChange(() => setAllowed(!!getConsent()?.external)), []);

  if (allowed || once) return children;

  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-center bg-[#eef0f3] p-6 ${className}`}>
      <p className="max-w-md text-sm text-gray-600 leading-relaxed">
        Dieser Inhalt wird von {provider} bereitgestellt. Beim Laden werden Daten, unter anderem Ihre
        IP-Adresse, an den Anbieter übermittelt.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setOnce(true)}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1D3D78] hover:bg-[#162E5A] transition-colors"
        >
          {label}
        </button>
        <button
          type="button"
          onClick={() => setConsent({ ...(getConsent() || {}), external: true })}
          className="px-5 py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 hover:border-gray-500 transition-colors"
        >
          Immer erlauben
        </button>
      </div>
    </div>
  );
}
