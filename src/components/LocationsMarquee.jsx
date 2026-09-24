import React from 'react';
import Marquee from '@/components/Marquee';

const ITEMS = [
  'Kerzers',
  'Muri bei Bern',
  'Münchenbuchsee',
  'Gordemo · Tessin',
  'Long Stay',
  "N's Hotel",
  'Casa Reto',
  'Neubauten',
  'Sanierungen',
  'Seit 1968',
];

/** Thin band of places & offers scrolling under the hero. */
export default function LocationsMarquee() {
  return (
    <section className="bg-white border-b border-gray-200 py-5" aria-label="Standorte und Angebote">
      <Marquee
        items={ITEMS}
        duration={45}
        renderItem={(label) => (
          <span className="flex items-center pr-10">
            <span className="font-display uppercase text-2xl md:text-3xl font-semibold tracking-tight text-gray-300 whitespace-nowrap">
              {label}
            </span>
            <span className="ml-10 inline-block w-2 h-2 bg-[#1D3D78]" aria-hidden="true" />
          </span>
        )}
      />
    </section>
  );
}
