import React from "react";
import { Link } from "react-router-dom";
import { Home, Phone, Mail, MessageCircle, MapPin, ArrowRight, Sun, Snowflake, Flower2, Calendar } from "lucide-react";
import CasaRetoAnfrageForm from "@/components/CasaRetoAnfrageForm";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { Helmet } from 'react-helmet';

const CASA_RETO_ICAL = 'https://www.airbnb.ch/calendar/ical/625660996936132774.ics?t=82a02050ce864c73b599648976548358';

const PREISE = [
  { saison: 'Sommer', icon: Sun,       color: 'amber',   zeitraum: 'Juni – September', nacht: 180, woche: 1100, min: 3 },
  { saison: 'Winter', icon: Snowflake, color: 'blue',    zeitraum: 'Oktober – Mai',    nacht: 130, woche: 800,  min: 2 },
  { saison: 'Ostern / Feiertage', icon: Flower2, color: 'emerald', zeitraum: 'März / April + Feiertage', nacht: 160, woche: 950, min: 3 },
];

const COLOR = {
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-100',  badge: 'bg-amber-100 text-amber-700',  icon: 'text-amber-500' },
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-100',   badge: 'bg-blue-100 text-blue-700',    icon: 'text-blue-500' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100',badge: 'bg-emerald-100 text-emerald-700', icon: 'text-emerald-500' },
};

export default function CasaRetoPage() {
  return (
    <div className="bg-white text-slate-900">
      <Helmet>
        <title>Casa Reto – Ferienhaus am Lago Maggiore | Hans Amonn AG</title>
        <meta name="description" content="Privates Ferienhaus in Gordemo, Tessin. Direkt am Lago Maggiore, mit Garten. Buchbar über Airbnb." />
      </Helmet>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-sky-50 via-white to-slate-50 border-b">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-4 py-2 text-sm text-sky-700 mb-6">
              <Home size={16} />
              Short Stay
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Casa Reto</h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl leading-8">
              Ferien- und Kurzaufenthalte im Tessin. Buchungen sind über Airbnb,
              Booking und Fewo-direkt möglich. Zusätzlich können Gäste uns direkt
              kontaktieren.
            </p>
            <p className="text-slate-600 leading-8 mt-4 mb-8">
              Für direkte Anfragen kann das Formular ebenfalls verwendet werden.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://www.airbnb.de/rooms/625660996936132774?guests=1&adults=1&s=67&unique_share_id=5908649a-19c2-4936-a676-581a8ef31d3c"
                target="_blank" rel="noreferrer"
                className="rounded-xl bg-sky-600 px-6 py-3 text-white font-semibold hover:bg-sky-700 transition">
                Zu Airbnb
              </a>
              <a href="https://www.booking.com/Share-Xj9kmd7" target="_blank" rel="noreferrer"
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition">
                Zu Booking
              </a>
              <a href="https://www.fewo-direkt.de/ferienwohnung-ferienhaus/p5593150?SocialSharePropertyDialog=share-this-page-dialog."
                target="_blank" rel="noreferrer"
                className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition">
                Zu Fewo-direkt
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content + form ── */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[340px] flex items-center justify-center">
            <span className="text-slate-500 text-lg">Hier Bilder von Casa Reto einfügen</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Ihr Aufenthalt in Casa Reto</h2>
            <p className="text-slate-600 leading-8 mb-6">
              Casa Reto eignet sich ideal für Gäste, die einen angenehmen
              Kurzaufenthalt oder Ferien im Tessin suchen.
            </p>
          </div>
        </div>
      </section>

      {/* ── Seasonal pricing ── */}
      <section className="bg-slate-50 border-t">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2">Preise</h2>
            <p className="text-slate-500 text-center mb-10">Alle Preise in CHF. Endreinigung inklusive.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {PREISE.map(({ saison, icon: Icon, color, zeitraum, nacht, woche, min }) => {
                const c = COLOR[color];
                return (
                  <div key={saison} className={`${c.bg} ${c.border} border rounded-2xl p-6`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Icon size={20} className={c.icon} />
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>{saison}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-4">{zeitraum}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm text-slate-600">Pro Nacht</span>
                        <span className="text-xl font-bold text-slate-900">CHF {nacht}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-sm text-slate-600">Pro Woche</span>
                        <span className="text-lg font-semibold text-slate-700">CHF {woche}</span>
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                        <span className="text-xs text-slate-500">Mindestaufenthalt</span>
                        <span className="text-xs font-medium text-slate-700">{min} Nächte</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 text-center mt-6">
              Preise sind Richtwerte. Für genaue Verfügbarkeit und Preise bitte anfragen oder direkt über Airbnb / Booking buchen.
            </p>
          </div>
        </div>
      </section>

      {/* ── Availability calendar ── */}
      <section className="border-t">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-center">Verfügbarkeit</h2>
            <p className="text-slate-500 text-center mb-8">Kalender wird automatisch mit Airbnb synchronisiert.</p>
            <AvailabilityCalendar icalUrl={CASA_RETO_ICAL} />
          </div>
        </div>
      </section>

      {/* ── Direct contact form ── */}
      <section className="border-t">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left: info */}
              <div>
                <h2 className="text-3xl font-bold mb-4">Direkt anfragen</h2>
                <p className="text-slate-600 leading-8 mb-8">
                  Sie möchten Casa Reto direkt buchen oder haben Fragen?
                  Füllen Sie das Formular aus — wir melden uns innerhalb von 24 Stunden.
                </p>
                <div className="space-y-4">
                  <a href="tel:+41319518554"
                    className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5 border border-slate-200 hover:bg-slate-100 transition">
                    <Phone className="text-sky-500 shrink-0" size={28} />
                    <div>
                      <div className="font-bold text-sm">Telefon</div>
                      <div className="text-sky-500 font-semibold">+41 31 951 85 54</div>
                    </div>
                  </a>
                  <a href="mailto:office@reto-amonn.ch"
                    className="flex items-center gap-4 rounded-2xl bg-slate-50 p-5 border border-slate-200 hover:bg-slate-100 transition">
                    <Mail className="text-sky-500 shrink-0" size={28} />
                    <div>
                      <div className="font-bold text-sm">E-Mail</div>
                      <div className="text-sky-500 font-semibold">office@reto-amonn.ch</div>
                    </div>
                  </a>
                </div>
              </div>
              {/* Right: form */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MessageCircle className="text-sky-500" size={22} />
                  Anfrage senden
                </h3>
                <CasaRetoAnfrageForm />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
