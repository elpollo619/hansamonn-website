import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from '@/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getSetting } from '@/data/settingsStore';

const Footer = () => {
  const location = useLocation();
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
    <footer style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }} className="text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="block mb-5">
              <span
                className="text-[13px] font-black uppercase tracking-[0.18em] text-white"
                style={{ letterSpacing: '0.18em' }}
              >
                HANS
              </span>
              <span
                className="text-[13px] font-extralight uppercase tracking-[0.18em] text-white/70"
                style={{ letterSpacing: '0.18em' }}
              >
                {' '}AMONN AG
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              {t('footer.tagline') || 'Ihr Partner für Architektur und Immobilien in der Region Bern — seit über 55 Jahren.'}
            </p>
            <div className="space-y-2.5 mb-6">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-white/40 mt-0.5 flex-shrink-0" />
                <p className="text-white/50 text-sm">{address}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-white/40 flex-shrink-0" />
                <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-white/50 hover:text-white text-sm transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-white/40 flex-shrink-0" />
                <a href={`mailto:${email}`} className="text-white/50 hover:text-white text-sm transition-colors">
                  {email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <a href="https://www.facebook.com/people/Hans-Amonn-AG/100084327557360/" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-white/20 flex items-center justify-center hover:border-white/60 hover:bg-white/10 transition-colors" aria-label="Facebook">
                <Facebook size={14} />
              </a>
              <a href="https://www.instagram.com/amonnarchitektur/?hl=de" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-white/20 flex items-center justify-center hover:border-white/60 hover:bg-white/10 transition-colors" aria-label="Instagram">
                <Instagram size={14} />
              </a>
              <a href="https://www.linkedin.com/in/hans-amonn-689b7938b" target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-white/20 flex items-center justify-center hover:border-white/60 hover:bg-white/10 transition-colors" aria-label="LinkedIn">
                <Linkedin size={14} />
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
                    <Link to={l.to} className="text-white/55 hover:text-white text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/30 text-xs">
            © {year} Hans Amonn AG · Alle Rechte vorbehalten
          </p>
          <div className="flex gap-5 text-xs">
            <Link to="/impressum" className="text-white/30 hover:text-white/70 transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="text-white/30 hover:text-white/70 transition-colors">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
