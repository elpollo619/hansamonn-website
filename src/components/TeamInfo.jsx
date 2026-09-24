import React from 'react';
import { motion } from 'framer-motion';

const BRAND = 'var(--brand-color, #1D3D78)';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

const PILLARS = [
  {
    title: 'Familiäre Führung',
    text: 'Reto und Roberta Amonn führen das Unternehmen gemeinsam mit der Erfahrung und dem Engagement eines echten Familienbetriebs, der Werte wie Vertrauen und Qualität hochhält.',
  },
  {
    title: 'Bewährte Partnerschaften',
    text: 'Martin Brand arbeitet seit fast den Anfängen mit Reto zusammen. Diese langjährige Partnerschaft garantiert Kontinuität und bewährte Qualität in allen Projekten.',
  },
  {
    title: 'Vielseitige Unterstützung',
    text: 'Mit Daniel als IT-Support sowie jungen Talenten wie Beatriz, Rayna und Sirin verbinden wir traditionelle Handwerkskunst mit modernster Technologie und umfassenden Service-Lösungen.',
  },
];

const TeamInfo = () => {

  return (
    <>
      {/* Family Business Heritage + Partnership Highlight */}
      <section className="surface-warm py-20 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="grid gap-8 lg:grid-cols-12 lg:items-end mb-14">
            <div className="lg:col-span-6 min-w-0">
              <p className="eyebrow mb-3">Hans Amonn AG</p>
              <h2 className="display-heading uppercase text-3xl md:text-4xl hyphens-auto break-words">
                Familienunternehmen mit Herz
              </h2>
            </div>
            <p className="lg:col-span-6 text-gray-600 leading-relaxed text-lg">
              Die Hans Amonn AG ist ein echtes Familienunternehmen. Mit Reto und Roberta Amonn an der Spitze,
              unterstützt von langjährigen Partnern wie Martin Brand und einem vielseitigen Team aus erfahrenen
              Fachkräften und jungen Talenten, vereinen wir Tradition mit Innovation. Diese
              familiäre Atmosphäre spiegelt sich in unserer persönlichen Betreuung und dem Engagement für jeden
              einzelnen Kunden wider.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-white border border-gray-100 hover:border-gray-300 transition-colors p-8"
              >
                <div
                  className="font-display text-sm font-semibold tracking-wider mb-6"
                  style={{ color: BRAND }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display uppercase text-xl font-semibold text-[#0F1B2D] mb-3">
                  {p.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white py-20 md:py-24">
        <motion.div {...fadeUp} className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-t border-gray-200 pt-12">
            <div className="max-w-2xl">
              <h2 className="display-heading uppercase text-3xl md:text-4xl mb-4">
                Möchten Sie unser Team kennenlernen?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Vereinbaren Sie einen Termin für ein persönliches Gespräch und lernen Sie
                die Menschen hinter Ihren zukünftigen Projekten kennen.
              </p>
            </div>
            <a
              href="mailto:office@reto-amonn.ch"
              className="shrink-0 self-start md:self-auto inline-block text-white px-6 py-3 text-sm font-semibold transition-colors"
              style={{ backgroundColor: BRAND }}
              onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
              onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
            >
              Termin vereinbaren
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default TeamInfo;
