import React from 'react';
import { Helmet } from 'react-helmet';
import Projects from '@/components/Projects';

const ProjectsPage = () => {
  return (
    <>
      <Helmet>
        <title>Projekte - Hans Amonn AG</title>
        <meta name="description" content="Entdecken Sie unsere realisierten und geplanten Architekturprojekte in Bern und Umgebung. Von Wohnbau bis Hotel - innovative Lösungen für jeden Bedarf." />
      </Helmet>
      
      <div className="pt-8">
        <Projects />
      </div>
    </>
  );
};

export default ProjectsPage;