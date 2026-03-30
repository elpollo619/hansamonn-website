import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Coffee, Building2, Home, Sun, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getNormalizedVisibleProperties } from '@/data/propertiesStore';

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CFG = {
  apartment:   { icon: Home,      badge: 'bg-gray-100 text-gray-700',    label: 'Wohnung' },
  'long-stay': { icon: Coffee,    badge: 'bg-gray-100 text-gray-700',    label: 'Long Stay' },
  hotel:       { icon: Building2, badge: 'bg-gray-100 text-gray-700',    label: 'Hotel' },
  project:     { icon: Sun,       badge: 'bg-gray-100 text-gray-700',    label: 'Ferienhaus' },
};

// ─── Detail URL mapping ───────────────────────────────────────────────────────

const getDetailUrl = (item) =>
  item.link || `/immobilien/${item.id || item.slug}`;

// ─── Search logic ─────────────────────────────────────────────────────────────

function searchProperties(query) {
  if (!query.trim()) return [];
  const q = query.trim().toLowerCase();
  const all = getNormalizedVisibleProperties();
  return all
    .filter((item) => {
      const haystack = [
        item.title    || '',
        item.name     || '',
        item.location || '',
        item.subtitle || '',
        item.description || '',
        ...(item.features || []),
      ].join(' ').toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, 6);
}

// ─── Result Row ───────────────────────────────────────────────────────────────

const ResultRow = ({ item, isActive, onClick }) => {
  const cfg = TYPE_CFG[item.type] || TYPE_CFG.apartment;
  const Icon = cfg.icon;
  const image = item.images?.[0]?.url || '';

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
        isActive ? 'bg-gray-100 ring-1 ring-gray-300' : 'hover:bg-gray-50'
      }`}
    >
      {/* Thumbnail */}
      <div className="w-12 h-12 overflow-hidden flex-shrink-0 bg-gray-100">
        {image ? (
          <img src={image} alt={item.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon size={18} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <MapPin size={10} className="text-gray-400 flex-shrink-0" />
          <p className="text-xs text-gray-500 truncate">{item.location}</p>
        </div>
      </div>

      {/* Type badge */}
      <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium ${cfg.badge}`}>
        <Icon size={10} />
        {cfg.label}
      </span>

      <ArrowRight size={14} className="flex-shrink-0 text-gray-300" />
    </button>
  );
};

// ─── GlobalSearch overlay ─────────────────────────────────────────────────────

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setActiveIdx(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Real-time search
  useEffect(() => {
    setResults(searchProperties(query));
    setActiveIdx(-1);
  }, [query]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && results[activeIdx]) {
        handleSelect(results[activeIdx]);
      }
    }
  };

  const handleSelect = useCallback((item) => {
    navigate(getDetailUrl(item));
    onClose();
  }, [navigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          {/* Search box */}
          <motion.div
            key="search-box"
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-[12vh] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white border border-gray-200 overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
              {/* Input row */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                <Search size={20} className="text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Objekt suchen… z.B. Kerzers, Long Stay, Hotel"
                  className="flex-1 text-base text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 hover:bg-gray-100 transition-colors"
                    aria-label="Suche leeren"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 transition-colors ml-1"
                  aria-label="Schliessen"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Results */}
              {query.trim() && (
                <div className="p-2 max-h-80 overflow-y-auto">
                  {results.length > 0 ? (
                    <>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-1.5">
                        Immobilien · {results.length} Treffer
                      </p>
                      {results.map((item, i) => (
                        <ResultRow
                          key={item.id}
                          item={item}
                          isActive={i === activeIdx}
                          onClick={() => handleSelect(item)}
                        />
                      ))}
                    </>
                  ) : (
                    <div className="py-10 text-center">
                      <Search size={28} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Keine Ergebnisse für „{query}"</p>
                      <p className="text-xs text-gray-400 mt-1">Versuchen Sie einen anderen Suchbegriff</p>
                    </div>
                  )}
                </div>
              )}

              {/* Hint when empty */}
              {!query.trim() && (
                <div className="px-4 py-5">
                  <p className="text-xs text-gray-400 text-center">
                    Tippen Sie, um Immobilien zu suchen
                  </p>
                </div>
              )}

              {/* Keyboard hint */}
              <div className="border-t border-gray-100 px-4 py-2 flex items-center gap-4 text-[11px] text-gray-400">
                <span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">↑↓</kbd> Navigieren</span>
                <span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">↵</kbd> Öffnen</span>
                <span><kbd className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">Esc</kbd> Schliessen</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearch;
