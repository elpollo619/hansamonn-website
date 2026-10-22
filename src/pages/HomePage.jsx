import React from 'react';
import { Helmet } from 'react-helmet';
import HomeHero from '@/components/home/HomeHero';
import HomeWohnen from '@/components/home/HomeWohnen';
import HomeBauen from '@/components/home/HomeBauen';
import Home3D from '@/components/home/Home3D';
import HomeFirma from '@/components/home/HomeFirma';
import HomeKontakt from '@/components/home/HomeKontakt';
import TestimonialsSection from '@/components/TestimonialsSection';
import StructuredData from '@/components/StructuredData';
import { OPENING_HOURS_SCHEMA } from '@/data/officeHours';
import RecentlyViewedSection from '@/components/RecentlyViewedSection';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'Hans Amonn AG',
  url: 'https://www.hansamonn.ch',
  legalName: 'Hans Amonn AG',
  foundingDate: '1968',
  telephone: '+41 31 951 85 54',
  email: 'office@reto-amonn.ch',
  vatID: 'CHE-106.957.227 MWST',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Blümlisalpstrasse 4',
    postalCode: '3074',
    addressLocality: 'Muri bei Bern',
    addressRegion: 'BE',
    addressCountry: 'CH',
  },
  openingHoursSpecification: OPENING_HOURS_SCHEMA,
};

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Hans Amonn AG – Architektur und Wohnraum in Muri bei Bern</title>
        <meta name="description" content="Familienunternehmen seit 1968: AMONN ARCHITEKTUR plant Neubauten und Umbauten in der Region Bern. Dazu möblierte Zimmer ab einem Monat, das N's Hotel in Kerzers und die Casa Reto im Tessin." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Hans Amonn AG – Architektur und Wohnraum aus einer Hand" />
        <meta property="og:description" content="Wir planen Gebäude und bieten möblierte Zimmer, ein Hotel und ein Ferienhaus im Tessin an. Seit 1968 in Muri bei Bern." />
        <meta property="og:image" content="https://www.hansamonn.ch/images/ns-hotel/aussen.jpg" />
        <meta property="og:url" content="https://www.hansamonn.ch" />
        <meta property="og:site_name" content="Hans Amonn AG" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <StructuredData data={organizationSchema} />

      <HomeHero />
      <HomeWohnen />
      <HomeBauen />
      <Home3D />
      <TestimonialsSection />
      <HomeFirma />
      <RecentlyViewedSection />
      <HomeKontakt />
    </>
  );
};

export default HomePage;