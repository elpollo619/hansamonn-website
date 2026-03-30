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
    return <div className="text-center py-20">Projekt nicht gefunden.</div>;
  }

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
        <div className="container mx-auto px-6 py-12">
          <Link to="/projekte" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft size={18} className="mr-2" />
            Zurück zu den Projekten
          </Link>

          <div className="bg-white overflow-hidden border border-gray-100">
            {project.gallery?.find(item => item.type === 'image') && <ProjectGallery project={project} onImageClick={openLightbox} />}
            <ProjectInfo project={project} onButtonClick={handleContactClick} />
            {project.gallery?.length > 0 && <ProjectImages project={project} onImageClick={openLightbox} />}
          </div>
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