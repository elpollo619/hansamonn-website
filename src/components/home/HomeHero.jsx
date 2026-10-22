import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import LazyMount from '@/components/LazyMount';

const ModelViewer3D = lazy(() => import('@/components/ModelViewer3D'));

/** Small "sheet" with a label row, used for the plan and the photo next to the 3D model. */
function SheetCard({ src, alt, label, note, plan = false, className = '' }) {
  return (
    <div className={`bg-white border border-gray-200 shadow-[0_12px_40px_rgba(18,29,43,0.12)] ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`block w-full aspect-[4/3] object-cover ${plan ? 'object-left-top mix-blend-multiply' : ''}`}
        loading="eager"
      />
      <div className="flex justify-between gap-2 border-t border-gray-200 px-3 py-2 font-mono text-[11px] text-gray-600 whitespace-nowrap overflow-hidden">
        <span className="font-semibold text-[#121D2B]">{label}</span>
        <span>{note}</span>
      </div>
    </div>
  );
}

// The two reasons people come to the site: a place to stay, or a building to plan.
const ROUTES = [
  {
    to: '/immobilien',
    title: 'Unterkunft finden',
    sub: 'Long Stay · Hotel · Ferienhaus',
    primary: true,
  },
  {
    to: '/architektur',
    title: 'Bauprojekt planen',
    sub: 'Neubau · Umbau · Bauleitung',
  },
];

/**
 * Home hero: what the company does in one sentence, the two routes, and the one thing only
 * Hans Amonn AG can show: a building it planned (N's Hotel) next to its own floor plan.
 */
export default function HomeHero() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-6 pt-10 pb-14 md:pt-16 md:pb-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 lg:items-center">
          {/* Text and routes */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 min-w-0"
          >
            <p className="font-mono text-xs text-gray-600">Muri bei Bern · seit 1968</p>
            <h1 className="mt-4 font-display text-[2.3rem] leading-[1.08] md:text-5xl lg:text-[2.5rem] xl:text-[3.1rem] font-semibold tracking-tight text-[#121D2B]">
              Architektur und Wohnraum <br className="hidden xl:block" />aus einer Hand.
            </h1>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed max-w-md">
              Als Familienunternehmen planen wir Gebäude und bieten möblierte Zimmer, ein Hotel und ein Ferienhaus im Tessin an.
            </p>

            <nav aria-label="Einstieg" className="mt-8 grid gap-3 max-w-md">
              {ROUTES.map((r) => (
                <Link
                  key={r.to}
                  to={r.to}
                  className={`group flex items-center justify-between gap-4 px-5 py-4 border transition-colors ${
                    r.primary
                      ? 'bg-[#1F497D] border-[#1F497D] text-white hover:bg-[#173963]'
                      : 'bg-white border-gray-300 text-[#121D2B] hover:border-[#1F497D]'
                  }`}
                >
                  <span>
                    <span className="block text-lg font-semibold leading-tight">{r.title}</span>
                    <span className={`block mt-0.5 text-sm ${r.primary ? 'text-white/80' : 'text-gray-600'}`}>{r.sub}</span>
                  </span>
                  <ArrowRight size={20} className="shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* One building, three ways: the plan we drew, the 3D model made from it, the finished house */}
          <motion.figure
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-6 min-w-0 m-0"
          >
            <div className="relative lg:mb-24">
              <div className="relative aspect-[4/3] border border-gray-200 bg-gradient-to-b from-white to-[#E9EDF2] overflow-hidden">
                <LazyMount className="absolute inset-0" rootMargin="0px">
                  <Suspense fallback={null}>
                    <ModelViewer3D ids={['a14']} compact className="h-full" />
                  </Suspense>
                </LazyMount>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 lg:mt-0">
                <SheetCard
                  className="lg:absolute lg:-left-8 lg:-bottom-24 lg:w-[34%]"
                  src="/images/home/ns-hotel-1og-plan.webp"
                  alt="Grundriss 1. Obergeschoss des N's Hotel mit den Zimmern 101 bis 109"
                  label="Plan"
                  note="1. OG · 2022"
                  plan
                />
                <SheetCard
                  className="lg:absolute lg:-right-4 lg:-bottom-20 lg:w-[30%]"
                  src="/images/ns-hotel/aussen.jpg"
                  alt="Das fertige N's Hotel an der Allmendstrasse 14 in Kerzers"
                  label="Gebäude"
                  note="Kerzers · 2024"
                />
              </div>
            </div>
            <figcaption className="mt-4 text-sm text-gray-600 lg:text-right">
              N's Hotel in Kerzers: Grundriss, 3D-Modell aus dem Ausführungsplan 1:50 (2022) und das fertige Gebäude.
              <span className="block font-mono text-[11px] mt-1">Umgebung: Amtliche Vermessung · © swisstopo</span>
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
