import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Tag, MapPin, Mail } from 'lucide-react';
import PageHero from '@/components/PageHero';

const BRAND = 'var(--brand-color, #1D3D78)';

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

    <PageHero
      back={{ to: '/immobilien', label: 'Zurück zur Übersicht' }}
      eyebrow="Immobilien"
      title={<>Immobilien zum <br />Verkauf</>}
      subtitle={
        <>
          Hochwertige Immobilien zum Erwerb, von Eigentumswohnungen bis zu Renditeobjekten
          in attraktiven Lagen der Region.
        </>
      }
    />

    <section className="bg-white py-20 md:py-24">
      <div className="container mx-auto px-6">
        {/* Empty state / coming soon */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white border border-dashed border-gray-300 px-6 py-16 md:p-20 text-center mb-10">
            <Building2 size={34} className="mx-auto mb-6" style={{ color: BRAND }} />
            <h2 className="display-heading uppercase text-3xl md:text-4xl mb-4">Aktuell keine Kaufobjekte verfügbar</h2>
            <p className="text-gray-600 leading-relaxed max-w-md mx-auto mb-8">
              Wir bereiten neue Kaufobjekte vor. Kontaktieren Sie uns, um bei Verfügbarkeit benachrichtigt zu werden.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 text-white px-6 py-3 text-sm font-semibold transition-colors"
                style={{ backgroundColor: BRAND }}
                onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
              >
                <Mail size={15} /> Kontakt aufnehmen
              </Link>
              <Link
                to="/immobilien/anfrage"
                className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-3 text-sm font-semibold transition-colors"
              >
                <Tag size={15} /> Kaufanfrage stellen
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
              <div key={title} className="bg-white p-8">
                <Icon size={24} className="mb-5" style={{ color: BRAND }} />
                <h3 className="font-display uppercase text-xl font-semibold text-[#0F1B2D] mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  </>
);

export default VerkaufPage;
