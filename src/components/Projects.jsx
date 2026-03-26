import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">
            Unsere <span className="font-bold gradient-text">Projekte</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Entdecken Sie eine Auswahl unserer realisierten und geplanten Projekte, 
            die unsere Leidenschaft für innovative Architektur und nachhaltige Bauweise widerspiegeln.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full transition-all duration-300 text-sm font-medium ${
                activeCategory === category.id
                  ? 'brand-gradient text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={`/projekte/${project.id}`} className="block bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
                <div className="md:flex">
                  <div className="md:flex-shrink-0 md:w-1/2 lg:w-5/12">
                    <div className="relative h-64 md:h-full overflow-hidden">
                      <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" src={project.coverImage} alt={project.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                       <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">{project.status}</span>
                    </div>
                  </div>
                  <div className="p-8 md:w-1/2 lg:w-7/12 flex flex-col justify-between">
                    <div>
                      <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">{project.category.replace('-', ' & ')}</div>
                      <h3 className="mt-1 text-2xl leading-tight font-bold text-black group-hover:text-blue-700 transition-colors">{project.title}</h3>
                      <p className="mt-2 text-gray-500">{project.description}</p>
                    </div>
                    <div className="mt-6 flex items-center text-blue-600 font-semibold">
                      <span>Details ansehen</span>
                      <ArrowRight size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
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