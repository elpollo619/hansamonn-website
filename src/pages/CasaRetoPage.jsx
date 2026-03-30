import React from "react";
import { Phone, Mail, MessageCircle, Sun, Snowflake, Flower2 } from "lucide-react";
import CasaRetoAnfrageForm from "@/components/CasaRetoAnfrageForm";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { Helmet } from 'react-helmet';

const CASA_RETO_ICAL = 'https://www.airbnb.ch/calendar/ical/625660996936132774.ics?t=82a02050ce864c73b599648976548358';

const PREISE = [
  { saison: 'Sommer', icon: Sun,       zeitraum: 'Juni – September',          nacht: 180, woche: 1100, min: 3 },
  { saison: 'Winter', icon: Snowflake, zeitraum: 'Oktober – Mai',             nacht: 130, woche: 800,  min: 2 },
  { saison: 'Ostern / Feiertage', icon: Flower2, zeitraum: 'März / April + Feiertage', nacht: 160, woche: 950, min: 3 },
];

export default function CasaRetoPage() {
  return (
    <div className="bg-white text-gray-900">
      <Helmet>
        <title>Casa Reto – Ferienhaus am Lago Maggiore | Hans Amonn AG</title>
        <meta name="description" content="Privates Ferienhaus in Gordemo, Tessin. Direkt am Lago Maggiore, mit Garten. Buchbar über Airbnb." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-3">Hans Amonn AG · Short Stay</p>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              Casa <span className="font-black">Reto</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl leading-relaxed mb-3">
              Ferien- und Kurzaufenthalte im Tessin. Buchungen sind über Airbnb,
              Booking und Fewo-direkt möglich.
            </p>
            <p className="text-gray-500 text-sm mb-8">Für direkte Anfragen kann das Formular ebenfalls verwendet werden.</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.airbnb.de/rooms/625660996936132774?guests=1&adults=1&s=67&unique_share_id=5908649a-19c2-4936-a676-581a8ef31d3c"
                target="_blank" rel="noreferrer"
                className="px-6 py-3 text-white font-semibold transition-colors text-sm"
                style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
              >
                Zu Airbnb
              </a>
              <a href="https://www.booking.com/Share-Xj9kmd7" target="_blank" rel="noreferrer"
                className="border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                Zu Booking
              </a>
              <a href="https://www.fewo-direkt.de/ferienwohnung-ferienhaus/p5593150?SocialSharePropertyDialog=share-this-page-dialog."
                target="_blank" rel="noreferrer"
                className="border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                Zu Fewo-direkt
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div className="overflow-hidden border border-gray-100 bg-gray-50 min-h-[340px] flex items-center justify-center">
            <span className="text-gray-400 text-base">Hier Bilder von Casa Reto einfügen</span>
          </div>
          <div>
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Ihr Aufenthalt in <span className="font-black">Casa Reto</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Casa Reto eignet sich ideal für Gäste, die einen angenehmen
              Kurzaufenthalt oder Ferien im Tessin suchen.
            </p>
          </div>
        </div>
      </section>

      {/* Seasonal pricing */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-3 text-center">Casa Reto</p>
            <h2 className="text-3xl font-light text-gray-900 text-center mb-2">
              Unsere <span className="font-black">Preise</span>
            </h2>
            <p className="text-gray-500 text-center mb-10 text-sm">Alle Preise in CHF. Endreinigung inklusive.</p>
            <div className="grid md:grid-cols-3 gap-px bg-gray-100 border border-gray-100">
              {PREISE.map(({ saison, icon: Icon, zeitraum, nacht, woche, min }) => (
                <div key={saison} className="bg-white p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon size={18} style={{ color: 'var(--brand-color, #1D3D78)' }} />
                    <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600">{saison}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">{zeitraum}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-gray-500">Pro Nacht</span>
                      <span className="text-xl font-bold text-gray-900">CHF {nacht}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-gray-500">Pro Woche</span>
                      <span className="text-lg font-semibold text-gray-700">CHF {woche}</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-400">Mindestaufenthalt</span>
                      <span className="text-xs font-medium text-gray-700">{min} Nächte</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center mt-6">
              Preise sind Richtwerte. Für genaue Verfügbarkeit und Preise bitte anfragen oder direkt über Airbnb / Booking buchen.
            </p>
          </div>
        </div>
      </section>

      {/* Availability calendar */}
      <section className="border-t border-gray-100">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-light text-gray-900 mb-2 text-center">
              <span className="font-black">Verfügbarkeit</span>
            </h2>
            <p className="text-gray-500 text-center mb-8 text-sm">Kalender wird automatisch mit Airbnb synchronisiert.</p>
            <AvailabilityCalendar icalUrl={CASA_RETO_ICAL} />
          </div>
        </div>
      </section>

      {/* Direct contact form */}
      <section className="border-t border-gray-100">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl font-light text-gray-900 mb-4">
                  Direkt <span className="font-black">anfragen</span>
                </h2>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Sie möchten Casa Reto direkt buchen oder haben Fragen?
                  Füllen Sie das Formular aus — wir melden uns innerhalb von 24 Stunden.
                </p>
                <div className="space-y-3">
                  {[
                    { href: 'tel:+41319518554', Icon: Phone, label: 'Telefon', value: '+41 31 951 85 54' },
                    { href: 'mailto:office@reto-amonn.ch', Icon: Mail, label: 'E-Mail', value: 'office@reto-amonn.ch' },
                  ].map(({ href, Icon, label, value }) => (
                    <a key={label} href={href}
                      className="flex items-center gap-4 bg-gray-50 border border-gray-100 p-4 hover:bg-gray-100 transition-colors">
                      <Icon className="shrink-0" style={{ color: 'var(--brand-color, #1D3D78)' }} size={22} />
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{label}</div>
                        <div className="text-sm font-medium" style={{ color: 'var(--brand-color, #1D3D78)' }}>{value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-gray-100 p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MessageCircle style={{ color: 'var(--brand-color, #1D3D78)' }} size={20} />
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
