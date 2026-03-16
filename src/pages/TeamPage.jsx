import React from 'react';
import { Helmet } from 'react-helmet';
import Team from '@/components/Team';

const TeamPage = () => {
  return (
    <>
      <Helmet>
        <title>Unser Team - Hans Amonn AG | Bau & Immobilien</title>
        <meta name="description" content="Lernen Sie das erfahrene Team der Hans Amonn AG kennen. Von Reto Amonn als CEO bis zu unseren Architekten und Zeichnern - Expertise seit 1968 in Muri bei Bern." />
      </Helmet>
      
      <div className="pt-8">
        <Team />
      </div>
    </>
  );
};

export default TeamPage;