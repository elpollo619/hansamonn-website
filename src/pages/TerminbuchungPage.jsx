import React from 'react';
import { Helmet } from 'react-helmet';
import { Calendar, Clock, MapPin, Phone, Mail } from 'lucide-react';
import TerminbuchungForm from '@/components/TerminbuchungForm';

export default function TerminbuchungPage() {
  return (
    <>
      <Helmet>
        <title>Termin vereinbaren – Hans Amonn AG</title>
        <meta name="description" content="Vereinbaren Sie eine Besichtigung oder ein Beratungsgespräch mit Hans Amonn AG." />
      </Helmet>

      {/* Hero */}
      <div className="text-white py-14 px-4" style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}>
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm font-medium mb-5">
            <Calendar size={14} />
            Terminbuchung
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Termin vereinbaren</h1>
          <p className="text-white/70 text-lg">
            Vereinbaren Sie eine Besichtigung oder ein Beratungsgespräch.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Form — 3 cols */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Terminanfrage senden</h2>
              <TerminbuchungForm />
            </div>
          </div>

          {/* Info — 2 cols */}
          <div className="lg:col-span-2 space-y-5">

            {/* Opening hours */}
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-gray-700" />
                <h3 className="font-bold text-gray-900">Öffnungszeiten</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Montag – Freitag</span>
                  <span className="font-medium text-gray-900">08:00 – 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samstag</span>
                  <span className="font-medium text-gray-900">Nach Vereinbarung</span>
                </div>
                <div className="flex justify-between">
                  <span>Sonntag</span>
                  <span className="text-gray-400">Geschlossen</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-gray-700" />
                <h3 className="font-bold text-gray-900">Adresse</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Hans Amonn AG<br />
                Kerzers, Schweiz
              </p>
            </div>

            {/* Contact */}
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Direkter Kontakt</h3>
              <div className="space-y-3">
                <a
                  href="tel:+41319518554"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#1D3D78] transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Phone size={14} />
                  </div>
                  +41 (0)31 951 85 54
                </a>
                <a
                  href="mailto:office@reto-amonn.ch"
                  className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#1D3D78] transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Mail size={14} />
                  </div>
                  office@reto-amonn.ch
                </a>
              </div>
            </div>

            {/* Info note */}
            <div className="bg-gray-50 border border-gray-100 p-5">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>Hinweis:</strong> Wir bestätigen Terminwünsche in der Regel innerhalb von 1 Werktag.
                Bei dringenden Anfragen empfehlen wir einen direkten Anruf.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
