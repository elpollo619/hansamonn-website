import React from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/Hero';
import TestimonialsSection from '@/components/TestimonialsSection';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Hans Amonn AG - Ihr Partner für Bau und Immobilien seit 1968</title>
        <meta name="description" content="Hans Amonn AG - Qualität, Zuverlässigkeit und Innovation in der Bau- und Immobilienbranche. Massgeschneiderte Lösungen von der Planung bis zur Umsetzung in Muri bei Bern." />
      </Helmet>

      <Hero />
      <TestimonialsSection />
    </>
  );
};

export default HomePage;