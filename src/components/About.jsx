import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Building, Calendar, Linkedin } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Building, number: '200+', label: 'Projekte realisiert' },
    { icon: Users, number: '2', label: 'Generationen' },
    { icon: Award, number: '55+', label: 'Jahre Erfahrung' },
    { icon: Calendar, number: '1968', label: 'Gegründet' }
  ];

  return (
    <section id="about" className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-3">Hans Amonn AG</p>
            <h2 className="text-4xl font-light mb-6 text-gray-900">
              Über <span className="font-black">uns</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Seit unserer Gründung 1968 stehen wir bei der Hans Amonn AG für Qualität, 
              Zuverlässigkeit und Innovation in der Bau- und Immobilienbranche.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Mit langjähriger Erfahrung und einem engagierten Team bieten wir massgeschneiderte 
              Lösungen für Ihre Projekte an – von der Planung bis zur Umsetzung.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Für uns ist Architektur weit mehr als das Planen und Bauen von Gebäuden. 
              Es geht darum, Lebensräume zu gestalten, die inspirieren und das Leben der Menschen bereichern.
            </p>

            {/* LinkedIn Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <a
                href="https://www.linkedin.com/in/hans-amonn-689b7938b"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
              >
                <Linkedin className="mr-3 h-5 w-5" />
                Unser Unternehmensprofil auf LinkedIn
              </a>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--brand-color, #1D3D78)' }} />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden">
              <img
                alt="Wohnkomplex Allmendstrasse in Kerzers, ein Projekt der Hans Amonn AG"
                className="w-full h-96 object-cover"
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/3d1fb89de8fe0a9a5680ca4ecc5b8897.jpg"
                loading="lazy"
                decoding="async" />
            </div>
            
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 bg-white p-6 border border-gray-100"
            >
              <div className="text-3xl font-bold text-gray-900 mb-1">55+</div>
              <div className="text-sm text-gray-600">Jahre Erfahrung</div>
              <div className="text-sm text-gray-600">seit 1968</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Company History Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-white p-8 border border-gray-100">
            <h3 className="text-3xl font-semibold text-gray-900 mb-6">
              Unsere Geschichte – Tradition und Vision seit 1968
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Die Geschichte der Hans Amonn AG beginnt mit Hans Amonn, einem visionären Möbelschreiner, 
                  der nach seinem Lehrabschluss eine Ausbildung zum Architekten absolvierte. Nach mehreren 
                  Jahren Berufserfahrung bei renommierten Unternehmen entschloss er sich 1968, seinen Traum 
                  zu verwirklichen, und gründete die Hans Amonn AG.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  In den Anfangsjahren lag der Fokus des Unternehmens auf Architektur- und Ingenieuraufträgen. 
                  Unter der Leitung von Hans Amonn entwickelte sich die Firma schnell zu einem geschätzten 
                  Partner für hochwertige Bauprojekte.
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Ein einschneidendes Ereignis traf das Unternehmen im Frühjahr 1983: Hans Amonn verstarb 
                  unerwartet an einem Herzinfarkt. Sein Sohn Reto Amonn übernahm daraufhin nahezu über Nacht 
                  die Verantwortung für das Familienunternehmen.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Heute ist die Hans Amonn AG weit mehr als ein Architekturbüro. Das Unternehmen plant, baut, 
                  verkauft und vermietet Liegenschaften und bietet massgeschneiderte Lösungen für seine Kunden. 
                  Diese Tradition ist die Grundlage für unsere Zukunft – innovativ, nachhaltig und zuverlässig.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;