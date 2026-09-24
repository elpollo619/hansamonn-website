import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { getProjectById } from '@/data/projectsStore';
import ProjectGallery from '@/components/ProjectGallery';
import ProjectInfo from '@/components/ProjectInfo';
import ProjectImages from '@/components/ProjectImages';
import Lightbox from '@/components/Lightbox';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHero from '@/components/PageHero';
import Model3DSection, { PROJECT_MODELS } from '@/components/Model3DSection';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const foundProject = getProjectById(id);
    setProject(foundProject);
    window.scrollTo(0, 0);
  }, [id]);

  const openLightbox = (imageUrl) => {
    setLightboxImage(imageUrl);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const handleContactClick = () => {
    navigate('/kontakt');
  };

  if (!project) {
    return <div className="text-center py-24 text-gray-600">Projekt nicht gefunden.</div>;
  }

  // The top gallery shows the first three photos — only list the rest below
  let shown = 0;
  const moreGallery = (project.gallery || []).filter((item) => item.type !== 'image' || ++shown > 3);

  return (
    <>
      <Helmet>
        <title>{project.title} - Hans Amonn AG</title>
        <meta name="description" content={project.description} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <PageHero
          image={project.coverImage}
          size="sm"
          back={{ to: '/projekte', label: 'Zurück zu den Projekten' }}
          eyebrow={[project.category?.replace('-', ' & '), project.location, project.year].filter(Boolean).join(' · ')}
          title={<span className="break-words hyphens-auto">{project.title}</span>}
        />

        <div className="bg-white">
          {project.gallery?.find(item => item.type === 'image') && <ProjectGallery project={project} onImageClick={openLightbox} />}
          <ProjectInfo project={project} onButtonClick={handleContactClick} />
          {PROJECT_MODELS[project.slug] && <Model3DSection ids={PROJECT_MODELS[project.slug]} />}
          {moreGallery.some((item) => item.type !== 'header') && (
            <ProjectImages project={{ ...project, gallery: moreGallery }} onImageClick={openLightbox} />
          )}
        </div>
      </motion.div>

      {lightboxImage && (
        <Lightbox
          images={[{ url: lightboxImage }]}
          initialIndex={0}
          onClose={closeLightbox}
        />
      )}
    </>
  );
};

export default ProjectDetailPage;