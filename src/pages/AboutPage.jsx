import React from 'react';
import { Helmet } from 'react-helmet';
import About from '@/components/About';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>Über uns – Hans Amonn AG</title>
        <meta name="description" content="Lernen Sie die Hans Amonn AG kennen – Ihr Partner für Immobilien und Architektur in der Region Bern seit über 55 Jahren." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Über uns – Hans Amonn AG" />
        <meta property="og:description" content="Immobilien und Architektur in der Region Bern seit über 55 Jahren." />
        <meta property="og:site_name" content="Hans Amonn AG" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
      <div className="pt-8">
        <About />
      </div>
    </>
  );
};

export default AboutPage;