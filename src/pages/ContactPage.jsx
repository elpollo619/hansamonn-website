import React from 'react';
import { Helmet } from 'react-helmet';
import Contact from '@/components/Contact';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Kontakt - Amonn Architektur Bern</title>
        <meta name="description" content="Kontaktieren Sie Amonn Architektur für Ihr nächstes Bauprojekt. Persönliche Beratung und professionelle Architekturdienstleistungen in Bern." />
      </Helmet>
      
      <div className="pt-8">
        <Contact />
      </div>
    </>
  );
};

export default ContactPage;