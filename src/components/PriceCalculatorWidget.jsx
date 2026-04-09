import React, { useState, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';

const inp = 'w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white';

/**
 * Price calculator for ferienhaus / short-stay properties.
 * Props:
 *   seasons: [{ name, months: number[], priceNight, priceWeek, minNights }]
 *   priceClean: number (cleaning fee, optional)
 *   currency: string (default 'CHF')
 *   onInquire: function (called with {ankunft, abreise, nights, total})
 */
export default function PriceCalculatorWidget({ seasons = [], priceClean = 0, currency = 'CHF', onInquire }) {
  const [ankunft, setAnkunft] = useState('');
  const [abreise, setAbreise] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const result = useMemo(() => {
    if (!ankunft || !abreise || abreise <= ankunft) return null;
    const nights = Math.ceil((new Date(abreise) - new Date(ankunft)) / 86400000);
    if (nights <= 0) return null;

    // Find season by arrival month (0-based)
    const arrivalMonth = new Date(ankunft).getMonth();
    // Ostern has priority if month matches, else match other seasons
    const season = seasons.find(s => s.name === 'Ostern' && s.months.includes(arrivalMonth))
      ?? seasons.find(s => s.months.includes(arrivalMonth))
      ?? seasons[0];

    if (!season) return null;
    if (nights < (season.minNights ?? 1)) {
      return { error: `Mindestaufenthalt: ${season.minNights} Nächte (${season.name})` };
    }

    const weeks = Math.floor(nights / 7);
    const remainingNights = nights % 7;
    const stayPrice = weeks * (season.priceWeek ?? season.priceNight * 7) + remainingNights * season.priceNight;
    const total = stayPrice + (priceClean || 0);

    return { nights, weeks, remainingNights, stayPrice, total, season, cleaningFee: priceClean || 0 };
  }, [ankunft, abreise, seasons, priceClean]);

  return (
    <div className="bg-white border border-gray-100 p-5 space-y-4">
      <h3 className="text-sm font-bold text-gray-900">Preis berechnen</h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Ankunft</label>
          <input type="date" value={ankunft} onChange={e => { setAnkunft(e.target.value); if (abreise && e.target.value >= abreise) setAbreise(''); }}
            min={today} className={inp} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Abreise</label>
          <input type="date" value={abreise} onChange={e => setAbreise(e.target.value)}
            min={ankunft || today} className={inp} />
        </div>
      </div>

      {/* Seasonal prices reference */}
      {seasons.length > 0 && (
        <div className="grid grid-cols-1 gap-1.5">
          {seasons.map(s => (
            <div key={s.name} className="flex justify-between items-center text-xs px-3 py-2 bg-gray-50 border border-gray-100">
              <span className="text-gray-600">{s.name} <span className="text-gray-400">({s.minNights}N min.)</span></span>
              <span className="font-semibold text-gray-800">{currency} {s.priceNight} / Nacht</span>
            </div>
          ))}
          {priceClean > 0 && (
            <div className="flex justify-between items-center text-xs px-3 py-2 bg-gray-50 border border-gray-100">
              <span className="text-gray-600">Endreinigung</span>
              <span className="font-semibold text-gray-800">{currency} {priceClean}</span>
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {result && (
        result.error ? (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2">{result.error}</p>
        ) : (
          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{result.nights} Nächte · Saison: {result.season.name}</span>
              <span className="font-medium text-gray-800">{currency} {result.stayPrice}</span>
            </div>
            {result.cleaningFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Endreinigung</span>
                <span className="font-medium text-gray-800">{currency} {result.cleaningFee}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
              <span className="font-bold text-gray-900">Geschätzter Gesamtpreis</span>
              <span className="text-xl font-bold" style={{ color: 'var(--brand-color, #1D3D78)' }}>{currency} {result.total}</span>
            </div>
            <p className="text-xs text-gray-400">Richtwert · Endpreis auf Anfrage bestätigt.</p>
            {onInquire && (
              <button
                onClick={() => onInquire({ ankunft, abreise, nights: result.nights, total: result.total })}
                className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 text-sm mt-1"
                style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
              >
                <ChevronRight size={16} /> Jetzt anfragen
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
}
