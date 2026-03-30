import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getVisibleProjects, categories } from '@/data/projectsStore';
import { ArrowRight } from 'lucide-react';

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
    <section id="projects" className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-3">Hans Amonn AG</p>
          <h2 className="text-4xl font-light text-gray-900">
            Unsere <span className="font-black">Projekte</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mt-3 max-w-xl">
            Realisierte und geplante Projekte — von Wohnbau bis Hotel, mit Leidenschaft für Architektur und nachhaltige Bauweise.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              style={activeCategory === category.id ? { backgroundColor: 'var(--brand-color, #1D3D78)' } : {}}
              onMouseOver={e => {
                if (activeCategory !== category.id) e.currentTarget.style.borderColor = 'var(--brand-color, #1D3D78)';
              }}
              onMouseOut={e => {
                if (activeCategory !== category.id) e.currentTarget.style.borderColor = '#e5e7eb';
              }}
              className={`px-5 py-2 text-sm font-medium transition-all duration-200 border ${
                activeCategory === category.id
                  ? 'text-white border-transparent'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid gap-px bg-gray-100 border border-gray-100">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/projekte/${project.id}`}
                className="block bg-white hover:bg-gray-50 transition-colors group"
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0 md:w-5/12">
                    <div className="relative h-64 md:h-full overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={project.coverImage}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span
                        className="absolute top-4 left-4 text-white px-3 py-1 text-xs font-semibold"
                        style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 md:w-7/12 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2">
                        {project.category.replace('-', ' & ')}
                      </p>
                      <h3 className="text-2xl font-light text-gray-900 mb-3 group-hover:text-[#1D3D78] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{project.description}</p>
                    </div>
                    <div className="mt-6 flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--brand-color, #1D3D78)' }}>
                      <span>Details ansehen</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
