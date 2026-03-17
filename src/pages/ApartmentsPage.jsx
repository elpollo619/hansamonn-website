import React from "react";
import { Link } from "react-router-dom";

const apartments = [
  {
    title: "Instrasse",
    text: "Aktuelles Apartment / Mietobjekt in Vermarktung oder zur zukünftigen Aufschaltung.",
  },
  {
    title: "Weitere Apartments",
    text: "Hier können laufend neue Wohnungen, Apartments oder Gewerbeflächen ergänzt werden.",
  },
];

export default function ApartmentsPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Apartments</h1>
      <p className="text-slate-600 text-lg max-w-3xl mb-12">
        Übersicht zu aktuellen Apartments, Wohnungen und weiteren Mietobjekten.
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {apartments.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-3">{item.title}</h2>
            <p className="text-slate-600 leading-7 mb-6">{item.text}</p>

            <Link to="/vermieten" className="text-sky-600 font-semibold">
              Zur Mietanfrage
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}