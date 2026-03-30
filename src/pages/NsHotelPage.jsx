import React from "react";
import { Link } from "react-router-dom";
import {
  Phone, Mail, MessageCircle, MessageSquare,
  Hotel, CalendarDays, ArrowRight,
} from "lucide-react";
import { Helmet } from 'react-helmet';

function getBookingDates() {
  const fmt = (d) => d.toISOString().split('T')[0];
  const arrival = new Date(); arrival.setDate(arrival.getDate() + 1);
  const departure = new Date(); departure.setDate(departure.getDate() + 2);
  return { arrival: fmt(arrival), departure: fmt(departure) };
}

export default function NsHotelPage() {
  const { arrival, departure } = getBookingDates();
  return (
    <div className="bg-white text-gray-900">
      <Helmet>
        <title>N's Hotel Kerzers – Boutique Hotel | Hans Amonn AG</title>
        <meta name="description" content="Modernes Boutique-Hotel in Kerzers mit Self Check-in. Ideal für Geschäftsreisen und Kurzaufenthalte." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="N's Hotel Kerzers – Boutique Hotel | Hans Amonn AG" />
        <meta property="og:description" content="Modernes Boutique-Hotel in Kerzers mit Self Check-in. Ideal für Geschäftsreisen und Kurzaufenthalte." />
        <meta property="og:image" content="https://www.hansamonn.ch/images/kerzers/titel.jpg" />
        <meta property="og:url" content="https://www.hansamonn.ch/ns-hotel" />
        <meta property="og:site_name" content="Hans Amonn AG" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl">
            <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-3">Hans Amonn AG · Short Stay</p>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              N&apos;s <span className="font-black">Hotel</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
              Kurzaufenthalte und Übernachtungen mit direkter Buchung über unsere
              Website oder über Booking und Airbnb.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div className="overflow-hidden border border-gray-100 bg-gray-50 min-h-[340px] flex items-center justify-center">
            <span className="text-gray-400 text-base">Hier Hotelbilder einfügen</span>
          </div>

          <div>
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Ihr Aufenthalt im <span className="font-black">N's Hotel</span>
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              Das N&apos;s Hotel ist ideal für Gäste, Touristen und Business-Trips.
              Buchungen können direkt über unsere eigene Plattform oder alternativ
              über Booking und Airbnb erfolgen.
            </p>

            <p className="text-gray-600 leading-relaxed mb-8">
              Für direkte Anfragen kann das Formular ebenfalls verwendet werden.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={`https://my.ns-hotel.ch/search/offers?ADULTS=1&CHILDREN=&ARRIVAL=${arrival}&DEPARTURE=${departure}&PROPERTY_IDS=NSH`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold transition-colors text-sm"
                style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
              >
                <CalendarDays size={16} /> Direkt buchen
              </a>
              <a href="https://www.booking.com/Share-WIWuII" target="_blank" rel="noreferrer"
                className="border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                Zu Booking
              </a>
              <a href={`https://www.airbnb.ch/rooms/1300557231274190252?check_in=${arrival}&check_out=${departure}&guests=1&adults=1`}
                target="_blank" rel="noreferrer"
                className="border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                Zu Airbnb
              </a>
              <Link to="/immobilien/anfrage"
                className="inline-flex items-center gap-2 border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                Direkt anfragen <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-5xl mx-auto bg-white border border-gray-100 p-8 md:p-12">
            <div className="flex justify-center mb-6">
              <MessageSquare style={{ color: 'var(--brand-color, #1D3D78)' }} size={32} />
            </div>
            <h3 className="text-3xl font-light text-gray-900 text-center mb-10">
              Fragen oder Probleme? <span className="font-black">Kontaktiere uns:</span>
            </h3>
            <div className="space-y-4">
              {[
                { href: 'tel:+41319518554', Icon: Phone, label: 'Telefon', value: '+41 31 951 85 54' },
                { href: 'https://wa.me/41319518553', Icon: MessageCircle, label: 'WhatsApp', value: '+41 31 951 85 53', external: true },
                { href: 'mailto:info@ns-hotel.ch', Icon: Mail, label: 'E-Mail', value: 'info@ns-hotel.ch' },
                { href: 'sms:+41775350668', Icon: MessageSquare, label: 'SMS', value: '+41 77 535 06 68' },
              ].map(({ href, Icon, label, value, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="flex items-center gap-6 bg-gray-50 border border-gray-100 p-5 hover:bg-gray-100 transition-colors"
                >
                  <Icon style={{ color: 'var(--brand-color, #1D3D78)' }} className="shrink-0" size={28} />
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{label}</div>
                    <div className="text-base font-medium" style={{ color: 'var(--brand-color, #1D3D78)' }}>{value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
