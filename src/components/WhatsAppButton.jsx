import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const WHATSAPP_NUMBER = '41319518554'; // +41 31 951 85 54 (no leading +)
const WHATSAPP_MESSAGE = 'Hallo, ich interessiere mich für Ihre Angebote.';

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="flex items-start gap-2 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 max-w-[220px]"
          >
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-900 leading-snug">Chat mit uns</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Wir antworten schnell auf WhatsApp.</p>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-gray-300 hover:text-gray-500 flex-shrink-0 mt-0.5"
              aria-label="Schliessen"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp kontaktieren"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 rounded-full shadow-lg shadow-green-200 flex items-center justify-center"
        style={{ backgroundColor: '#25D366' }}
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 32 32" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16.004c0 2.352.627 4.643 1.816 6.653L2.667 29.333l6.89-1.787a13.27 13.27 0 0 0 6.447 1.654h.004c7.364 0 13.325-5.973 13.325-13.337 0-7.364-5.961-13.196-13.329-13.196zm0 24.267a11.04 11.04 0 0 1-5.63-1.543l-.403-.24-4.086 1.059 1.085-3.963-.264-.416A11.017 11.017 0 0 1 5 16.004c0-6.072 4.932-11.004 11.004-11.004 6.073 0 11.005 4.932 11.005 11.004 0 6.073-4.932 11.004-11.005 11.004v-.074zm6.04-8.25c-.331-.165-1.957-.965-2.261-1.075-.304-.11-.525-.165-.747.165-.22.33-.855 1.075-1.046 1.297-.193.22-.385.247-.716.083-.33-.165-1.397-.516-2.66-1.64-.984-.875-1.648-1.956-1.84-2.287-.193-.33-.02-.51.145-.675.15-.148.33-.385.496-.578.165-.193.22-.33.33-.55.11-.22.055-.413-.028-.578-.083-.165-.747-1.804-1.023-2.47-.27-.647-.543-.56-.747-.57-.193-.01-.413-.013-.633-.013-.22 0-.578.083-.88.413-.303.33-1.155 1.128-1.155 2.752 0 1.624 1.183 3.193 1.348 3.413.165.22 2.326 3.549 5.637 4.975.788.341 1.403.544 1.882.697.79.25 1.51.215 2.079.13.634-.094 1.957-.8 2.233-1.572.276-.77.276-1.43.193-1.572-.082-.14-.302-.22-.634-.385z"/>
        </svg>

        {/* Pulse ring */}
        <span className="absolute w-14 h-14 rounded-full animate-ping opacity-20" style={{ backgroundColor: '#25D366' }} />
      </motion.a>
    </div>
  );
};

export default WhatsAppButton;
