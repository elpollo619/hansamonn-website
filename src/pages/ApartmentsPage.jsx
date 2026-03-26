import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Bell, ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function ApartmentsPage() {
  return (
    <div className="bg-white">
      <Helmet>
        <title>Mietwohnungen – Hans Amonn AG</title>
        <meta name="description" content="Moderne Mietwohnungen in Kerzers und Umgebung. Kontaktieren Sie uns für aktuelle Verfügbarkeit." />
      </Helmet>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="relative container mx-auto px-6 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/immobilien" className="inline-flex items-center gap-2 text-slate-300/70 hover:text-white text-sm mb-6 transition-colors">
              <ChevronRight size={14} className="rotate-180" /> Immobilien
            </Link>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full mb-5">
              <Home size={12} /> Apartments
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-5">Apartments</h1>
            <p className="text-slate-200/70 text-lg max-w-2xl">
              Mietwohnungen und Apartments in Kerzers und Umgebung.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Empty state */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Home size={32} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Aktuell keine Wohnungen verfügbar</h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Wir haben derzeit keine freien Mietwohnungen. Lassen Sie sich auf unsere Warteliste setzen — wir informieren Sie sobald etwas verfügbar wird.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:office@reto-amonn.ch?subject=Warteliste%20Wohnung&body=Ich%20m%C3%B6chte%20auf%20die%20Warteliste%20f%C3%BCr%20eine%20Mietwohnung%20gesetzt%20werden."
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <Bell size={15} /> Auf Warteliste setzen
              </a>
              <p className="text-xs text-gray-400 mt-2">Wir melden uns, sobald etwas frei wird.</p>
            </div>
          </motion.div>

          {/* Coming soon banner */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto mt-16 bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-3">
              <Clock size={15} className="text-blue-400" />
              <span className="font-medium text-gray-700">Weitere Apartments folgen</span>
            </div>
            <p className="text-sm text-gray-400 mb-5">Neue Objekte werden laufend ergänzt. Schauen Sie regelmässig vorbei oder kontaktieren Sie uns direkt.</p>
            <Link
              to="/immobilien/anfrage"
              className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              Zur Mietanfrage <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
