import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, GitCompare } from 'lucide-react';
import { useComparison } from '@/context/ComparisonContext';
import { getNormalizedVisibleProperties } from '@/data/propertiesStore';

const CompareBar = () => {
  const { compared, clearComparison } = useComparison();

  // Look up property data for each selected ID
  const allProperties = getNormalizedVisibleProperties();
  const selectedProperties = compared.map(
    (id) => allProperties.find((p) => p.id === id) || { id, title: id, images: [] }
  );

  return (
    <AnimatePresence>
      {compared.length > 0 && (
        <motion.div
          key="compare-bar"
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="container mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Left: icon + count */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <GitCompare size={15} className="text-gray-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700 hidden sm:block">
                  {compared.length} {compared.length === 1 ? 'Objekt' : 'Objekte'} ausgewählt
                </span>
                <span className="text-sm font-semibold text-gray-700 sm:hidden">
                  {compared.length} ausgewählt
                </span>
              </div>

              {/* Middle: property thumbnails/names (desktop only) */}
              <div className="hidden md:flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                {selectedProperties.map((prop) => {
                  const imgSrc =
                    prop.images && prop.images[0]
                      ? typeof prop.images[0] === 'string'
                        ? prop.images[0]
                        : prop.images[0].url
                      : null;

                  return (
                    <div
                      key={prop.id}
                      className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 flex-shrink-0"
                    >
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={prop.title}
                          className="w-8 h-8 object-cover rounded-md flex-shrink-0"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-200 rounded-md flex-shrink-0" />
                      )}
                      <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
                        {prop.title || prop.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={clearComparison}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Vergleich zurücksetzen"
                >
                  <X size={16} />
                </button>

                <Link
                  to="/vergleich"
                  className="inline-flex items-center gap-2 text-white font-semibold px-4 py-2 transition-colors text-sm"
                  style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                  onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                  onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
                >
                  Vergleichen
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompareBar;
