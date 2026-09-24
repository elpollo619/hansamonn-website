import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';
import TerminbuchungForm from '@/components/TerminbuchungForm';
import PageHero from '@/components/PageHero';

const BRAND = 'var(--brand-color, #1D3D78)';

export default function TerminbuchungPage() {
  return (
    <>
      <Helmet>
        <title>Termin vereinbaren – Hans Amonn AG</title>
        <meta name="description" content="Vereinbaren Sie eine Besichtigung oder ein Beratungsgespräch mit Hans Amonn AG." />
      </Helmet>

      {/* Hero */}
      <PageHero
        eyebrow="Hans Amonn AG · Terminbuchung"
        title="Termin vereinbaren"
        subtitle="Vereinbaren Sie eine Besichtigung oder ein Beratungsgespräch."
        size="sm"
      />

      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-12">

            {/* Form — 3 cols */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 min-w-0"
            >
              <div className="bg-white border border-gray-100 p-6 md:p-10">
                <h2 className="display-heading uppercase text-3xl md:text-4xl mb-8">Terminanfrage senden</h2>
                <TerminbuchungForm />
              </div>
            </motion.div>

            {/* Info — 2 cols */}
            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-5 min-w-0 space-y-6"
            >

              {/* Opening hours */}
              <div className="surface-warm p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <Clock size={18} style={{ color: BRAND }} />
                  <h3 className="font-display uppercase text-xl font-semibold text-[#0F1B2D]">Öffnungszeiten</h3>
                </div>
                <div className="text-sm text-gray-600 divide-y divide-gray-200 border-t border-b border-gray-200">
                  <div className="flex justify-between gap-4 py-3">
                    <span>Montag – Freitag</span>
                    <span className="font-semibold text-gray-900">08:00 – 17:00</span>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <span>Samstag</span>
                    <span className="font-semibold text-gray-900">Nach Vereinbarung</span>
                  </div>
                  <div className="flex justify-between gap-4 py-3">
                    <span>Sonntag</span>
                    <span className="text-gray-400">Geschlossen</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin size={18} style={{ color: BRAND }} />
                  <h3 className="font-display uppercase text-xl font-semibold text-[#0F1B2D]">Adresse</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Hans Amonn AG<br />
                  Kerzers, Schweiz
                </p>
              </div>

              {/* Contact */}
              <div className="border border-gray-100 p-6 md:p-8">
                <h3 className="font-display uppercase text-xl font-semibold text-[#0F1B2D] mb-5">Direkter Kontakt</h3>
                <div className="space-y-3">
                  <a
                    href="tel:+41319518554"
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#1D3D78] transition-colors"
                  >
                    <div className="w-9 h-9 surface-warm flex items-center justify-center flex-shrink-0">
                      <Phone size={14} style={{ color: BRAND }} />
                    </div>
                    +41 (0)31 951 85 54
                  </a>
                  <a
                    href="mailto:office@reto-amonn.ch"
                    className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#1D3D78] transition-colors break-all"
                  >
                    <div className="w-9 h-9 surface-warm flex items-center justify-center flex-shrink-0">
                      <Mail size={14} style={{ color: BRAND }} />
                    </div>
                    office@reto-amonn.ch
                  </a>
                </div>
              </div>

              {/* Info note */}
              <div className="bg-[#0B1220] text-white p-6 md:p-8">
                <p className="text-sm text-white/75 leading-relaxed">
                  <strong className="text-white">Hinweis:</strong> Wir bestätigen Terminwünsche in der Regel innerhalb von 1 Werktag.
                  Bei dringenden Anfragen empfehlen wir einen direkten Anruf.
                </p>
              </div>

            </motion.aside>
          </div>
        </div>
      </section>
    </>
  );
}
