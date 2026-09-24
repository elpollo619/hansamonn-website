import React from 'react';
import { motion } from 'framer-motion';
import BuildingViewer3D from '@/components/BuildingViewer3D';
import a14Model from '@/data/a14Model';

/** Projects that have a 3D model built from their plans (keyed by project slug). */
export const PROJECT_MODELS = {
  'ns-hotel-kerzers': a14Model,
};

/**
 * Model3DSection — "Das Gebäude in 3D" block with the interactive plan model.
 */
export default function Model3DSection({ model = a14Model, eyebrow = 'Das Gebäude in 3D', className = 'surface-warm' }) {
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
            <h2 className="display-heading uppercase text-4xl md:text-5xl">Aus unseren Plänen</h2>
          </div>
          <p className="lg:col-span-5 text-gray-600 leading-relaxed">
            Dieses Modell entstand direkt aus den Ausführungsplänen von AMONN ARCHITEKTUR.
            Drehen Sie das Gebäude und blenden Sie die Geschosse ein — vom Erdgeschoss bis
            zu den Hotelzimmern.
          </p>
        </motion.div>

        <div className="relative h-[62vh] min-h-[420px] md:h-[72vh] bg-white border border-gray-100">
          <BuildingViewer3D model={model} className="h-full" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {model.facts.map((f) => (
            <div key={f.label} className="border-t border-gray-200 pt-3">
              <div className="font-display uppercase text-2xl md:text-3xl font-semibold text-[#0F1B2D] leading-none">{f.value}</div>
              <div className="text-xs text-gray-500 mt-1">{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
