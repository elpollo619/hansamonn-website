import React from 'react';
import { Helmet } from 'react-helmet';
import Contact from '@/components/Contact';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Kontakt – Hans Amonn AG</title>
        <meta name="description" content="Kontaktieren Sie Hans Amonn AG in Muri bei Bern. Telefon, E-Mail und Kontaktformular für Immobilien, Mietanfragen und Beratung." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Kontakt – Hans Amonn AG" />
        <meta property="og:description" content="Kontaktieren Sie Hans Amonn AG in Muri bei Bern. Wir freuen uns auf Ihre Anfrage." />
        <meta property="og:url" content="https://www.hansamonn.ch/kontakt" />
        <meta property="og:site_name" content="Hans Amonn AG" />
        <meta name="twitter:card" content="summary" />
      </Helmet>
      
      <div className="pt-8">
        <Contact />
      </div>
    </>
  );
};

export default ContactPage;