import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';

const BASE = {
  'Muri bei Bern':  { longStay: 28, shortStay: 4.5, wohnung: 22 },
  'Kerzers':        { longStay: 22, shortStay: 3.5, wohnung: 18 },
  'Münchenbuchsee': { longStay: 25, shortStay: 4.0, wohnung: 20 },
};

const STANDORTE = Object.keys(BASE);

const TYPEN = [
  { value: 'longStay',  label: 'Long Stay (möbliert)' },
  { value: 'shortStay', label: 'Short Stay (per Nacht)' },
  { value: 'wohnung',   label: 'Wohnung (langfristig)' },
];

const OPTIONEN = [
  { key: 'parkplatz',   label: 'Parkplatz',         addon: 80,   suffix: '/Mt.' },
  { key: 'nebenkosten', label: 'Nebenkosten inkl.',  pct: 0.15,  suffix: '+15%' },
  { key: 'reinigung',   label: 'Reinigung inkl.',    addon: 150,  suffix: '/Mt.' },
];

function formatCHF(n) {
  return new Intl.NumberFormat('de-CH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

const RentCalculator = () => {
  const [flaeche, setFlaeche]     = useState(50);
  const [standort, setStandort]   = useState('Muri bei Bern');
  const [typ, setTyp]             = useState('longStay');
  const [options, setOptions]     = useState({ parkplatz: false, nebenkosten: false, reinigung: false });

  const toggleOption = (key) =>
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));

  const result = useMemo(() => {
    const rates = BASE[standort];
    const baseRate = rates[typ];
    const isNight = typ === 'shortStay';

    // Base price
    const basePrice = baseRate * flaeche;

    // Extras (only apply to monthly types for monthly extras)
    let extras = 0;
    let extrasDetail = [];

    if (options.parkplatz) {
      const amt = isNight ? 0 : 80;
      if (amt > 0) { extras += amt; extrasDetail.push({ label: 'Parkplatz', amt }); }
    }
    if (options.nebenkosten) {
      const amt = basePrice * 0.15;
      extras += amt;
      extrasDetail.push({ label: 'Nebenkosten', amt });
    }
    if (options.reinigung) {
      const amt = isNight ? 0 : 150;
      if (amt > 0) { extras += amt; extrasDetail.push({ label: 'Reinigung', amt }); }
    }

    const total = basePrice + extras;
    const min = total * 0.9;
    const max = total * 1.1;

    return { basePrice, extras, extrasDetail, total, min, max, isNight };
  }, [flaeche, standort, typ, options]);

  const suffix = result.isNight ? '/ Nacht' : '/ Mt.';

  return (
    <div className="bg-white border border-gray-100 overflow-hidden">
      {/* Form */}
      <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6">
        {/* Wohnfläche */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Wohnfläche (m²)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={20}
              max={200}
              step={5}
              value={flaeche}
              onChange={(e) => setFlaeche(Number(e.target.value))}
              className="flex-1 accent-green-600 cursor-pointer"
            />
            <input
              type="number"
              min={20}
              max={200}
              value={flaeche}
              onChange={(e) => {
                const v = Math.max(20, Math.min(200, Number(e.target.value)));
                setFlaeche(v);
              }}
              className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm text-center font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Standort */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Standort</label>
          <select
            value={standort}
            onChange={(e) => setStandort(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            {STANDORTE.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Typ */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Miettyp</label>
          <div className="flex flex-col gap-2">
            {TYPEN.map((t) => (
              <label key={t.value} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="typ"
                  value={t.value}
                  checked={typ === t.value}
                  onChange={() => setTyp(t.value)}
                  className="accent-green-600"
                />
                <span className="text-sm text-gray-700">{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Optionen */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Optionen</label>
          <div className="flex flex-col gap-2.5">
            {OPTIONEN.map((opt) => (
              <label key={opt.key} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[opt.key]}
                  onChange={() => toggleOption(opt.key)}
                  className="accent-green-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
                <span className="ml-auto text-xs text-gray-400">{opt.suffix}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="border-t border-gray-100 bg-gray-50 p-6 md:p-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Geschätzter Mietpreis
        </p>

        {/* Big price range */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl md:text-5xl font-black text-gray-900 tabular-nums">
            CHF {formatCHF(result.min)}
          </span>
          <span className="text-xl font-bold text-gray-400">–</span>
          <span className="text-4xl md:text-5xl font-black text-gray-900 tabular-nums">
            {formatCHF(result.max)}
          </span>
          <span className="text-base text-gray-500 font-medium ml-1">{suffix}</span>
        </div>

        {/* Breakdown */}
        <div className="bg-white p-4 mb-4 space-y-1.5 border border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Basispreis ({flaeche} m² × CHF {BASE[standort][typ]})
            </span>
            <span className="font-semibold text-gray-900">
              CHF {formatCHF(result.basePrice)} {suffix}
            </span>
          </div>
          {result.extrasDetail.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-gray-500">+ {item.label}</span>
              <span className="text-gray-700">CHF {formatCHF(item.amt)} {suffix}</span>
            </div>
          ))}
          {result.extras > 0 && (
            <div className="flex justify-between text-sm border-t border-gray-100 pt-1.5 mt-1.5">
              <span className="font-semibold text-gray-700">Gesamt (Mitte)</span>
              <span className="font-bold text-gray-900">
                CHF {formatCHF(result.total)} {suffix}
              </span>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 text-xs text-gray-500 mb-5">
          <Info size={13} className="flex-shrink-0 mt-0.5 text-gray-400" />
          <span>
            Diese Schätzung ist unverbindlich und dient nur als Orientierungshilfe. Der tatsächliche
            Mietpreis hängt von der konkreten Ausstattung, Lage und Verfügbarkeit ab.
          </span>
        </div>

        {/* CTA */}
        <Link
          to="/immobilien/anfrage"
          className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 transition-colors text-sm"
          style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
          onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
          onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
        >
          Jetzt Anfrage stellen
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
};

export default RentCalculator;
