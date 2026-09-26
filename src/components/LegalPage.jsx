import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';

/**
 * LegalPage — shared layout for Impressum and Datenschutz: hero, optional
 * "Stand" line and numbered sections ({ title, body }).
 */
export default function LegalPage({ title, asOf, intro, sections }) {
  return (
    <>
      <PageHero eyebrow="Rechtliches" title={title} size="sm" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 py-16 md:py-20"
      >
        <div className="max-w-3xl">
          {asOf && <p className="text-sm text-gray-500 mb-6">Stand: {asOf}</p>}
          {intro && <div className="text-gray-600 leading-relaxed mb-10 space-y-4">{intro}</div>}
          <div className="divide-y divide-gray-100 border-y border-gray-100">
            {sections.map(({ title: t, body }) => (
              <section key={t} className="py-8">
                <h2 className="font-display uppercase text-xl font-semibold text-[#0F1B2D] mb-4">{t}</h2>
                <div className="text-gray-600 leading-relaxed space-y-3 [&_a]:underline [&_a]:text-gray-800 [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
                  {body}
                </div>
              </section>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
