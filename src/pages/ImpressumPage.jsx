import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const ImpressumPage = () => {
  return (
    <>
      <Helmet>
        <title>Impressum - Hans Amonn AG</title>
        <meta name="description" content="Impressum und rechtliche Hinweise der Hans Amonn AG. Kontaktinformationen und Unternehmensangaben." />
      </Helmet>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <h1 className="text-4xl font-bold mb-8 gradient-text">Impressum</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Angaben gemäß § 5 TMG</h2>
          <p className="text-gray-600 mb-2">Hans Amonn AG</p>
          <p className="text-gray-600 mb-2">Blümlisalpstrasse 4</p>
          <p className="text-gray-600 mb-6">3074 Muri bei Bern</p>

          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Vertreten durch:</h2>
          <p className="text-gray-600 mb-6">Reto Amonn</p>

          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Kontakt</h2>
          <p className="text-gray-600 mb-2">Telefon: +41 (0)31 951 85 54</p>
          <p className="text-gray-600 mb-6">E-Mail: office@reto-amonn.ch</p>

          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Haftungsausschluss</h2>
          <p className="text-gray-600 leading-relaxed">
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. 
            Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default ImpressumPage;