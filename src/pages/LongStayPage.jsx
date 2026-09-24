import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, MapPin, Users, Briefcase, Clock, CheckCircle2, Mail } from 'lucide-react';
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
      <Building2 size={28} className="text-gray-300" />
    </div>
  ) : (
    <img src={src} alt={alt} className={className} loading="lazy" decoding="async" onError={() => setErr(true)} />
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
      <PageHero
        back={{ to: '/immobilien', label: 'Immobilien' }}
        eyebrow="Hans Amonn AG · Long Stay"
        title="Long Stay"
        subtitle="Möblierte Zimmer für Aufenthalte ab einem Monat — voll ausgestattet, klar bepreist, ohne versteckte Kosten. Für Mitarbeitende, Projekteinsätze und alle, die flexibel wohnen möchten."
        image="/images/kerzers/titel.jpg"
      />

      {/* Ideal for */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {idealFor.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-4 py-7 md:px-8 md:first:pl-0">
                  <Icon size={22} className="mt-0.5 flex-shrink-0" style={{ color: BRAND }} />
                  <div>
                    <p className="font-display uppercase text-lg font-semibold leading-none text-[#0F1B2D]">{item.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed mt-1.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Locations grid */}
      <section className="py-20 md:py-24 surface-warm">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow mb-3">Long Stay</p>
              <h2 className="display-heading uppercase text-4xl md:text-5xl">Unsere Standorte</h2>
            </div>
            <p className="text-gray-600 leading-relaxed max-w-md">Drei Standorte in der Region Bern — wählen Sie den passenden für Ihre Bedürfnisse.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {locations.map((loc, idx) => (
              <motion.div
                key={loc.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white overflow-hidden border border-gray-100 hover:border-gray-300 transition-colors flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <RentalImage src={loc.image} alt={loc.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display uppercase text-2xl font-semibold leading-none text-[#0F1B2D]">{loc.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mt-2">{loc.subtitle}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-3 mb-5">
                    <MapPin size={12} /> {loc.address}
                  </div>
                  <div className="border-t border-gray-100 mb-5">
                    {loc.rooms.map((room) => (
                      <div key={room.label} className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600">{room.label}{room.detail ? ` · ${room.detail}` : ''}</span>
                        <span className="text-sm font-semibold" style={{ color: BRAND }}>{room.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-6">
                    {loc.features.map((f) => (
                      <span key={f} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <CheckCircle2 size={12} className="flex-shrink-0" style={{ color: BRAND }} /> {f}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <Link
                      to={loc.link}
                      className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 px-6 transition-colors text-sm"
                      style={{ backgroundColor: BRAND }}
                      onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                      onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
                    >
                      Details ansehen <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* General inquiry CTA */}
      <section className="py-20 md:py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <motion.div
            {...fadeUp}
            className="grid lg:grid-cols-12 gap-10 items-end"
          >
            <div className="lg:col-span-7">
              <Mail size={28} className="mb-5" style={{ color: BRAND }} />
              <h2 className="display-heading uppercase text-4xl md:text-5xl mb-5">Allgemeine Mietanfrage für Long Stay</h2>
              <p className="text-gray-600 leading-relaxed max-w-xl">
                Noch nicht sicher, welcher Standort passt? Schildern Sie uns Ihre Situation — wir finden gemeinsam die beste Lösung.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-3">
              <Link
                to="/immobilien/anfrage"
                className="inline-flex items-center justify-center gap-2 text-white font-semibold text-sm px-6 py-3 transition-colors"
                style={{ backgroundColor: BRAND }}
              >
                Zur Mietanfrage <ArrowRight size={15} />
              </Link>
              <a
                href="tel:+41319518554"
                className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold text-sm px-6 py-3 hover:bg-gray-50 transition-colors"
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
