import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { projectsData } from '@/components/ProjectData';
import ProjectGallery from '@/components/ProjectGallery';
import ProjectInfo from '@/components/ProjectInfo';
import ProjectImages from '@/components/ProjectImages';
import Lightbox from '@/components/Lightbox';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const foundProject = projectsData.find(p => p.id.toString() === id);
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
    toast({
      title: "🚧 Kontaktfunktion in Kürze verfügbar!",
      description: "Wir arbeiten daran. In der Zwischenzeit erreichen Sie uns per E-Mail. 🚀"
    });
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

          <div className="bg-white rounded-lg overflow-hidden shadow-xl">
            {project.gallery.find(item => item.type === 'image') && <ProjectGallery project={project} onImageClick={openLightbox} />}
            <ProjectInfo project={project} onButtonClick={handleContactClick} />
            <ProjectImages project={project} onImageClick={openLightbox} />
          </div>
        </div>
      </motion.div>

      <Lightbox imageUrl={lightboxImage} onClose={closeLightbox} />
    </>
  );
};

export default ProjectDetailPage;