import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Hotel, Home, MapPin } from "lucide-react";

const shortStayItems = [
  {
    title: "N's Hotel",
    image: "/images/ns-hotel/titel.jpg",
    description:
      "Kurzaufenthalte und Hotelzimmer mit Buchung über Booking, Airbnb oder direkt über unsere Website.",
    link: "/ns-hotel",
    type: "Hotel",
    icon: <Hotel size={16} />,
  },
  {
    title: "Casa Reto",
    image: "/images/casa-reto/titel.jpg",
    description:
      "Ferienhaus im Tessin für Kurzaufenthalte und Ferien. Buchung über Airbnb, Booking, Fewo-direkt oder direkt über uns.",
    link: "/casa-reto",
    type: "Ferienhaus",
    icon: <Home size={16} />,
  },
];

export default function ShortStayPage() {
  return (
    <div className="bg-white text-slate-900">
      <section className="bg-gradient-to-br from-sky-50 via-white to-slate-50 border-b">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm text-sky-700 mb-6">
              <Hotel size={16} />
              Short Stay
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Short Stay
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-8">
              Kurzaufenthalte und Ferienwohnungen für Gäste, Touristen und
              Geschäftsreisende. Die Buchung kann über bekannte Plattformen oder
              direkt über uns erfolgen.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {shortStayItems.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className="rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-sky-600 text-sm font-medium mb-3">
                  <MapPin size={16} />
                  Short Stay
                </div>

                <h2 className="text-2xl font-bold mb-3">{item.title}</h2>

                <p className="text-slate-600 leading-7 mb-6">
                  {item.description}
                </p>

                <span className="inline-flex items-center gap-2 text-sky-600 font-semibold">
                  Details ansehen
                  <ArrowRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 border-t">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
            <h2 className="text-3xl font-bold mb-4">
              Allgemeine Anfrage für Short Stay
            </h2>

            <p className="text-slate-600 leading-8 mb-8">
              Sie können uns auch direkt eine Anfrage senden. Im Formular können
              Sie das gewünschte Short-Stay-Objekt auswählen.
            </p>

            <Link
              to="/vermieten?anfrageart=Short%20Stay"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-white font-semibold hover:bg-sky-700 transition"
            >
              Zur Anfrage
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}