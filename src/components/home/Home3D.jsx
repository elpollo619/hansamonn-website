import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers3, Move3d, Rotate3d } from 'lucide-react';
import LazyMount from '@/components/LazyMount';
import { BUILDING_MODELS } from '@/data/models';

const ModelViewer3D = lazy(() => import('@/components/ModelViewer3D'));

// Models already published on the project and property pages
const IDS = ['a4', 'br', 'hw', 'bg', 'cr', 'a14'];

const HOW = [
  { Icon: Rotate3d, title: 'Drehen', text: 'Ziehen Sie mit der Maus oder dem Finger.' },
  { Icon: Layers3, title: 'Geschosse', text: 'Blenden Sie einzelne Geschosse ein oder öffnen Sie die Explosionsansicht.' },
  { Icon: Move3d, title: 'Zoomen', text: 'Klicken Sie ins Modell, dann scrollen oder mit zwei Fingern zoomen.' },
];

/** Interactive 3D models of six buildings, all generated from our own construction plans. */
export default function Home3D() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14 mb-8 md:mb-10 lg:items-end">
          <div className="lg:col-span-6">
            <h2 className="display-heading text-3xl md:text-4xl">Unsere Gebäude in 3D</h2>
            <p className="mt-4 text-gray-600 leading-relaxed max-w-xl">
              {IDS.length} Gebäude, direkt aus unseren Ausführungsplänen erzeugt: Wände, Fenster und Geschosse so,
              wie wir sie gezeichnet haben. Wählen Sie oben im Modell ein Gebäude und drehen Sie es mit Maus oder Finger.
            </p>
          </div>
          <ul className="hidden sm:grid lg:col-span-6 gap-4 sm:grid-cols-3">
            {HOW.map(({ Icon, title, text }) => (
              <li key={title} className="border-t-2 border-[#1F497D] pt-3">
                <p className="flex items-center gap-2 font-semibold text-[#121D2B]">
                  <Icon size={17} className="text-[#1F497D]" aria-hidden="true" /> {title}
                </p>
                <p className="mt-1 text-sm text-gray-600 leading-snug">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        <LazyMount
          className="relative h-[70vh] min-h-[460px] max-h-[720px] border border-gray-200 bg-gradient-to-b from-white to-[#E9EDF2] overflow-hidden"
          placeholder={
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-600">3D-Modelle werden geladen…</div>
          }
        >
          <Suspense fallback={null}>
            <ModelViewer3D ids={IDS} className="h-full" />
          </Suspense>
        </LazyMount>

        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <p className="text-sm text-gray-600">
            {IDS.map((id) => BUILDING_MODELS[id].name).join(' · ')}
          </p>
          <Link to="/projekte" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F497D] hover:underline">
            Zu den Projekten <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
