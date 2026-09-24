import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';

const ImpressumPage = () => {
  return (
    <>
      <Helmet>
        <title>Impressum - Hans Amonn AG</title>
        <meta name="description" content="Impressum und rechtliche Hinweise der Hans Amonn AG. Kontaktinformationen und Unternehmensangaben." />
      </Helmet>

      <PageHero eyebrow="Hans Amonn AG · Rechtliches" title="Impressum" size="sm" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 py-16 md:py-20"
      >
        <div className="max-w-3xl divide-y divide-gray-100 border-y border-gray-100">
          <section className="py-8">
            <h2 className="font-display uppercase text-xl font-semibold text-[#0F1B2D] mb-4">Angaben gemäß § 5 TMG</h2>
            <p className="text-gray-600 leading-relaxed">Hans Amonn AG</p>
            <p className="text-gray-600 leading-relaxed">Blümlisalpstrasse 4</p>
            <p className="text-gray-600 leading-relaxed">3074 Muri bei Bern</p>
          </section>

          <section className="py-8">
            <h2 className="font-display uppercase text-xl font-semibold text-[#0F1B2D] mb-4">Vertreten durch:</h2>
            <p className="text-gray-600 leading-relaxed">Reto Amonn</p>
          </section>

          <section className="py-8">
            <h2 className="font-display uppercase text-xl font-semibold text-[#0F1B2D] mb-4">Kontakt</h2>
            <p className="text-gray-600 leading-relaxed">Telefon: +41 (0)31 951 85 54</p>
            <p className="text-gray-600 leading-relaxed">E-Mail: office@reto-amonn.ch</p>
          </section>

          <section className="py-8">
            <h2 className="font-display uppercase text-xl font-semibold text-[#0F1B2D] mb-4">Haftungsausschluss</h2>
            <p className="text-gray-600 leading-relaxed">
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links.
              Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
            </p>
          </section>
        </div>
      </motion.div>
    </>
  );
};

export default ImpressumPage;
