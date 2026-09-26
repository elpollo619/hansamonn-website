import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, ArrowRight, CalendarDays } from 'lucide-react';
import { useTranslation } from '@/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import AmonnLogo from '@/components/AmonnLogo';
import { getSetting } from '@/data/settingsStore';

// Pages that already end in their own contact block skip the footer CTA band
const NO_CTA = ['/kontakt', '/termin'];

const Footer = () => {
  const { pathname } = useLocation();
  const showCta = !NO_CTA.includes(pathname);
  const { t } = useTranslation();
  const year    = new Date().getFullYear();
  const phone   = getSetting('phone');
  const email   = getSetting('email');
  const address = getSetting('address');

  const cols = [
    {
      heading: 'Immobilien',
      links: [
        { to: '/immobilien/vermietung', label: 'Vermietung' },
        { to: '/immobilien/long-stay',  label: 'Long Stay' },
        { to: '/immobilien/short-stay', label: 'Short Stay' },
        { to: '/immobilien/apartments', label: 'Apartments' },
        { to: '/immobilien/verkauf',    label: 'Verkauf' },
        { to: '/immobilien/anfrage',    label: 'Mietanfrage' },
      ],
    },
    {
      heading: 'Architektur',
      links: [
        { to: '/architektur',                   label: 'Übersicht' },
        { to: '/leistungen/planung-entwurf',    label: 'Planung & Entwurf' },
        { to: '/leistungen/neubauten',          label: 'Neubauten' },
        { to: '/leistungen/sanierungen-umbauten', label: 'Sanierungen' },
        { to: '/leistungen/projektbegleitung',  label: 'Projektbegleitung' },
        { to: '/projekte',                      label: 'Projekte' },
      ],
    },
    {
      heading: 'Über uns',
      links: [
        { to: '/uber-uns',   label: 'Über uns' },
        { to: '/team',       label: 'Team' },
        { to: '/kontakt',    label: 'Kontakt' },
        { to: '/neuigkeiten', label: 'Neuigkeiten' },
        { to: '/faq',        label: 'FAQ' },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#0B1220] text-white">
      {/* ── CTA band ── */}
      {showCta && (
      <div className="container mx-auto px-6 pt-20 pb-14 border-b border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display uppercase font-semibold leading-[0.95] tracking-tight text-3xl md:text-5xl">
              Haben Sie ein Projekt?<br />
              <span className="text-white/40">Sprechen wir darüber.</span>
            </h2>
          </motion.div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/kontakt"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3.5 text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Kontakt aufnehmen <ArrowRight size={16} />
            </Link>
            <Link
              to="/termin"
              className="inline-flex items-center gap-2 border border-white/30 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              <CalendarDays size={16} /> Termin buchen
            </Link>
          </div>
        </div>
      </div>
      )}

      {/* ── Columns ── */}
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="block mb-5">
              <AmonnLogo variant="main" size="md" color="#fff" lightColor="rgba(255,255,255,0.8)" />
            </Link>
            <p className="text-white/55 text-sm leading-relaxed mb-6 max-w-xs">
              {t('footer.tagline') || 'Ihr Partner für Architektur und Immobilien in der Region Bern, seit über 55 Jahren.'}
            </p>
            <div className="space-y-2.5 mb-6">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-white/40 mt-0.5 flex-shrink-0" />
                <p className="text-white/55 text-sm">{address}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-white/40 flex-shrink-0" />
                <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-white/55 hover:text-white text-sm transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-white/40 flex-shrink-0" />
                <a href={`mailto:${email}`} className="text-white/55 hover:text-white text-sm transition-colors">
                  {email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <a href="https://www.facebook.com/people/Hans-Amonn-AG/100084327557360/" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-white/20 flex items-center justify-center hover:border-white/60 hover:bg-white/10 transition-colors" aria-label="Facebook">
                <Facebook size={15} />
              </a>
              <a href="https://www.instagram.com/amonnarchitektur/?hl=de" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-white/20 flex items-center justify-center hover:border-white/60 hover:bg-white/10 transition-colors" aria-label="Instagram">
                <Instagram size={15} />
              </a>
              <a href="https://www.linkedin.com/in/hans-amonn-689b7938b" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 border border-white/20 flex items-center justify-center hover:border-white/60 hover:bg-white/10 transition-colors" aria-label="LinkedIn">
                <Linkedin size={15} />
              </a>
            </div>
            <LanguageSwitcher variant="dark" />
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.heading}>
              <p className="text-[10px] font-semibold tracking-[0.22em] text-white/40 uppercase mb-4">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-white/60 hover:text-white text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Giant wordmark (decorative) ── */}
      <div className="container mx-auto px-6" aria-hidden="true">
        <motion.p
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display uppercase font-semibold leading-[0.8] tracking-tight text-white/[0.07] select-none whitespace-nowrap"
          style={{ fontSize: 'clamp(3.5rem, 15vw, 15rem)' }}
        >
          Hans Amonn
        </motion.p>
      </div>

      {/* ── Bottom bar ── */}
      <div className="container mx-auto px-6">
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/35 text-xs">
            © {year} Hans Amonn AG · Alle Rechte vorbehalten
          </p>
          <div className="flex gap-5 text-xs">
            <Link to="/impressum" className="text-white/35 hover:text-white/70 transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="text-white/35 hover:text-white/70 transition-colors">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
