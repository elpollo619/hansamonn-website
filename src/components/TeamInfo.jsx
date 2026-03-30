import React from 'react';
import { motion } from 'framer-motion';

const TeamInfo = () => {

  return (
    <>
      {/* Family Business Heritage */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-12 bg-white rounded-lg p-8 border border-gray-100"
      >
        <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          Familienunternehmen mit Herz
        </h3>
        <p className="text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
          Die Hans Amonn AG ist ein echtes Familienunternehmen. Mit Reto und Roberta Amonn an der Spitze, 
          unterstützt von langjährigen Partnern wie Martin Brand und einem vielseitigen Team aus erfahrenen 
          Fachkräften wie Jhon Alexander und jungen Talenten, vereinen wir Tradition mit Innovation. Diese 
          familiäre Atmosphäre spiegelt sich in unserer persönlichen Betreuung und dem Engagement für jeden 
          einzelnen Kunden wider.
        </p>
      </motion.div>

      {/* Partnership Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45 }}
        viewport={{ once: true }}
        className="mt-8 bg-gray-50 rounded-lg p-8"
      >
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              Familiäre Führung
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Reto und Roberta Amonn führen das Unternehmen gemeinsam mit der Erfahrung und dem 
              Engagement eines echten Familienbetriebs, der Werte wie Vertrauen und Qualität hochhält.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              Bewährte Partnerschaften
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Martin Brand arbeitet seit fast den Anfängen mit Reto zusammen. Diese langjährige 
              Partnerschaft garantiert Kontinuität und bewährte Qualität in allen Projekten.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              Vielseitige Unterstützung
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Mit Daniel als IT-Support, Jhon Alexander für Organisation und Facility Management sowie 
              jungen Talenten wie Beatriz verbinden wir traditionelle Handwerkskunst mit modernster 
              Technologie und umfassenden Service-Lösungen.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Möchten Sie unser Team kennenlernen?
        </h3>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Vereinbaren Sie einen Termin für ein persönliches Gespräch und lernen Sie 
          die Menschen hinter Ihren zukünftigen Projekten kennen.
        </p>
        <a
          href="mailto:office@reto-amonn.ch"
          className="text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 inline-block"
          style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
          onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
          onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
        >
          Termin vereinbaren
        </a>
      </motion.div>
    </>
  );
};

export default TeamInfo;