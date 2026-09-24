import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Building, Calendar, Linkedin } from 'lucide-react';

const BRAND = 'var(--brand-color, #1D3D78)';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

const About = () => {
  const stats = [
    { icon: Building, number: '200+', label: 'Projekte realisiert' },
    { icon: Users, number: '2', label: 'Generationen' },
    { icon: Award, number: '55+', label: 'Jahre Erfahrung' },
    { icon: Calendar, number: '1968', label: 'Gegründet' }
  ];

  return (
    <>
      <section id="about" className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid gap-14 lg:grid-cols-12 items-center">
            {/* Text Content */}
            <motion.div {...fadeUp} className="lg:col-span-5 min-w-0">
              <p className="eyebrow mb-3">Hans Amonn AG</p>
              <p className="font-display uppercase text-2xl md:text-3xl font-semibold leading-tight text-[#0F1B2D] mb-6">
                Mit langjähriger Erfahrung und einem engagierten Team bieten wir massgeschneiderte
                Lösungen für Ihre Projekte an – von der Planung bis zur Umsetzung.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Für uns ist Architektur weit mehr als das Planen und Bauen von Gebäuden.
                Es geht darum, Lebensräume zu gestalten, die inspirieren und das Leben der Menschen bereichern.
              </p>

              {/* LinkedIn Link */}
              <a
                href="https://www.linkedin.com/in/hans-amonn-689b7938b"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: BRAND }}
                onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
              >
                <Linkedin className="h-4 w-4" />
                Unser Unternehmensprofil auf LinkedIn
              </a>
            </motion.div>

            {/* Image */}
            <motion.div {...fadeUp} className="lg:col-span-7 min-w-0 relative pb-6 md:pb-0">
              <div className="relative overflow-hidden bg-gray-100 group">
                <img
                  alt="Wohnkomplex Allmendstrasse in Kerzers, ein Projekt der Hans Amonn AG"
                  className="w-full h-80 md:h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/3d1fb89de8fe0a9a5680ca4ecc5b8897.jpg"
                  loading="lazy"
                  decoding="async" />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-2 left-4 md:-bottom-8 md:-left-8 bg-[#0B1220] text-white px-7 py-6">
                <div className="font-display text-5xl font-semibold leading-none mb-2">55+</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white/60">Jahre Erfahrung</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white/60">seit 1968</div>
              </div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <motion.div
            {...fadeUp}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 border-t border-l border-gray-100"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="border-r border-b border-gray-100 px-5 py-8 md:px-8 md:py-10"
              >
                <stat.icon className="w-5 h-5 mb-5" style={{ color: BRAND }} />
                <div className="font-display text-4xl md:text-5xl font-semibold leading-none text-[#0F1B2D] mb-2">
                  {stat.number}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company History Section */}
      <section className="surface-warm py-20 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="max-w-3xl mb-14">
            <p className="eyebrow mb-3">Unsere Geschichte</p>
            <h2 className="display-heading uppercase text-4xl md:text-5xl">
              Tradition und Vision seit 1968
            </h2>
          </motion.div>

          <div className="grid gap-px bg-gray-200 border border-gray-200 md:grid-cols-2">
            {[
              {
                mark: '1968',
                text: 'Die Geschichte der Hans Amonn AG beginnt mit Hans Amonn, einem visionären Möbelschreiner, der nach seinem Lehrabschluss eine Ausbildung zum Architekten absolvierte. Nach mehreren Jahren Berufserfahrung bei renommierten Unternehmen entschloss er sich 1968, seinen Traum zu verwirklichen, und gründete die Hans Amonn AG.',
              },
              {
                mark: 'Anfangsjahre',
                text: 'In den Anfangsjahren lag der Fokus des Unternehmens auf Architektur- und Ingenieuraufträgen. Unter der Leitung von Hans Amonn entwickelte sich die Firma schnell zu einem geschätzten Partner für hochwertige Bauprojekte.',
              },
              {
                mark: '1983',
                text: 'Ein einschneidendes Ereignis traf das Unternehmen im Frühjahr 1983: Hans Amonn verstarb unerwartet an einem Herzinfarkt. Sein Sohn Reto Amonn übernahm daraufhin nahezu über Nacht die Verantwortung für das Familienunternehmen.',
              },
              {
                mark: 'Heute',
                text: 'Heute ist die Hans Amonn AG weit mehr als ein Architekturbüro. Das Unternehmen plant, baut, verkauft und vermietet Liegenschaften und bietet massgeschneiderte Lösungen für seine Kunden. Diese Tradition ist die Grundlage für unsere Zukunft – innovativ, nachhaltig und zuverlässig.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.mark}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-white p-8 md:p-10"
              >
                <div
                  className="font-display uppercase text-3xl md:text-4xl font-semibold leading-none mb-5"
                  style={{ color: BRAND }}
                >
                  {item.mark}
                </div>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
