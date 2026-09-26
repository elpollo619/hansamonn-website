import React from 'react';
import { Helmet } from 'react-helmet';
import Team from '@/components/Team';
import PageHero from '@/components/PageHero';

const TeamPage = () => {
  return (
    <>
      <Helmet>
        <title>Unser Team - Hans Amonn AG | Bau & Immobilien</title>
        <meta name="description" content="Lernen Sie das erfahrene Team der Hans Amonn AG kennen. Von Reto Amonn als CEO bis zu unseren Architekten und Zeichnern - Expertise seit 1968 in Muri bei Bern." />
      </Helmet>

      <PageHero
        title="Unser Team"
        subtitle="Lernen Sie die Fachkräfte der Hans Amonn AG kennen, mit Erfahrung und Engagement für Ihre Projekte."
        size="md"
      />

      <Team />
    </>
  );
};

export default TeamPage;
