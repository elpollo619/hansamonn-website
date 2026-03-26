import React from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/Hero';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsletterSection from '@/components/NewsletterSection';
import StructuredData from '@/components/StructuredData';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Hans Amonn AG',
  url: 'https://www.hansamonn.ch',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CH',
  },
};

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Hans Amonn AG - Ihr Partner für Bau und Immobilien seit 1968</title>
        <meta name="description" content="Hans Amonn AG - Qualität, Zuverlässigkeit und Innovation in der Bau- und Immobilienbranche. Massgeschneiderte Lösungen von der Planung bis zur Umsetzung in Muri bei Bern." />
      </Helmet>
      <StructuredData data={organizationSchema} />

      <Hero />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
};

export default HomePage;