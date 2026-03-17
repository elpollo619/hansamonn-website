import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  ArrowRight,
} from "lucide-react";

export default function CasaRetoPage() {
  return (
    <div className="bg-white text-slate-900">
      <section className="bg-gradient-to-br from-sky-50 via-white to-slate-50 border-b">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm text-sky-700 mb-6">
              <Home size={16} />
              Short Stay
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Casa Reto
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-8">
              Ferien- und Kurzaufenthalte im Tessin. Buchungen sind über Airbnb,
              Booking und Fewo-direkt möglich. Zusätzlich können Gäste uns direkt
              kontaktieren.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[340px] flex items-center justify-center">
            <span className="text-slate-500 text-lg">
              Hier Bilder von Casa Reto einfügen
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Ihr Aufenthalt in Casa Reto</h2>

            <p className="text-slate-600 leading-8 mb-6">
              Casa Reto eignet sich ideal für Gäste, die einen angenehmen
              Kurzaufenthalt oder Ferien im Tessin suchen.
            </p>

            <p className="text-slate-600 leading-8 mb-8">
              Für direkte Anfragen kann das Formular ebenfalls verwendet werden.
              Die Angaben für Short Stay und Casa Reto werden automatisch übernommen.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.airbnb.de/rooms/625660996936132774?guests=1&adults=1&s=67&unique_share_id=5908649a-19c2-4936-a676-581a8ef31d3c"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-sky-600 px-6 py-3 text-white font-semibold hover:bg-sky-700 transition"
              >
                Zu Airbnb
              </a>

              <a
                href="https://www.booking.com/Share-Xj9kmd7"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                Zu Booking
              </a>

              <a
                href="https://www.fewo-direkt.de/ferienwohnung-ferienhaus/p5593150?SocialSharePropertyDialog=share-this-page-dialog."
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                Zu Fewo-direkt
              </a>

              <Link
                to="/vermieten?anfrageart=Short%20Stay&objekt=Casa%20Reto"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                Direkt anfragen
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 border-t border-b">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-8 md:p-12">
            <div className="flex justify-center mb-6">
              <MessageCircle className="text-sky-500" size={36} />
            </div>

            <h3 className="text-3xl md:text-5xl font-bold text-center mb-10">
              Direkt mit uns Kontakt aufnehmen
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              <a
                href="tel:+41319518554"
                className="flex items-center gap-5 rounded-2xl bg-slate-50 p-6 border border-slate-200 hover:bg-slate-100 transition"
              >
                <Phone className="text-sky-500 shrink-0" size={40} />
                <div>
                  <div className="text-xl font-bold">Telefon</div>
                  <div className="text-sky-500 text-xl font-semibold">
                    +41 31 951 85 54
                  </div>
                </div>
              </a>

              <Link
                to="/vermieten?anfrageart=Short%20Stay&objekt=Casa%20Reto"
                className="flex items-center gap-5 rounded-2xl bg-slate-50 p-6 border border-slate-200 hover:bg-slate-100 transition"
              >
                <Mail className="text-sky-500 shrink-0" size={40} />
                <div>
                  <div className="text-xl font-bold">Kontaktformular</div>
                  <div className="text-sky-500 text-xl font-semibold">
                    Direkt anfragen
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-6 border border-slate-200">
              <div className="flex items-start gap-4">
                <MapPin className="text-sky-500 mt-1 shrink-0" size={22} />
                <div>
                  <h4 className="text-xl font-bold mb-2">Hinweis</h4>
                  <p className="text-slate-600 leading-7">
                    Gäste können Casa Reto über Airbnb, Booking oder Fewo-direkt
                    buchen. Für direkte Anfragen oder besondere Wünsche können sie
                    uns ebenfalls direkt kontaktieren.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}