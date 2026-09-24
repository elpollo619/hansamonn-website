import React from 'react';
import { motion } from 'framer-motion';
import ModelViewer3D from '@/components/ModelViewer3D';
import { BUILDING_MODELS } from '@/data/models';

/** Projects that have a 3D model built from their plans (project slug → model ids). */
export const PROJECT_MODELS = {
  'ns-hotel-kerzers': ['a14'],
  'wohnkomplex-allmendstrasse-kerzers': ['a4'],
  'baeren-kerzers': ['br'], 'renovation-hoeheweg-muri': ['hw'], 'neubau-wohnhaus-bremgarten': ['bg'],
};

/**
 * Model3DSection — "Aus unseren Plänen" block with the interactive plan model(s).
 */
export default function Model3DSection({
  ids = ['a14'],
  eyebrow = 'Das Gebäude in 3D',
  title = 'Aus unseren Plänen',
  className = 'surface-warm',
}) {
  const single = ids.length === 1 ? BUILDING_MODELS[ids[0]] : null;
  return (
    <section className={`py-20 md:py-24 ${className}`}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-12 gap-6 lg:items-end mb-8"
        >
          <div className="lg:col-span-7">
            <p className="eyebrow mb-3">{eyebrow}</p>
            <h2 className="display-heading uppercase text-3xl md:text-4xl">{title}</h2>
          </div>
          <p className="lg:col-span-5 text-gray-600 leading-relaxed">
            Diese Modelle entstehen direkt aus unseren Ausführungsplänen im Massstab 1:50 —
            Wände, Fenster und Geschosse wie gezeichnet. Drehen Sie das Gebäude, blenden Sie
            Geschosse ein oder öffnen Sie die Explosionsansicht.
          </p>
        </motion.div>

        <div className="relative h-[66vh] min-h-[440px] md:h-[76vh] bg-gradient-to-b from-white to-[#f3efe7] border border-gray-100 overflow-hidden">
          <ModelViewer3D ids={ids} className="h-full" />
        </div>

        {single && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {single.facts.map((f) => (
              <div key={f.label} className="border-t border-gray-200 pt-3">
                <div className="font-display uppercase text-2xl md:text-3xl font-semibold text-[#0F1B2D] leading-none">{f.value}</div>
                <div className="text-xs text-gray-500 mt-1">{f.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
