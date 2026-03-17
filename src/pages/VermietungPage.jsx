import React from "react";
import { Link } from "react-router-dom";
import { Building2, BedDouble, Hotel, ArrowRight, ClipboardList } from "lucide-react";

export default function VermietungPage() {
  return (
    <div className="bg-white text-slate-900">
      <section className="bg-gradient-to-br from-sky-50 via-white to-slate-50 border-b">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm text-sky-700 mb-6">
              Vermietung
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Vermietung, Long Stay, Short Stay und Apartments
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-8">
              Hier finden Sie alle Bereiche unserer Vermietung. Diese Seite eignet
              sich ideal als allgemeine Zielseite für QR-Codes, da Besucher von hier
              aus direkt zum passenden Angebot weitergeleitet werden können.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <Link
            to="/vermietung/long-stay"
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5">
              <BedDouble className="text-sky-600" size={22} />
            </div>

            <h2 className="text-2xl font-bold mb-3">Long Stay</h2>
            <p className="text-slate-600 leading-7 mb-6">
              Lösungen für längere Aufenthalte, Mitarbeitende und temporäres Wohnen.
            </p>

            <span className="inline-flex items-center gap-2 text-sky-600 font-semibold">
              Bereich öffnen
              <ArrowRight size={18} />
            </span>
          </Link>

          <Link
            to="/vermietung/short-stay"
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5">
              <Hotel className="text-sky-600" size={22} />
            </div>

            <h2 className="text-2xl font-bold mb-3">Short Stay</h2>
            <p className="text-slate-600 leading-7 mb-6">
              Kurzaufenthalte, Hotel und Ferienunterkünfte mit direkter oder externer Buchung.
            </p>

            <span className="inline-flex items-center gap-2 text-sky-600 font-semibold">
              Bereich öffnen
              <ArrowRight size={18} />
            </span>
          </Link>

          <Link
            to="/vermietung/apartments"
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5">
              <Building2 className="text-sky-600" size={22} />
            </div>

            <h2 className="text-2xl font-bold mb-3">Apartments</h2>
            <p className="text-slate-600 leading-7 mb-6">
              Übersicht aller aktuellen Apartments und weiteren Mietobjekte.
            </p>

            <span className="inline-flex items-center gap-2 text-sky-600 font-semibold">
              Bereich öffnen
              <ArrowRight size={18} />
            </span>
          </Link>

          <Link
            to="/vermieten"
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-5">
              <ClipboardList className="text-sky-600" size={22} />
            </div>

            <h2 className="text-2xl font-bold mb-3">Mietanfrage</h2>
            <p className="text-slate-600 leading-7 mb-6">
              Allgemeines Anfrageformular für Long Stay, Apartments und Short Stay.
            </p>

            <span className="inline-flex items-center gap-2 text-sky-600 font-semibold">
              Formular öffnen
              <ArrowRight size={18} />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}