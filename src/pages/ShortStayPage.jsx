import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hotel, ArrowRight, ExternalLink, Star, MapPin, ChevronRight, Mail, Sun } from 'lucide-react';

const RentalImage = ({ src, alt, className }) => {
  const [err, setErr] = React.useState(false);
  return err ? (
    <div className={`${className} bg-gray-100 flex items-center justify-center`}>
      <Hotel size={28} className="text-gray-300" />
    </div>
  ) : (
    <img src={src} alt={alt} className={className} loading="lazy" onError={() => setErr(true)} />
  );
};

export default function ShortStayPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="relative container mx-auto px-6 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/immobilien" className="inline-flex items-center gap-2 text-indigo-300/70 hover:text-white text-sm mb-6 transition-colors">
              <ChevronRight size={14} className="rotate-180" /> Immobilien
            </Link>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full mb-5">
              <Hotel size={12} /> Short Stay
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-5">
              Short Stay
            </h1>
            <p className="text-indigo-200/80 text-lg max-w-2xl leading-relaxed">
              Kurzaufenthalte, Business Trips und Ferienunterkünfte. Direkt buchbar oder über Booking.com und Airbnb.
            </p>
          </motion.div>
        </div>
      </section>

      {/* N's Hotel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative h-72 lg:h-auto min-h-[320px] overflow-hidden">
                <RentalImage src="/images/ns-hotel/titel.jpg" alt="N's Hotel Kerzers" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Hotel size={11} /> Hotel
                  </span>
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <MapPin size={12} /> Kerzers, 3210
                  <span className="flex gap-0.5 ml-2">{[1,2,3,4,5].map(i => <Star key={i} size={11} className="fill-amber-400 text-amber-400" />)}</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">N's Hotel</h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  Ein modernes Boutique-Hotel im Herzen von Kerzers — mit Self Check-in, durchdachtem Design und allem, was Sie für einen entspannten oder produktiven Aufenthalt brauchen.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Ideal für Geschäftsreisen, Zwischenstopps und Kurzbesuche in der Region Bern-Seeland. Einfach buchen, unkompliziert einchecken.
                </p>
                <div className="space-y-2.5">
                  <a
                    href="https://my.ns-hotel.ch/search/offers?PROPERTY_IDS=NSH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-5 rounded-xl transition-colors"
                  >
                    <ExternalLink size={15} /> Direkt buchen
                  </a>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="https://www.booking.com/Share-BhDPswK"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 py-2.5 px-4 rounded-xl transition-colors text-sm font-medium"
                    >
                      <ExternalLink size={12} /> Booking.com
                    </a>
                    <a
                      href="https://www.airbnb.ch/rooms/1300557231274190252"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:text-rose-600 hover:border-rose-200 py-2.5 px-4 rounded-xl transition-colors text-sm font-medium"
                    >
                      <ExternalLink size={12} /> Airbnb
                    </a>
                  </div>
                  <a
                    href="mailto:office@reto-amonn.ch?subject=Anfrage%20N%27s%20Hotel"
                    className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 px-5 rounded-xl transition-colors text-sm"
                  >
                    <Mail size={13} /> Direkt anfragen
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Casa Reto */}
      <section className="py-8 pb-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-100"
          >
            <div className="grid lg:grid-cols-2">
              <div className="p-8 md:p-10 flex flex-col justify-center lg:order-1">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                  <MapPin size={12} /> Gordemo / Lago Maggiore, Tessin
                </div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 w-fit">
                  <Sun size={11} /> Ferienhaus
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Casa Reto</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Stellen Sie sich vor: Aufwachen mit dem Rauschen des Lago Maggiore, Zitronenbäume im Garten, keine Verpflichtungen. Casa Reto ist unser privates Ferienhaus in Gordemo, Tessin — ein stiller Ort zum Atmen, Geniessen und Loslassen.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Lago Maggiore', 'Privater Garten', 'Naturlage', 'Ruhige Umgebung', 'Tessin'].map(tag => (
                    <span key={tag} className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100">{tag}</span>
                  ))}
                </div>
                <div className="space-y-2.5">
                  <Link
                    to="/casa-reto"
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-5 rounded-xl transition-colors"
                  >
                    Alle Details ansehen <ArrowRight size={15} />
                  </Link>
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href="https://www.airbnb.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:text-rose-600 py-2.5 px-3 rounded-xl transition-colors text-xs font-medium"
                    >
                      <ExternalLink size={11} /> Airbnb
                    </a>
                    <a
                      href="https://www.booking.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:text-blue-600 py-2.5 px-3 rounded-xl transition-colors text-xs font-medium"
                    >
                      <ExternalLink size={11} /> Booking
                    </a>
                    <a
                      href="https://www.fewo-direkt.de"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:text-emerald-600 py-2.5 px-3 rounded-xl transition-colors text-xs font-medium"
                    >
                      <ExternalLink size={11} /> Fewo
                    </a>
                  </div>
                  <a
                    href="mailto:office@reto-amonn.ch?subject=Anfrage%20Casa%20Reto"
                    className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 px-5 rounded-xl transition-colors text-sm"
                  >
                    <Mail size={13} /> Direkt anfragen
                  </a>
                </div>
              </div>
              <div className="relative h-72 lg:h-auto min-h-[320px] overflow-hidden lg:order-2">
                <RentalImage src="/images/casa-reto/titel.jpg" alt="Casa Reto Tessin" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* General inquiry */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl font-light text-gray-900 mb-3">Allgemeine Anfrage für Short Stay</h2>
            <p className="text-gray-500 mb-6">Nicht sicher, was Sie brauchen? Wir helfen Ihnen gerne dabei, die richtige Option zu finden.</p>
            <Link
              to="/immobilien/anfrage"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              Zur Anfrage <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
