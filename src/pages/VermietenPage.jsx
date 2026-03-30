import React from "react";
import { Link } from "react-router-dom";
import { Building2, MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import MietanfrageForm from "@/components/MietanfrageForm";

export default function VermietenPage() {
  const properties = [
    {
      title: "Instrasse",
      location: "Bern",
      type: "Gewerbeflächen / Mietobjekte",
      status: "Verfügbar",
      description:
        "Moderne Flächen in guter Lage mit attraktiver Erreichbarkeit und flexiblen Nutzungsmöglichkeiten.",
    },
    {
      title: "Hochweck",
      location: "Region Bern",
      type: "Neue Vermietung",
      status: "Demnächst verfügbar",
      description:
        "Neue Vermietung in Vorbereitung. Weitere Informationen folgen in Kürze.",
    },
  ];

  return (
    <div className="bg-white text-gray-900">
      <section className="bg-gray-50 border-b">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 mb-6">
              <Building2 size={16} />
              Aktuelle Vermietungen
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Mietobjekte und
              <span style={{ color: 'var(--brand-color, #1D3D78)' }}> verfügbare Flächen</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Hier finden Sie alle aktuellen Mietobjekte und verfügbaren
              Gewerbeflächen der Hans Amonn AG.
            </p>

            <a
              href="#objekte"
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold transition"
              style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
              onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
              onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
            >
              Objekte ansehen
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section id="objekte" className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-10">Verfügbare Objekte</h2>

        <div className="grid gap-8 md:grid-cols-2">
          {properties.map((property) => (
            <div
              key={property.title}
              className="border border-gray-200 bg-white p-8"
            >
              <h3 className="text-2xl font-bold">{property.title}</h3>

              <div className="flex items-center gap-2 text-gray-500 mt-2 mb-4">
                <MapPin size={16} />
                {property.location}
              </div>

              <p className="text-gray-600 mb-6">{property.description}</p>

              <span className="bg-gray-100 text-gray-700 px-4 py-1 text-sm font-semibold">
                {property.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <MietanfrageForm />
      </section>

      <section className="bg-gray-50 border-t">
        <div className="container mx-auto px-6 py-16 max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Kontakt</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-4 bg-white border p-5">
              <Mail style={{ color: 'var(--brand-color, #1D3D78)' }} size={20} />
              <div>
                <div className="text-sm text-gray-500">E-Mail</div>
                <div className="font-semibold">info@hansamonn.ch</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white border p-5">
              <Phone style={{ color: 'var(--brand-color, #1D3D78)' }} size={20} />
              <div>
                <div className="text-sm text-gray-500">Telefon</div>
                <div className="font-semibold">+41 XX XXX XX XX</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}