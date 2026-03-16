import React from 'react';
import { Helmet } from 'react-helmet';
import Services from '@/components/Services';

const ServicesPage = () => {
  return (
    <>
      <Helmet>
        <title>Leistungen - Hans Amonn AG | Architektur & Immobilien</title>
        <meta name="description" content="Umfassende Architektur- und Immobiliendienstleistungen von Hans Amonn AG. Von der Planung bis zur Bauleitung, Immobilienvermittlung und Projektentwicklung in Muri bei Bern." />
      </Helmet>
      
      <div className="pt-8">
        <Services />
      </div>
    </>
  );
};

export default ServicesPage;