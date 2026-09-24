import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import MietanfrageForm from '@/components/MietanfrageForm';
import { Helmet } from 'react-helmet';
import PageHero from '@/components/PageHero';

export default function MietanfragePage() {
  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Mietanfrage – Hans Amonn AG</title>
        <meta name="description" content="Senden Sie uns Ihre Mietanfrage. Wir melden uns innerhalb von 24 Stunden mit einer Antwort." />
      </Helmet>
      {/* Header */}
      <PageHero
        back={{ to: '/immobilien', label: 'Immobilien' }}
        eyebrow="Mietanfrage"
        title="Mietanfrage stellen"
        subtitle="Wir antworten innerhalb von 24 Stunden."
        size="sm"
      >
        <a
          href="tel:+41319518554"
          className="inline-flex items-center gap-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 px-5 py-3 text-sm font-semibold transition-colors"
        >
          <Phone size={15} /> +41 (0)31 951 85 54
        </a>
        <a
          href="mailto:office@reto-amonn.ch"
          className="inline-flex items-center gap-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 px-5 py-3 text-sm font-semibold transition-colors"
        >
          <Mail size={15} /> office@reto-amonn.ch
        </a>
      </PageHero>

      {/* Form */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MietanfrageForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
