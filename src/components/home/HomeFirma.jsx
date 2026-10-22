import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const TIMELINE = [
  { year: '1968', text: 'Hans Amonn, gelernter Möbelschreiner und Architekt, gründet die Hans Amonn AG in Muri bei Bern.' },
  { year: '1983', text: 'Sein Sohn Reto Amonn übernimmt die Leitung des Familienunternehmens.' },
  { year: 'Heute', text: 'Wir planen und bauen in der Region Bern und bieten Unterkünfte in Kerzers, Muri, Münchenbuchsee und im Tessin an.' },
];

/** The company in three dates: a real sequence, so the order carries meaning. */
export default function HomeFirma() {
  return (
    <section className="surface-warm border-y border-gray-200">
      <div className="container mx-auto px-6 py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <h2 className="display-heading text-3xl md:text-4xl">Familienunternehmen seit 1968</h2>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              <Link to="/uber-uns" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F497D] hover:underline">
                Über uns <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link to="/team" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F497D] hover:underline">
                Unser Team <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <ol className="lg:col-span-8 grid gap-6 md:grid-cols-3 md:gap-8">
            {TIMELINE.map((t) => (
              <li key={t.year} className="border-t-2 border-[#1F497D] pt-4">
                <p className="font-display text-2xl font-semibold text-[#1F497D] tabular-nums">{t.year}</p>
                <p className="mt-2 text-gray-700 leading-relaxed">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
