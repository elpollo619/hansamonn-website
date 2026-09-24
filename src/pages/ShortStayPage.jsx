import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hotel, ArrowRight, ExternalLink, Star, MapPin, Mail, Sun } from 'lucide-react';
import { Helmet } from 'react-helmet';
import PageHero from '@/components/PageHero';

const BRAND = 'var(--brand-color, #1D3D78)';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

const RentalImage = ({ src, alt, className }) => {
  const [err, setErr] = React.useState(false);
  return err ? (
    <div className={`${className} bg-gray-100 flex items-center justify-center`}>
      <Hotel size={28} className="text-gray-300" />
    </div>
  ) : (
    <img src={src} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setErr(true)} />
  );
};

export default function ShortStayPage() {
  return (
    <div className="bg-white">
      <Helmet>
        <title>Short Stay & Ferienhaus | Hans Amonn AG</title>
        <meta name="description" content="N's Hotel Kerzers und Casa Reto am Lago Maggiore. Kurzaufenthalte und Ferienhaus-Vermietung." />
      </Helmet>
      {/* Hero */}
      <PageHero
        back={{ to: '/immobilien', label: 'Immobilien' }}
        eyebrow="Hans Amonn AG · Short Stay"
        title="Short Stay"
        subtitle="Kurzaufenthalte, Business Trips und Ferienunterkünfte. Direkt buchbar oder über Booking.com und Airbnb."
        image="/images/ns-hotel/lounge.jpg"
      />

      {/* N's Hotel */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            {...fadeUp}
            className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center"
          >
            <div className="lg:col-span-7 group relative aspect-[4/3] overflow-hidden bg-gray-100">
              <RentalImage src="/images/ns-hotel/aussen.jpg" alt="N's Hotel Kerzers" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5">
                  <Hotel size={13} /> Hotel
                </span>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
                <MapPin size={13} /> Kerzers, 3210
                <span className="flex gap-0.5 ml-2">{[1,2,3,4,5].map(i => <Star key={i} size={11} className="fill-[#1D3D78] text-[#1D3D78]" />)}</span>
              </div>
              <h2 className="display-heading uppercase text-3xl md:text-4xl mb-6">N's Hotel</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Ein modernes Boutique-Hotel im Herzen von Kerzers — mit Self Check-in, durchdachtem Design und allem, was Sie für einen entspannten oder produktiven Aufenthalt brauchen.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Ideal für Geschäftsreisen, Zwischenstopps und Kurzbesuche in der Region Bern-Seeland. Einfach buchen, unkompliziert einchecken.
              </p>
              <div className="space-y-3">
                <a
                  href="https://my.ns-hotel.ch/search/offers?PROPERTY_IDS=NSH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 text-white font-semibold text-sm py-3 px-6 transition-colors"
                  style={{ backgroundColor: BRAND }}
                    onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                    onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
                >
                  <ExternalLink size={15} /> Direkt buchen
                </a>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://www.booking.com/Share-BhDPswK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-semibold"
                  >
                    <ExternalLink size={13} /> Booking.com
                  </a>
                  <a
                    href="https://www.airbnb.ch/rooms/1300557231274190252"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-semibold"
                  >
                    <ExternalLink size={13} /> Airbnb
                  </a>
                </div>
                <a
                  href="mailto:office@reto-amonn.ch?subject=Anfrage%20N%27s%20Hotel"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  <Mail size={14} /> Direkt anfragen
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Casa Reto */}
      <section className="py-20 md:py-24 surface-warm">
        <div className="container mx-auto px-6">
          <motion.div
            {...fadeUp}
            className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center"
          >
            <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
                <MapPin size={13} /> Gordemo / Lago Maggiore, Tessin
              </div>
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 mb-5 w-fit">
                <Sun size={13} /> Ferienhaus
              </div>
              <h2 className="display-heading uppercase text-3xl md:text-4xl mb-6">Casa Reto</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Stellen Sie sich vor: Aufwachen mit dem Rauschen des Lago Maggiore, Zitronenbäume im Garten, keine Verpflichtungen. Casa Reto ist unser privates Ferienhaus in Gordemo, Tessin — ein stiller Ort zum Atmen, Geniessen und Loslassen.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Lago Maggiore', 'Privater Garten', 'Naturlage', 'Ruhige Umgebung', 'Tessin'].map(tag => (
                  <span key={tag} className="text-xs bg-white text-gray-600 px-3 py-1.5 border border-gray-200">{tag}</span>
                ))}
              </div>
              <div className="space-y-3">
                <Link
                  to="/casa-reto"
                  className="w-full flex items-center justify-center gap-2 text-white font-semibold text-sm py-3 px-6 transition-colors"
                  style={{ backgroundColor: BRAND }}
                  onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                  onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
                >
                  Alle Details ansehen <ArrowRight size={15} />
                </Link>
                <div className="grid grid-cols-3 gap-3">
                  <a
                    href="https://www.airbnb.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-white py-3 px-3 border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-xs font-semibold"
                  >
                    <ExternalLink size={12} /> Airbnb
                  </a>
                  <a
                    href="https://www.booking.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-white py-3 px-3 border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-xs font-semibold"
                  >
                    <ExternalLink size={12} /> Booking
                  </a>
                  <a
                    href="https://www.fewo-direkt.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-white py-3 px-3 border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-xs font-semibold"
                  >
                    <ExternalLink size={12} /> Fewo
                  </a>
                </div>
                <a
                  href="mailto:office@reto-amonn.ch?subject=Anfrage%20Casa%20Reto"
                  className="w-full flex items-center justify-center gap-2 bg-white py-3 px-6 border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-semibold"
                >
                  <Mail size={14} /> Direkt anfragen
                </a>
              </div>
            </div>
            <div className="lg:col-span-7 group relative aspect-[4/3] overflow-hidden bg-gray-100 order-1 lg:order-2">
              <RentalImage src="/images/casa-reto/titel.jpg" alt="Casa Reto Tessin" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* General inquiry */}
      <section className="py-20 md:py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <motion.div
            {...fadeUp}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="display-heading uppercase text-3xl md:text-4xl mb-5">Allgemeine Anfrage für Short Stay</h2>
            <p className="text-gray-600 leading-relaxed mb-8">Nicht sicher, was Sie brauchen? Wir helfen Ihnen gerne dabei, die richtige Option zu finden.</p>
            <Link
              to="/immobilien/anfrage"
              className="inline-flex items-center gap-2 text-white font-semibold text-sm px-6 py-3 transition-colors"
              style={{ backgroundColor: BRAND }}
            >
              Zur Anfrage <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
