import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Datenschutzerklärung - Hans Amonn AG</title>
        <meta name="description" content="Datenschutzerklärung der Hans Amonn AG. Erfahren Sie, wie wir Ihre Daten schützen und verwenden." />
      </Helmet>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <h1 className="text-4xl font-bold mb-8 gradient-text">Datenschutzerklärung</h1>
        <div className="bg-white p-8 rounded-lg border border-gray-100">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Datenschutz</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten 
            vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf 
            unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben 
            werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre 
            ausdrückliche Zustimmung nicht an Dritte weitergegeben.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 mt-8 text-gray-800">Kontaktformular</h2>
          <p className="text-gray-600 leading-relaxed">
            Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular 
            inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall 
            von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default PrivacyPolicyPage;