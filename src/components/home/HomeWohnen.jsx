import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CR_RATING } from '@/data/casaReto';

const fmtScore = (n) => n.toFixed(2).replace('.', ',');

// Our own offers, in the order people usually look for them
const OFFERS = [
  {
    to: '/immobilien/long-stay',
    title: 'Long Stay',
    text: 'Möblierte Zimmer ab einem Monat, für Arbeit, Ausbildung oder die Zeit zwischen zwei Wohnungen.',
    place: 'Kerzers · Muri bei Bern · Münchenbuchsee',
    price: 'ab CHF 750 / Monat',
    image: '/images/kerzers/titel.jpg',
    alt: 'Möbliertes Long-Stay-Zimmer in Kerzers',
  },
  {
    to: '/ns-hotel',
    title: "N's Hotel",
    text: 'Hotel mit Self Check-in für Geschäftsreisen und kurze Aufenthalte, Parkplatz beim Haus.',
    place: 'Kerzers',
    price: 'ab CHF 89 / Zimmer und Nacht',
    image: '/images/ns-hotel/lounge.jpg',
    alt: "Lounge im N's Hotel",
  },
  {
    to: '/immobilien/casa-reto',
    title: 'Casa Reto',
    text: 'Ferienhaus für bis zu acht Gäste mit Garten, Pergola und Blick über den Lago Maggiore.',
    place: 'Gordemo, Tessin',
    price: `${fmtScore(CR_RATING.score)} von 5 auf ${CR_RATING.source}`,
    image: '/images/casa-reto/titel.jpg',
    alt: 'Blick von Gordemo über den Lago Maggiore',
  },
];

/** Our offers as an index: one row per offer with place and price, so people can compare at a glance. */
export default function HomeWohnen() {
  return (
    <section className="surface-warm border-y border-gray-200">
      <div className="container mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-8 md:mb-10">
          <div>
            <h2 className="display-heading text-3xl md:text-4xl">Wohnen bei uns</h2>
            <p className="mt-3 text-gray-600 max-w-xl">
              Vom Zimmer für einen Monat in Kerzers bis zur Ferienwoche am Lago Maggiore.
            </p>
          </div>
          <Link to="/karte" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1F497D] hover:underline">
            Alle Standorte auf der Karte <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <ul className="border-t border-gray-300">
          {OFFERS.map((o) => (
            <li key={o.to} className="border-b border-gray-300">
              <Link
                to={o.to}
                className="group grid grid-cols-[96px_1fr] sm:grid-cols-[180px_1fr] md:grid-cols-[220px_1fr_auto] gap-x-4 sm:gap-x-6 gap-y-2 py-5 md:py-6 items-center"
              >
                <img
                  src={o.image}
                  alt={o.alt}
                  className="row-span-2 md:row-span-1 w-full aspect-[4/3] object-cover bg-gray-200"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <h3 className="font-display text-xl md:text-2xl font-semibold text-[#121D2B] group-hover:text-[#1F497D] transition-colors">
                    {o.title}
                  </h3>
                  <p className="hidden sm:block mt-1 text-gray-600 leading-relaxed max-w-xl">{o.text}</p>
                  <p className="mt-1 text-sm text-gray-600">{o.place}</p>
                </div>
                <div className="col-start-2 md:col-start-auto flex items-center justify-between md:justify-end gap-4">
                  <span className="text-sm md:text-base font-semibold text-[#121D2B] tabular-nums">{o.price}</span>
                  <ArrowRight size={20} className="shrink-0 text-[#1F497D] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-gray-600">
          Mietwohnungen sind zurzeit alle vermietet.{' '}
          <Link to="/immobilien/apartments" className="font-semibold text-[#1F497D] hover:underline">Auf die Warteliste</Link>
        </p>
      </div>
    </section>
  );
}
