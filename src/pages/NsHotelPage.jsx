import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MessageCircle,
  MessageSquare,
  Hotel,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

export default function NsHotelPage() {
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
              N&apos;s Hotel
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-8">
              Kurzaufenthalte und Übernachtungen mit direkter Buchung über unsere
              Website oder über Booking und Airbnb.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[340px] flex items-center justify-center">
            <span className="text-slate-500 text-lg">Hier Hotelbilder einfügen</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Ihr Aufenthalt im N&apos;s Hotel</h2>

            <p className="text-slate-600 leading-8 mb-6">
              Das N&apos;s Hotel ist ideal für Gäste, Touristen und Business-Trips.
              Buchungen können direkt über unsere eigene Plattform oder alternativ
              über Booking und Airbnb erfolgen.
            </p>

            <p className="text-slate-600 leading-8 mb-8">
              Für direkte Anfragen kann das Formular ebenfalls verwendet werden.
              Die Angaben für Short Stay und N&apos;s Hotel werden automatisch übernommen.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://my.ns-hotel.ch/search/offers?ADULTS=1&CHILDREN=&ARRIVAL=2026-03-17&DEPARTURE=2026-03-18&PROPERTY_IDS=NSH"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-white font-semibold hover:bg-sky-700 transition"
              >
                <CalendarDays size={18} />
                Direkt buchen
              </a>

              <a
                href="https://www.booking.com/Share-WIWuII"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                Zu Booking
              </a>

              <a
                href="https://www.airbnb.ch/rooms/1300557231274190252?check_in=2026-03-17&check_out=2026-03-19&guests=1&adults=1&s=67&unique_share_id=d8964020-9925-4c12-b599-815f5449e7ef"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                Zu Airbnb
              </a>

              <Link
                to="/vermieten?anfrageart=Short%20Stay&objekt=N%27s%20Hotel"
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
              <MessageSquare className="text-sky-500" size={36} />
            </div>

            <h3 className="text-3xl md:text-5xl font-bold text-center mb-10">
              Fragen oder Probleme? Kontaktiere uns:
            </h3>

            <div className="space-y-6">
              <a
                href="tel:+41319518554"
                className="flex items-center gap-6 rounded-2xl bg-slate-50 p-6 border border-slate-200 hover:bg-slate-100 transition"
              >
                <Phone className="text-sky-500 shrink-0" size={44} />
                <div>
                  <div className="text-2xl font-bold">Telefon</div>
                  <div className="text-sky-500 text-2xl font-semibold">
                    +41 31 951 85 54
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/41319518553"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-6 rounded-2xl bg-slate-50 p-6 border border-slate-200 hover:bg-slate-100 transition"
              >
                <MessageCircle className="text-sky-500 shrink-0" size={44} />
                <div>
                  <div className="text-2xl font-bold">Whatsapp</div>
                  <div className="text-sky-500 text-2xl font-semibold">
                    +41 31 951 85 53
                  </div>
                </div>
              </a>

              <a
                href="mailto:info@ns-hotel.ch"
                className="flex items-center gap-6 rounded-2xl bg-slate-50 p-6 border border-slate-200 hover:bg-slate-100 transition"
              >
                <Mail className="text-sky-500 shrink-0" size={44} />
                <div>
                  <div className="text-2xl font-bold">E-Mail</div>
                  <div className="text-sky-500 text-2xl font-semibold break-all">
                    info@ns-hotel.ch
                  </div>
                </div>
              </a>

              <a
                href="sms:+41775350668"
                className="flex items-center gap-6 rounded-2xl bg-slate-50 p-6 border border-slate-200 hover:bg-slate-100 transition"
              >
                <MessageSquare className="text-sky-500 shrink-0" size={44} />
                <div>
                  <div className="text-2xl font-bold">SMS</div>
                  <div className="text-sky-500 text-2xl font-semibold">
                    +41 77 535 06 68
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}