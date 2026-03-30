import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, MapPin, Users, Briefcase, Clock, ChevronRight, CheckCircle2, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet';

const RentalImage = ({ src, alt, className }) => {
  const [err, setErr] = React.useState(false);
  return err ? (
    <div className={`${className} bg-gray-100 flex items-center justify-center`}>
      <Building2 size={28} className="text-gray-300" />
    </div>
  ) : (
    <img src={src} alt={alt} className={className} loading="lazy" onError={() => setErr(true)} />
  );
};

const locations = [
  {
    title: 'Kerzers',
    subtitle: 'Möblierte Zimmer im Herzen des Seelandes',
    address: 'Kerzers, 3210',
    image: '/images/kerzers/titel.jpg',
    link: '/long-stay/kerzers',
    rooms: [
      { label: 'Einzelzimmer', detail: '12 m²', price: 'ab CHF 900 / Mt.' },
      { label: 'Doppelzimmer', detail: '', price: 'ab CHF 1150 / Mt.' },
    ],
    features: ['Strom inkl.', 'Internet inkl.', 'Wasser inkl.', 'Reinigung inkl.'],
    color: 'from-blue-600 to-blue-800',
  },
  {
    title: 'Münchenbuchsee',
    subtitle: 'Ruhige Lage, gute Anbindung an Bern',
    address: 'Münchenbuchsee, 3053',
    image: '/images/muenchenbuchsee/titel.jpg',
    link: '/long-stay/munchenbuchsee',
    rooms: [
      { label: 'Einzelzimmer', detail: '', price: 'ab CHF 750 / Mt.' },
      { label: 'Doppelzimmer', detail: '', price: 'ab CHF 1250 / Mt.' },
    ],
    features: ['Möbliert', 'Gemeinschaftsküche', 'Parking möglich', 'Flexibel buchbar'],
    color: 'from-amber-600 to-amber-800',
  },
  {
    title: 'Muri bei Bern',
    subtitle: 'Komfortables Wohnen in der Agglomeration Bern',
    address: 'Blümlisalpstrasse 4, 3074 Muri bei Bern',
    image: '/images/muri/titel.jpg',
    link: '/long-stay/muri',
    rooms: [
      { label: 'Einzelzimmer', detail: '', price: 'ab CHF 900 / Mt.' },
      { label: 'Doppelzimmer', detail: '', price: 'ab CHF 1250 / Mt.' },
    ],
    features: ['Möbliert', 'Zentral gelegen', 'ÖV-nah', 'Kurz- und Langzeit'],
    color: 'from-emerald-600 to-emerald-800',
  },
];

const idealFor = [
  { icon: Briefcase, title: 'Firmenkunden', desc: 'Mitarbeitende auf Montage, Projekteinsätze oder Versetzungen' },
  { icon: Users, title: 'Temporäres Wohnen', desc: 'Zwischen zwei Wohnungen oder beim Umzug in die Region' },
  { icon: Clock, title: 'Flexible Dauer', desc: 'Aufenthalte ab 1 Monat, ohne lange Bindung' },
];

export default function LongStayPage() {
  return (
    <div className="bg-white">
      <Helmet>
        <title>Long Stay – Möblierte Zimmer | Hans Amonn AG</title>
        <meta name="description" content="Möblierte Langzeitaufenthalte in Kerzers, Münchenbuchsee und Muri. Ab 1 Monat, Nebenkosten inklusive." />
      </Helmet>
      {/* Hero */}
      <section className="relative text-white overflow-hidden" style={{ backgroundColor: '#1D3D78' }}>
        <div />
        <div className="relative container mx-auto px-6 py-16 md:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Link to="/immobilien" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
              <ChevronRight size={14} className="rotate-180" /> Immobilien
            </Link>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 mb-5">
              <Building2 size={12} /> Long Stay
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-5">
              Long Stay
            </h1>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
              Möblierte Zimmer für Aufenthalte ab einem Monat — voll ausgestattet, klar bepreist, ohne versteckte Kosten. Für Mitarbeitende, Projekteinsätze und alle, die flexibel wohnen möchten.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              {idealFor.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 max-w-xs">
                    <Icon size={18} className="text-white/60 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-white/50 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Locations grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-3">Unsere Standorte</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Drei Standorte in der Region Bern — wählen Sie den passenden für Ihre Bedürfnisse.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {locations.map((loc, idx) => (
              <motion.div
                key={loc.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white overflow-hidden border border-gray-100 hover:border-gray-300 transition-colors flex flex-col"
              >
                <div className="relative h-52 overflow-hidden">
                  <RentalImage src={loc.image} alt={loc.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{loc.title}</h3>
                    <p className="text-white/70 text-xs mt-0.5">{loc.subtitle}</p>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                    <MapPin size={11} /> {loc.address}
                  </div>
                  <div className="space-y-2 mb-4">
                    {loc.rooms.map((room) => (
                      <div key={room.label} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <span className="text-xs text-gray-600">{room.label}{room.detail ? ` · ${room.detail}` : ''}</span>
                        <span className="text-xs font-semibold text-gray-900">{room.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {loc.features.map((f) => (
                      <span key={f} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-0.5 border border-gray-100">
                        <CheckCircle2 size={9} /> {f}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <Link
                      to={loc.link}
                      className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 px-4 transition-colors text-sm"
                      style={{ backgroundColor: '#1D3D78' }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor='#162E5A'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor='#1D3D78'}
                    >
                      Details ansehen <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* General inquiry CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto p-8 md:p-12 text-center text-white"
            style={{ backgroundColor: '#1D3D78' }}
          >
            <div className="w-14 h-14 bg-white/10 flex items-center justify-center mx-auto mb-5">
              <Mail size={24} className="text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-light mb-3">Allgemeine Mietanfrage für Long Stay</h2>
            <p className="text-white/60 mb-8 leading-relaxed">
              Noch nicht sicher, welcher Standort passt? Schildern Sie uns Ihre Situation — wir finden gemeinsam die beste Lösung.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/immobilien/anfrage"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold px-7 py-3.5 hover:bg-gray-100 transition-colors"
              >
                Zur Mietanfrage <ArrowRight size={15} />
              </Link>
              <a
                href="tel:+41319518554"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-medium px-7 py-3.5 hover:bg-white/10 transition-colors"
              >
                +41 (0)31 951 85 54
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
