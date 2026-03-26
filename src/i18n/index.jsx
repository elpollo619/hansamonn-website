import React, { createContext, useContext, useState, useCallback } from 'react';
import de from './de';
import fr from './fr';
import it from './it';
import en from './en';
import es from './es';
import pt from './pt';

export const LANGUAGES = [
  { code: 'de', label: 'DE', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', label: 'FR', flag: '🇫🇷', name: 'Français' },
  { code: 'it', label: 'IT', flag: '🇮🇹', name: 'Italiano' },
  { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
  { code: 'es', label: 'ES', flag: '🇪🇸', name: 'Español' },
  { code: 'pt', label: 'PT', flag: '🇵🇹', name: 'Português' },
];

const translations = { de, fr, it, en, es, pt };

const STORAGE_KEY = 'ha_lang';

/** Detect a sensible default from the browser locale */
function detectDefaultLang() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && translations[stored]) return stored;

  const browser = (navigator.language || navigator.userLanguage || '').toLowerCase();
  if (browser.startsWith('fr')) return 'fr';
  if (browser.startsWith('it')) return 'it';
  if (browser.startsWith('es')) return 'es';
  if (browser.startsWith('pt')) return 'pt';
  if (browser.startsWith('en')) return 'en';
  return 'de'; // Swiss default
}

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(detectDefaultLang);

  const switchLang = useCallback((code) => {
    if (!translations[code]) return;
    setLang(code);
    localStorage.setItem(STORAGE_KEY, code);
  }, []);

  /** Resolves a dot-separated key, e.g. t('vermietung.card.rooms') */
  const t = useCallback(
    (key, vars = {}) => {
      const keys = key.split('.');
      let value = translations[lang];
      for (const k of keys) value = value?.[k];

      // Fallback to German
      if (value === undefined || value === null) {
        value = translations.de;
        for (const k of keys) value = value?.[k];
      }

      // Return arrays/objects as-is (e.g. t('footer.servicesList'), t('immobilien.vermietung.highlights'))
      if (Array.isArray(value) || (value !== null && typeof value === 'object')) return value;

      if (typeof value !== 'string') return key;

      // Variable interpolation: t('hello', { name: 'Reto' }) with "Hello {{name}}"
      return Object.entries(vars).reduce(
        (str, [k, v]) => str.replace(new RegExp(`{{${k}}}`, 'g'), v),
        value
      );
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useTranslation must be used inside <LanguageProvider>');
  return ctx;
};
