import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '@/i18n';

/**
 * LanguageSwitcher
 * A compact dropdown that lists all 6 supported languages.
 * Props:
 *   variant: 'light' (default) | 'dark'  — adjusts text/border colors
 */
const LanguageSwitcher = ({ variant = 'light' }) => {
  const { lang, switchLang, languages } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = languages.find((l) => l.code === lang) || languages[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isDark = variant === 'dark';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors select-none
          ${isDark
            ? 'text-white/80 hover:text-white hover:bg-white/10 border border-white/20'
            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-gray-200'
          }`}
      >
        <span>{current.label}</span>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 overflow-hidden"
        >
          {languages.map((l) => (
            <button
              key={l.code}
              role="option"
              aria-selected={l.code === lang}
              onClick={() => { switchLang(l.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors
                ${l.code === lang
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <span className="text-base" aria-hidden="true">{l.flag}</span>
              <span className="font-mono text-xs text-gray-400 w-6">{l.label}</span>
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
