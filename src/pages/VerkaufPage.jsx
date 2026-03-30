import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ArrowLeft, Tag, MapPin, Mail, ArrowRight } from 'lucide-react';

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

    <section className="min-h-screen bg-white py-16">
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
          <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-3">Hans Amonn AG</p>
          <h1 className="text-4xl font-light text-gray-900">
            Immobilien zum <span className="font-black">Verkauf</span>
          </h1>
          <p className="text-gray-500 max-w-xl mt-3 text-sm">
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
          <div className="bg-white border border-dashed border-gray-300 p-16 text-center mb-10">
            <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <Building2 size={28} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Aktuell keine Kaufobjekte verfügbar</h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
              Wir bereiten neue Kaufobjekte vor. Kontaktieren Sie uns, um bei Verfügbarkeit benachrichtigt zu werden.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
                style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
              >
                <Mail size={14} /> Kontakt aufnehmen
              </Link>
              <Link
                to="/immobilien/anfrage"
                className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <Tag size={14} /> Kaufanfrage stellen
              </Link>
            </div>
          </div>

          {/* Info strip */}
          <div className="grid sm:grid-cols-3 gap-px bg-gray-100 border border-gray-100">
            {[
              { icon: Building2, title: 'Eigentumswohnungen', desc: 'Neubauten und Bestandsobjekte in bevorzugten Lagen.' },
              { icon: Tag,       title: 'Faire Kaufpreise',   desc: 'Transparente Preise in CHF ohne versteckte Kosten.' },
              { icon: MapPin,    title: 'Regionale Objekte',  desc: 'Immobilien in Kerzers, Münchenbuchsee, Muri und Umgebung.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white p-6 flex gap-4 items-start">
                <div className="w-10 h-10 bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} style={{ color: 'var(--brand-color, #1D3D78)' }} />
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
