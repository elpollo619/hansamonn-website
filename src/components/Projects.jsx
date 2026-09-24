import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TiltCard from '@/components/TiltCard';
import ProjectCover from '@/components/ProjectCover';
import { Link } from 'react-router-dom';
import { getVisibleProjects, categories } from '@/data/projectsStore';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';

// Projects with an interactive 3D model built from their plans
const HAS_3D_MODEL = new Set(['ns-hotel-kerzers', 'wohnkomplex-allmendstrasse-kerzers', 'baeren-kerzers', 'renovation-hoeheweg-muri', 'neubau-wohnhaus-bremgarten']);

const BRAND = 'var(--brand-color, #1D3D78)';

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('alle');
  const [projectsData, setProjectsData] = useState(() => getVisibleProjects());

  useEffect(() => {
    setProjectsData(getVisibleProjects());
  }, []);

  const filteredProjects = activeCategory === 'alle'
    ? projectsData
    : projectsData.filter(project => project.category === activeCategory);

  return (
    <>
      {/* Header */}
      <PageHero
        eyebrow="Hans Amonn AG"
        title="Unsere Projekte"
        subtitle="Realisierte und geplante Projekte — von Wohnbau bis Hotel, mit Leidenschaft für Architektur und nachhaltige Bauweise."
      />

      <section id="projects" className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                style={activeCategory === category.id ? { backgroundColor: BRAND } : {}}
                className={`px-4 py-2 text-sm font-semibold transition-colors border ${
                  activeCategory === category.id
                    ? 'text-white border-transparent'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <div className="grid gap-3">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <TiltCard max={2.5}>
                <Link
                  to={`/projekte/${project.id}`}
                  className="block bg-white border border-gray-100 hover:border-gray-300 transition-colors group"
                >
                  <div className="md:flex">
                    <div className="md:flex-shrink-0 md:w-5/12">
                      <div className="relative h-64 md:h-full md:min-h-[320px] overflow-hidden bg-gray-100">
                        <ProjectCover
                          src={project.coverImage}
                          alt={project.title}
                          label={project.status === 'In Planung' || project.status === 'In Ausführung' ? `${project.status} · Bilder folgen` : undefined}
                          className="group-hover:scale-105 transition-transform duration-700"
                        />
                        <span
                          className="absolute top-4 left-4 text-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
                          style={{ backgroundColor: BRAND }}
                        >
                          {project.status}
                        </span>
                        {HAS_3D_MODEL.has(project.slug) && (
                          <span className="absolute top-4 right-4 bg-white/95 text-[#0F1B2D] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider">
                            3D-Modell
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-8 md:p-10 md:w-7/12 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                          {project.category.replace('-', ' & ')}
                        </p>
                        <h3 className="font-display uppercase text-2xl md:text-3xl font-semibold text-[#0F1B2D] leading-tight mb-4">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{project.description}</p>
                      </div>
                      <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all" style={{ color: BRAND }}>
                        <span>Details ansehen</span>
                        <ArrowRight size={15} />
                      </div>
                    </div>
                  </div>
                </Link>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;
