import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, BedDouble, Building2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/i18n';

const ImmobilienDropdown = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-64">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.15 }}
        className="bg-white shadow-xl border border-gray-100 rounded-2xl p-3"
      >
        <Link
          to="/immobilien/vermietung"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <BedDouble size={15} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold">{t('nav.vermietung')}</p>
            <p className="text-xs text-gray-400 group-hover:text-blue-500">Long Stay, Short Stay & Apartments</p>
          </div>
        </Link>
        <Link
          to="/immobilien/verkauf"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Building2 size={15} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold">{t('nav.verkauf')}</p>
            <p className="text-xs text-gray-400 group-hover:text-emerald-500">Eigentumswohnungen & Objekte</p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

const SECTION_LOGOS = [
  { paths: ['/immobilien', '/long-stay', '/ns-hotel', '/casa-reto'], logo: 'AMONN IMMOBILIEN' },
  { paths: ['/leistungen', '/projekte'], logo: 'AMONN ARCHITEKTUR' },
  { paths: ['/team'], logo: 'AMONN TEAM' },
  { paths: ['/uber-uns'], logo: 'AMONN' },
];

function useSectionLogo(pathname) {
  for (const cfg of SECTION_LOGOS) {
    if (cfg.paths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
      return cfg.logo;
    }
  }
  return 'HANS AMONN AG';
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showImmobilienDropdown, setShowImmobilienDropdown] = useState(false);
  const [showMobileImmobilien, setShowMobileImmobilien] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const sectionLogo = useSectionLogo(location.pathname);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowImmobilienDropdown(false);
  }, [location.pathname]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const navItems = [
    { path: '/uber-uns',   label: t('nav.about') },
    { path: '/team',       label: t('nav.team') },
    { path: '/projekte',   label: t('nav.projects') },
    { path: '/leistungen', label: t('nav.services') },
    { path: '/kontakt',    label: t('nav.contact') },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={sectionLogo}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
                whileHover={{ scale: 1.02 }}
                className="leading-none uppercase"
                style={{ letterSpacing: '0.18em' }}
              >
                {(() => {
                  const parts = sectionLogo.split(' ');
                  const first = parts[0];
                  const rest = parts.slice(1).join(' ');
                  return (
                    <>
                      <span className="text-[13px] font-black text-gray-900">{first}</span>
                      {rest && (
                        <span className="text-[13px] font-extralight text-gray-500"> {rest}</span>
                      )}
                    </>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Immobilien with dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowImmobilienDropdown(true)}
              onMouseLeave={() => setShowImmobilienDropdown(false)}
            >
              <Link
                to="/immobilien"
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/immobilien') || isActive('/long-stay') || isActive('/ns-hotel') || isActive('/casa-reto')
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {t('nav.immobilien')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${showImmobilienDropdown ? 'rotate-180' : ''}`} />
              </Link>
              <AnimatePresence>
                {showImmobilienDropdown && (
                  <ImmobilienDropdown onClose={() => setShowImmobilienDropdown(false)} />
                )}
              </AnimatePresence>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher variant="light" />
          </div>

          {/* Mobile: language + hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher variant="light" />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menü"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="mt-3 pb-3 border-t border-gray-100 pt-3 flex flex-col gap-1">
                {/* Immobilien section in mobile */}
                <div>
                  <button
                    onClick={() => setShowMobileImmobilien(!showMobileImmobilien)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/immobilien') ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t('nav.immobilien')}
                    <ChevronDown size={14} className={`transition-transform ${showMobileImmobilien ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showMobileImmobilien && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-4 mt-1 space-y-0.5"
                      >
                        <Link to="/immobilien" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50">{t('nav.overview')}</Link>
                        <Link to="/immobilien/vermietung" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50"><BedDouble size={14} className="text-gray-400" /> {t('nav.vermietung')}</Link>
                        <Link to="/immobilien/verkauf" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 rounded-lg hover:bg-gray-50"><Building2 size={14} className="text-gray-400" /> {t('nav.verkauf')}</Link>
                        <Link to="/immobilien/anfrage" className="block px-3 py-2 text-sm text-blue-600 font-medium rounded-lg hover:bg-blue-50">{t('nav.mietanfrage')}</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path) ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
