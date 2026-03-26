import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'ha_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice) => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl"
        >
          <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="flex-1 text-sm text-gray-600 leading-relaxed">
              Diese Website verwendet Cookies für eine bessere Nutzererfahrung. Mit der weiteren
              Nutzung stimmen Sie der Verwendung von Cookies gemäß unserer{' '}
              <a
                href="/datenschutz"
                className="underline text-gray-800 hover:text-black transition-colors"
              >
                Datenschutzrichtlinie
              </a>{' '}
              zu.
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleChoice('declined')}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors rounded"
              >
                Ablehnen
              </button>
              <button
                onClick={() => handleChoice('accepted')}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition-colors rounded"
              >
                Akzeptieren
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
