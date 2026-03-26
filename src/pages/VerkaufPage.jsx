import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ArrowLeft, Tag, MapPin, Mail, ArrowRight, Home } from 'lucide-react';

// ─── Placeholder card component ──────────────────────────────────────────────

const PropertyCard = ({ title, location, price, type, imagePlaceholder, badge }) => (
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group">
    {/* Image area */}
    <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
      {imagePlaceholder}
      {badge && (
        <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {badge}
        </span>
      )}
    </div>
    {/* Info */}
    <div className="p-5">
      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">{type}</p>
      <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">{title}</h3>
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
        <MapPin size={12} /> {location}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Kaufpreis</p>
          <p className="text-lg font-bold text-gray-900">{price}</p>
        </div>
        <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors">
          Details <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </div>
);

// ─── Main page ────────────────────────────────────────────────────────────────

const VerkaufPage = () => (
  <>
    <Helmet>
      <title>Immobilien zum Verkauf | Hans Amonn AG</title>
      <meta
        name="description"
        content="Kaufen Sie Immobilien von der Hans Amonn AG – Eigentumswohnungen und Renditeobjekte in der Region."
      />
    </Helmet>

    <section className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        {/* Back link */}
        <Link
          to="/immobilien"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-10"
        >
          <ArrowLeft size={15} /> Zurück zur Übersicht
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Building2 size={22} className="text-emerald-700" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Kaufobjekte</p>
              <h1 className="text-3xl font-bold text-gray-900">Verkauf</h1>
            </div>
          </div>
          <p className="text-gray-500 max-w-xl">
            Hochwertige Immobilien zum Erwerb — von Eigentumswohnungen bis zu Renditeobjekten
            in attraktiven Lagen der Region.
          </p>
        </motion.div>

        {/* Empty state / coming soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="bg-white rounded-2xl border border-dashed border-emerald-200 p-16 text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
              <Home size={30} className="text-emerald-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Aktuell keine Kaufobjekte verfügbar</h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
              Wir bereiten neue Kaufobjekte vor. Kontaktieren Sie uns, um bei Verfügbarkeit benachrichtigt zu werden — oder hinterlassen Sie Ihre Wünsche in unserer Anfrage.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                <Mail size={14} /> Kontakt aufnehmen
              </Link>
              <Link
                to="/immobilien/anfrage"
                className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                <Tag size={14} /> Kaufanfrage stellen
              </Link>
            </div>
          </div>

          {/* Info strip */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Building2, title: 'Eigentumswohnungen', desc: 'Neubauten und Bestandsobjekte in bevorzugten Lagen.' },
              { icon: Tag,       title: 'Faire Kaufpreise',   desc: 'Transparente Preise in CHF ohne versteckte Kosten.' },
              { icon: MapPin,    title: 'Regionale Objekte',  desc: 'Immobilien in Kerzers, Münchenbuchsee, Muri und Umgebung.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-200 p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  </>
);

export default VerkaufPage;
