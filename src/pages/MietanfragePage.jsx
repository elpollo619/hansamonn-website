import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, ChevronRight, Phone, Mail } from 'lucide-react';
import MietanfrageForm from '@/components/MietanfrageForm';

export default function MietanfragePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-10">
          <Link to="/immobilien" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm mb-5 transition-colors">
            <ChevronRight size={14} className="rotate-180" /> Immobilien
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                <ClipboardList size={12} /> Mietanfrage
              </div>
              <h1 className="text-3xl md:text-4xl font-light text-gray-900">Mietanfrage stellen</h1>
              <p className="text-gray-500 mt-2">Wir antworten innerhalb von 24 Stunden.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 text-sm">
              <a href="tel:+41319518554" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                <Phone size={14} /> +41 (0)31 951 85 54
              </a>
              <a href="mailto:office@reto-amonn.ch" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                <Mail size={14} /> office@reto-amonn.ch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-10">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MietanfrageForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
