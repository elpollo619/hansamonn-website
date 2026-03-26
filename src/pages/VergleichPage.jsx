import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X, RotateCcw, GitCompare } from 'lucide-react';
import { useComparison } from '@/context/ComparisonContext';
import { getPropertyById, getNormalizedVisibleProperties } from '@/data/propertiesStore';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPropertyData(id) {
  // Try propertiesStore first
  const raw = getPropertyById(id);
  if (raw) return raw;
  // Fallback: normalised list
  const norm = getNormalizedVisibleProperties().find((p) => p.id === id);
  return norm || null;
}

function getImageSrc(prop) {
  if (!prop) return null;
  const imgs = prop.images || [];
  if (!imgs.length) return null;
  const first = imgs[0];
  if (typeof first === 'string') return first;
  return first.url || null;
}

function formatPrice(prop) {
  if (!prop) return '—';
  const price = prop.priceFrom || prop.price;
  if (!price) return 'Auf Anfrage';
  const period = prop.pricePeriod || 'Mt.';
  return `CHF ${price.toLocaleString('de-CH')} / ${period}`;
}

function getStatus(prop) {
  return prop?.status || '—';
}

function getFeatures(prop) {
  return Array.isArray(prop?.features) ? prop.features : [];
}

// Collect all unique features across all selected properties
function collectAllFeatures(properties) {
  const set = new Set();
  properties.forEach((p) => getFeatures(p).forEach((f) => set.add(f)));
  return Array.from(set);
}

// ─── Table Row helpers ────────────────────────────────────────────────────────

const ROW_LABEL_CLASS = 'text-xs font-semibold text-gray-500 uppercase tracking-wide py-3 pr-4 whitespace-nowrap w-36';
const CELL_CLASS = 'text-sm text-gray-800 py-3 px-3 text-center';

function FeatureCell({ hasFeature }) {
  return (
    <td className={CELL_CLASS}>
      {hasFeature ? (
        <div className="flex justify-center">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Check size={12} className="text-green-700" />
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
            <X size={12} className="text-gray-400" />
          </div>
        </div>
      )}
    </td>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const VergleichPage = () => {
  const { compared, clearComparison } = useComparison();

  const properties = compared.map(getPropertyData);
  const allFeatures = collectAllFeatures(properties.filter(Boolean));

  const colCount = properties.length;

  return (
    <>
      <Helmet>
        <title>Objektvergleich | Hans Amonn AG</title>
        <meta name="description" content="Vergleichen Sie unsere Mietobjekte direkt nebeneinander." />
      </Helmet>

      {/* Hero bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <Link
                to="/immobilien/vermietung"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
              >
                <ArrowLeft size={14} /> Zurück zu Vermietung
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                  <GitCompare size={17} className="text-green-700" />
                </div>
                <h1 className="text-2xl font-black text-gray-900">Objektvergleich</h1>
              </div>
            </div>

            {compared.length > 0 && (
              <button
                onClick={clearComparison}
                className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <RotateCcw size={14} />
                Zurücksetzen
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 py-10">
        {/* Not enough items */}
        {compared.length < 2 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center py-20"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <GitCompare size={28} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Bitte wählen Sie mindestens 2 Objekte zum Vergleichen aus
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Gehen Sie zurück zur Übersicht und klicken Sie bei den gewünschten Objekten auf
              «Vergleichen».
            </p>
            <Link
              to="/immobilien/vermietung"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              <ArrowLeft size={14} />
              Zur Übersicht
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse min-w-[480px]">
              <thead>
                <tr>
                  {/* Label column spacer */}
                  <th className="w-36" />
                  {properties.map((prop, i) => {
                    if (!prop) return <th key={i} className="px-3 pb-4" />;
                    const imgSrc = getImageSrc(prop);
                    return (
                      <th
                        key={prop.id}
                        className="px-3 pb-4 text-center align-bottom"
                        style={{ width: `${100 / colCount}%` }}
                      >
                        <div className="flex flex-col items-center gap-2">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={prop.name || prop.title}
                              className="w-full max-w-[160px] h-28 object-cover rounded-xl shadow-sm"
                            />
                          ) : (
                            <div className="w-full max-w-[160px] h-28 bg-gray-100 rounded-xl flex items-center justify-center">
                              <span className="text-gray-300 text-xs">Kein Bild</span>
                            </div>
                          )}
                          <span className="text-sm font-bold text-gray-900 text-center leading-snug">
                            {prop.name || prop.title}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {/* Typ */}
                <tr className="bg-gray-50/50">
                  <td className={ROW_LABEL_CLASS}>Typ</td>
                  {properties.map((prop, i) => (
                    <td key={i} className={CELL_CLASS}>
                      {prop?.type || '—'}
                    </td>
                  ))}
                </tr>

                {/* Standort */}
                <tr>
                  <td className={ROW_LABEL_CLASS}>Standort</td>
                  {properties.map((prop, i) => (
                    <td key={i} className={CELL_CLASS}>
                      {prop?.location || prop?.address || '—'}
                    </td>
                  ))}
                </tr>

                {/* Preis */}
                <tr className="bg-gray-50/50">
                  <td className={ROW_LABEL_CLASS}>Preis</td>
                  {properties.map((prop, i) => (
                    <td key={i} className={`${CELL_CLASS} font-semibold text-green-700`}>
                      {formatPrice(prop)}
                    </td>
                  ))}
                </tr>

                {/* Zimmer / Grösse */}
                <tr>
                  <td className={ROW_LABEL_CLASS}>Grösse</td>
                  {properties.map((prop, i) => (
                    <td key={i} className={CELL_CLASS}>
                      {prop?.size ? `${prop.size} m²` : '—'}
                    </td>
                  ))}
                </tr>

                {/* Verfügbarkeit */}
                <tr className="bg-gray-50/50">
                  <td className={ROW_LABEL_CLASS}>Verfügbarkeit</td>
                  {properties.map((prop, i) => {
                    const status = getStatus(prop);
                    const isAvail = status === 'verfügbar';
                    return (
                      <td key={i} className={CELL_CLASS}>
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isAvail
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Feature rows */}
                {allFeatures.length > 0 && (
                  <tr>
                    <td
                      colSpan={colCount + 1}
                      className="pt-6 pb-2 text-xs font-bold text-gray-400 uppercase tracking-widest"
                    >
                      Ausstattung
                    </td>
                  </tr>
                )}

                {allFeatures.map((feature, fi) => (
                  <tr key={feature} className={fi % 2 === 0 ? 'bg-gray-50/50' : ''}>
                    <td className={ROW_LABEL_CLASS}>{feature}</td>
                    {properties.map((prop, i) => (
                      <FeatureCell
                        key={i}
                        hasFeature={getFeatures(prop).includes(feature)}
                      />
                    ))}
                  </tr>
                ))}

                {/* CTA row */}
                <tr>
                  <td className="py-6" />
                  {properties.map((prop, i) => {
                    if (!prop) return <td key={i} />;
                    const link = prop.link || `/immobilien/${prop.id}`;
                    return (
                      <td key={i} className="py-6 px-3 text-center">
                        <Link
                          to={link}
                          className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
                        >
                          Details
                        </Link>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </motion.div>
        )}
      </section>
    </>
  );
};

export default VergleichPage;
