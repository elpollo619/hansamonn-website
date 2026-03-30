import React from 'react';
import { motion } from 'framer-motion';

const AdminInfoBox = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        💡 Tipp: Einfache Inhaltsverwaltung
      </h3>
      <p className="text-gray-700">
        Alle Änderungen werden automatisch gespeichert und sind sofort auf Ihrer Website sichtbar. 
        Sie können jederzeit Texte, Bilder und Informationen anpassen, ohne technische Kenntnisse zu benötigen.
      </p>
    </motion.div>
  );
};

export default AdminInfoBox;