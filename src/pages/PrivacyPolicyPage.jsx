import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Datenschutzerklärung - Hans Amonn AG</title>
        <meta name="description" content="Datenschutzerklärung der Hans Amonn AG. Erfahren Sie, wie wir Ihre Daten schützen und verwenden." />
      </Helmet>

      <PageHero eyebrow="Rechtliches" title="Datenschutzerklärung" size="sm" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 py-16 md:py-20"
      >
        <div className="max-w-3xl divide-y divide-gray-100 border-y border-gray-100">
          <section className="py-8">
            <h2 className="font-display uppercase text-xl font-semibold text-[#0F1B2D] mb-4">Datenschutz</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
              vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf
              unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben
              werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre
              ausdrückliche Zustimmung nicht an Dritte weitergegeben.
            </p>
          </section>

          <section className="py-8">
            <h2 className="font-display uppercase text-xl font-semibold text-[#0F1B2D] mb-4">Kontaktformular</h2>
            <p className="text-gray-600 leading-relaxed">
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular
              inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall
              von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
          </section>
        </div>
      </motion.div>
    </>
  );
};

export default PrivacyPolicyPage;
