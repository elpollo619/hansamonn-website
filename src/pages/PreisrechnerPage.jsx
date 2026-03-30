import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import RentCalculator from '@/components/RentCalculator';

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
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 mb-5">
              <Calculator size={13} />
              Preisrechner
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
              Mietpreis schnell berechnen
            </h1>

            <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-xl">
              Wählen Sie Wohnfläche, Standort und Miettyp — Sie erhalten sofort eine unverbindliche
              Preisorientierung für unsere Angebote in der Region Bern.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <RentCalculator />
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default PreisrechnerPage;
