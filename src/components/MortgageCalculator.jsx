import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Info } from 'lucide-react';

/** Format number as Swiss-style CHF string: CHF 1'234'567 */
function chf(value) {
  if (!isFinite(value) || isNaN(value)) return '–';
  return (
    'CHF\u00a0' +
    Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, "'")
  );
}

/** Standard annuity monthly payment */
function annuity(principal, annualRate, years) {
  if (principal <= 0) return 0;
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

const LAUFZEIT_OPTIONS = [10, 15, 20, 25];

const MortgageCalculator = () => {
  const [kaufpreis, setKaufpreis] = useState(600000);
  const [ekPct, setEkPct] = useState(20);
  const [zinssatz, setZinssatz] = useState(2.5);
  const [laufzeit, setLaufzeit] = useState(20);
  const [monatseinkommen, setMonatseinkommen] = useState(8000);

  const eigenkapital = Math.round((kaufpreis * ekPct) / 100);
  const hypothek = kaufpreis - eigenkapital;

  const { monatsrate, jahresZinsen, tragbarkeit } = useMemo(() => {
    const rate = annuity(hypothek, zinssatz, laufzeit);
    const zinsen = (hypothek * zinssatz) / 100;
    const tb = monatseinkommen > 0 ? (rate / monatseinkommen) * 100 : null;
    return { monatsrate: rate, jahresZinsen: zinsen, tragbarkeit: tb };
  }, [hypothek, zinssatz, laufzeit, monatseinkommen]);

  const ltvPct = kaufpreis > 0 ? (hypothek / kaufpreis) * 100 : 0;
  const ltvOk = ltvPct <= 80;
  const tragbarkeitOk = tragbarkeit !== null ? tragbarkeit <= 33 : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-6 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <Calculator size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold text-base leading-tight">Hypothekenrechner</h2>
          <p className="text-gray-300 text-xs mt-0.5">Annuitätenmodell · Schweizer Standard</p>
        </div>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-8">
        {/* ── LEFT: Inputs ─────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Kaufpreis */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-semibold text-gray-700">Kaufpreis</label>
              <span className="text-sm font-bold text-gray-900">{chf(kaufpreis)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={2000000}
              step={10000}
              value={kaufpreis}
              onChange={e => setKaufpreis(Number(e.target.value))}
              className="w-full accent-gray-900 h-1.5 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>CHF 100'000</span>
              <span>CHF 2'000'000</span>
            </div>
          </div>

          {/* Eigenkapital */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-semibold text-gray-700">Eigenkapital</label>
              <span className="text-sm font-bold text-gray-900">
                {ekPct}% &nbsp;
                <span className="text-gray-500 font-normal">({chf(eigenkapital)})</span>
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={1}
              value={ekPct}
              onChange={e => setEkPct(Number(e.target.value))}
              className="w-full accent-gray-900 h-1.5 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Zinssatz */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-semibold text-gray-700">Zinssatz (p.a.)</label>
              <span className="text-sm font-bold text-gray-900">{zinssatz.toFixed(1)}%</span>
            </div>
            <input
              type="number"
              min={0.1}
              max={10}
              step={0.1}
              value={zinssatz}
              onChange={e => setZinssatz(Math.max(0.1, Math.min(10, Number(e.target.value))))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
          </div>

          {/* Laufzeit */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Laufzeit</label>
            <div className="grid grid-cols-4 gap-2">
              {LAUFZEIT_OPTIONS.map(y => (
                <button
                  key={y}
                  onClick={() => setLaufzeit(y)}
                  className={`py-2 rounded-xl text-sm font-semibold border transition-colors ${
                    laufzeit === y
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {y}J
                </button>
              ))}
            </div>
          </div>

          {/* Monatliches Haushaltseinkommen */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-semibold text-gray-700">Brutto-Monatseinkommen</label>
              <span className="text-sm font-bold text-gray-900">{chf(monatseinkommen)}</span>
            </div>
            <input
              type="number"
              min={1000}
              max={100000}
              step={500}
              value={monatseinkommen}
              onChange={e => setMonatseinkommen(Math.max(0, Number(e.target.value)))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            />
          </div>
        </div>

        {/* ── RIGHT: Results ───────────────────────────────────────── */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Ergebnis</h3>

          {/* Hypothek */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-0.5">Hypothek (Finanzierungsbedarf)</p>
            <p className="text-2xl font-black text-gray-900">{chf(hypothek)}</p>
          </div>

          {/* Monatsrate */}
          <div className="bg-gray-900 rounded-2xl p-4 text-white">
            <p className="text-xs text-gray-400 mb-0.5">Monatliche Rate</p>
            <p className="text-3xl font-black">{chf(monatsrate)}</p>
            <p className="text-xs text-gray-400 mt-1">Annuität · {laufzeit} Jahre · {zinssatz.toFixed(1)}% p.a.</p>
          </div>

          {/* Jährliche Zinsen Jahr 1 */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs text-gray-500 mb-0.5">Jährliche Zinsen (1. Jahr)</p>
            <p className="text-xl font-bold text-gray-900">{chf(jahresZinsen)}</p>
          </div>

          {/* Tragbarkeit */}
          <div className={`rounded-2xl p-4 ${
            tragbarkeitOk === null
              ? 'bg-gray-50'
              : tragbarkeitOk
              ? 'bg-green-50 border border-green-100'
              : 'bg-red-50 border border-red-100'
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Tragbarkeit (Rate / Einkommen)</p>
                <p className={`text-xl font-bold ${
                  tragbarkeitOk === null ? 'text-gray-900' : tragbarkeitOk ? 'text-green-700' : 'text-red-700'
                }`}>
                  {tragbarkeit !== null ? `${tragbarkeit.toFixed(1)}%` : '–'}
                </p>
              </div>
              {tragbarkeitOk !== null && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${
                  tragbarkeitOk ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {tragbarkeitOk ? 'Erfüllt' : 'Nicht erfüllt'}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Schweizer Richtwert: max. 33% des Einkommens</p>
          </div>

          {/* LTV indicator */}
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
            ltvOk ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <TrendingUp size={15} className="flex-shrink-0" />
            <span>
              Belehnungsgrad: <strong>{ltvPct.toFixed(0)}%</strong>
              {ltvOk ? ' — innerhalb der 80%-Grenze' : ' — über der 80%-Grenze'}
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimer + CTA */}
      <div className="border-t border-gray-100 px-6 py-5 bg-gray-50 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <Info size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500 leading-relaxed">
            Diese Berechnung ist unverbindlich und dient nur zur Orientierung.
            Kontaktieren Sie uns für eine persönliche Beratung.
          </p>
        </div>
        <Link
          to="/kontakt"
          className="flex-shrink-0 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
        >
          Beratung anfragen
        </Link>
      </div>
    </div>
  );
};

export default MortgageCalculator;
