import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { Helmet } from 'react-helmet';

export default function MuriPage() {
  return (
    <div className="bg-white text-gray-900">
      <Helmet>
        <title>Long Stay Muri bei Bern – Möblierte Zimmer | Hans Amonn AG</title>
        <meta name="description" content="Komfortables Wohnen in Muri bei Bern. Vollmöblierte Zimmer, zentrale Lage, ab 1 Monat. Hans Amonn AG." />
      </Helmet>

      {/* HERO */}
      <section className="relative h-[520px] overflow-hidden">
        <img
          src="/images/muri/titel.jpg"
          alt="Muri bei Bern"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="max-w-3xl text-white">

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 mb-6">
              <Building2 size={16} />
              Long Stay
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Muri bei Bern
            </h1>

            <p className="text-xl text-white/90 leading-8">
              Long-Stay-Angebot in Muri bei Bern mit komfortabler Wohnlösung
              für längere Aufenthalte in der Region Bern.
            </p>

          </div>
        </div>
      </section>

      {/* BILDER */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">

          <img
            src="/images/muri/01.jpg"
            alt="Muri bei Bern"
            className=""
            loading="lazy"
            decoding="async"
          />

          <img
            src="/images/muri/02.jpg"
            alt="Muri bei Bern"
            className=""
            loading="lazy"
            decoding="async"
          />

          <img
            src="/images/muri/03.jpg"
            alt="Muri bei Bern"
            className=""
            loading="lazy"
            decoding="async"
          />

          <img
            src="/images/muri/04.jpg"
            alt="Muri bei Bern"
            className=""
            loading="lazy"
            decoding="async"
          />

        </div>
      </section>

      {/* BESCHREIBUNG */}
      <section className="container mx-auto px-6 pb-20">
        <div className="border border-gray-200 p-8 md:p-10 bg-white max-w-4xl">

          <div className="flex items-center gap-2 mb-4" style={{ color: 'var(--brand-color, #1D3D78)' }}>
            <MapPin size={18} />
            Muri bei Bern
          </div>

          <h2 className="text-3xl font-bold mb-4">
            Long Stay Unterkunft
          </h2>

          <p className="text-gray-600 leading-8 mb-8">
            Unsere Unterkunft in Muri bei Bern eignet sich ideal für längere Aufenthalte,
            Mitarbeitende, Projektteams oder temporäres Wohnen in der Region Bern.
            Die ruhige Lage kombiniert mit guter Anbindung an die Stadt macht
            diese Unterkunft besonders attraktiv für Long-Stay-Gäste.
          </p>

          <Link
            to="/vermieten?anfrageart=Long%20Stay&objekt=Muri%20bei%20Bern"
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold transition"
            style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
            onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
            onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
          >
            Mietanfrage senden
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

    </div>
  );
}