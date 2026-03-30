import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2 } from "lucide-react";
import { Helmet } from 'react-helmet';

export default function MunchenbuchseePage() {
  return (
    <div className="bg-white text-gray-900">
      <Helmet>
        <title>Long Stay Münchenbuchsee – Möblierte Zimmer | Hans Amonn AG</title>
        <meta name="description" content="Möblierte Zimmer in Münchenbuchsee, gute Anbindung an Bern. Ab 1 Monat buchbar. Hans Amonn AG." />
      </Helmet>
      <section className="bg-gray-50 border-b">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 mb-6">
              <Building2 size={16} />
              Long Stay
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">Münchenbuchsee</h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-3xl leading-8">
              Long-Stay-Angebot mit Einzel- und Doppelzimmern für längere Aufenthalte.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="border border-gray-200 p-8 md:p-10 bg-white">
          <h2 className="text-3xl font-bold mb-4">Interesse an Münchenbuchsee?</h2>
          <p className="text-gray-600 leading-8 mb-8">
            Für dieses Objekt können Sie direkt die Mietanfrage öffnen. Die Angaben
            für Long Stay und Münchenbuchsee werden automatisch übernommen.
          </p>

          <Link
            to="/vermieten?anfrageart=Long%20Stay&objekt=M%C3%BCnchenbuchsee"
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold transition"
            style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
            onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
            onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
          >
            Mietanfrage für Münchenbuchsee
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}