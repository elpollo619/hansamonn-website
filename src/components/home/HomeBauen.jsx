import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ImageCompare from '@/components/ImageCompare';
import { servicesData } from '@/components/servicesData';

const PROJECTS = [
  { id: 2, title: 'Höheweg 8, Muri bei Bern', kind: 'Umbau', year: '2023' },
  { id: 1, title: "N's Hotel, Kerzers", kind: 'Hotel', year: '2024' },
  { id: 3, title: 'Allmendstrasse 4–4A, Kerzers', kind: 'Wohnbau', year: '2024' },
];

/** Architecture: what we do, one real before/after, and recent projects. */
export default function HomeBauen() {
  const services = servicesData.filter((s) => s.category === 'architektur');

  return (
    <section className="bg-white">
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5 min-w-0">
            <p className="text-sm font-semibold text-[#1F497D]">AMONN ARCHITEKTUR</p>
            <h2 className="mt-2 display-heading text-3xl md:text-4xl">Planen und bauen</h2>
            <p className="mt-4 text-gray-600 leading-relaxed max-w-md">
              Neubauten, Umbauten und Sanierungen in der Region Bern, von der ersten Skizze bis zur Bauleitung.
              Die 3D-Modelle auf dieser Website entstehen direkt aus unseren Ausführungsplänen.
            </p>

            <ul className="mt-8 border-t border-gray-200">
              {services.map((s) => (
                <li key={s.slug} className="border-b border-gray-200">
                  <Link
                    to={`/leistungen/${s.slug}`}
                    className="group flex items-center justify-between gap-4 py-3.5 text-[#121D2B] hover:text-[#1F497D] transition-colors"
                  >
                    <span className="font-semibold">{s.title}</span>
                    <ArrowRight size={17} className="shrink-0 text-gray-400 group-hover:text-[#1F497D] transition-colors" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7 min-w-0">
            <ImageCompare
              before="/images/projekte/hoeheweg/bestand-2000-sw.jpg"
              after="/images/projekte/hoeheweg/drohne-2024-sw.jpg"
              beforeLabel="2000"
              afterLabel="2024"
              beforeAlt="Höheweg 8 in Muri bei Bern vor dem Umbau, Fachwerkgiebel im Jahr 2000"
              afterAlt="Höheweg 8 nach dem Umbau, derselbe Giebel 2024 aus der Luft"
            />
            <p className="mt-3 text-sm text-gray-600">
              Höheweg 8 in Muri bei Bern: das Bauernhaus im Jahr 2000 und nach dem Umbau. Ziehen Sie den Regler.
            </p>

            <h3 className="mt-10 text-sm font-semibold text-gray-700">Aktuelle Projekte</h3>
            <ul className="mt-3 border-t border-gray-200">
              {PROJECTS.map((p) => (
                <li key={p.id} className="border-b border-gray-200">
                  <Link
                    to={`/projekte/${p.id}`}
                    className="group grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_10rem_4rem] gap-x-4 py-3.5 items-baseline"
                  >
                    <span className="font-semibold text-[#121D2B] group-hover:text-[#1F497D] transition-colors">{p.title}</span>
                    <span className="hidden sm:block text-sm text-gray-600">{p.kind}</span>
                    <span className="text-sm text-gray-600 tabular-nums text-right">{p.year}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/projekte" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F497D] hover:underline">
              Alle Projekte <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
