import React from 'react';
import { Helmet } from 'react-helmet';
import About from '@/components/About';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>Über uns - Amonn Architektur Bern</title>
        <meta name="description" content="Lernen Sie unser erfahrenes Architekturbüro in Bern kennen. Seit über 25 Jahren gestalten wir innovative und nachhaltige Lebensräume." />
      </Helmet>
      
      <div className="pt-8">
        <About />
      </div>
    </>
  );
};

export default AboutPage;