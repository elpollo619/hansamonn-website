import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import RentCalculator from '@/components/RentCalculator';
import PageHero from '@/components/PageHero';

const PreisrechnerPage = () => {
  return (
    <>
      <Helmet>
        <title>Preisrechner | Hans Amonn AG</title>
        <meta
          name="description"
          content="Berechnen Sie unverbindlich Ihren geschätzten Mietpreis für Long Stay, Short Stay oder Wohnungen in Muri bei Bern, Kerzers und Münchenbuchsee."
        />
      </Helmet>

      {/* Hero */}
      <PageHero
        eyebrow="Vermietung"
        title="Mietpreis schnell berechnen"
        subtitle={
          <>
            Wählen Sie Wohnfläche, Standort und Miettyp, Sie erhalten sofort eine unverbindliche
            Preisorientierung für unsere Angebote in der Region Bern.
          </>
        }
        size="sm"
      />

      {/* Calculator */}
      <section className="container mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <RentCalculator />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PreisrechnerPage;
