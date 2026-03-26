import React from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
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
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Hans Amonn AG – Immobilien & Vermietung" />
        <meta property="og:description" content="Immobilien, Ferienwohnungen und Langzeitmiete in der Schweiz. Hans Amonn AG." />
        <meta property="og:image" content="https://www.hansamonn.ch/og-image.jpg" />
        <meta property="og:url" content="https://www.hansamonn.ch" />
        <meta property="og:site_name" content="Hans Amonn AG" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <StructuredData data={organizationSchema} />

      <Hero />
      <StatsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
};

export default HomePage;