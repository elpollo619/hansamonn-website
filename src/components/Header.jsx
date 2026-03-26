import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, BedDouble, Hotel, Home, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/i18n';

const ImmobilienDropdown = ({ onClose }) => (
  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-[520px]">
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="bg-white shadow-xl border border-gray-100 rounded-2xl p-6"
    >
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Wohnen</p>
          <Link to="/immobilien/long-stay" onClick={onClose} className="flex items-center gap-2.5 py-2 text-gray-700 hover:text-blue-600 transition-colors text-sm">
            <BedDouble size={15} className="text-gray-400" /> Long Stay
          </Link>
          <Link to="/long-stay/kerzers" onClick={onClose} className="flex items-center gap-2.5 py-1.5 text-gray-500 hover:text-blue-600 transition-colors text-sm pl-6">Kerzers</Link>
          <Link to="/long-stay/munchenbuchsee" onClick={onClose} className="flex items-center gap-2.5 py-1.5 text-gray-500 hover:text-blue-600 transition-colors text-sm pl-6">Münchenbuchsee</Link>
          <Link to="/long-stay/muri" onClick={onClose} className="flex items-center gap-2.5 py-1.5 text-gray-500 hover:text-blue-600 transition-colors text-sm pl-6">Muri bei Bern</Link>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Kurzaufenthalte</p>
          <Link to="/immobilien/short-stay" onClick={onClose} className="flex items-center gap-2.5 py-2 text-gray-700 hover:text-blue-600 transition-colors text-sm">
            <Hotel size={15} className="text-gray-400" /> Short Stay
          </Link>
          <Link to="/ns-hotel" onClick={onClose} className="flex items-center gap-2.5 py-1.5 text-gray-500 hover:text-blue-600 transition-colors text-sm pl-6">N's Hotel</Link>
          <Link to="/casa-reto" onClick={onClose} className="flex items-center gap-2.5 py-1.5 text-gray-500 hover:text-blue-600 transition-colors text-sm pl-6">Casa Reto</Link>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link to="/immobilien/apartments" onClick={onClose} className="flex items-center gap-2.5 py-2 text-gray-700 hover:text-blue-600 transition-colors text-sm">
              <Home size={15} className="text-gray-400" /> Apartments
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link to="/immobilien/anfrage" onClick={onClose} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group">
          <div className="flex items-center gap-2.5">
            <ClipboardList size={15} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-900">Mietanfrage stellen</span>
          </div>
          <span className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">Formular öffnen →</span>
        </Link>
      </div>
    </motion.div>
  </div>
);

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
                className="text-sm font-black text-gray-900 tracking-widest uppercase leading-none"
              >
                {sectionLogo}
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
                Immobilien
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
            <Link to="/kontakt">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2">
                {t('nav.contact')}
              </Button>
            </Link>
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
                    Immobilien
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
                        <Link to="/immobilien" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50">Übersicht</Link>
                        <Link to="/immobilien/long-stay" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50">Long Stay</Link>
                        <Link to="/immobilien/short-stay" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50">Short Stay</Link>
                        <Link to="/immobilien/apartments" className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50">Apartments</Link>
                        <Link to="/immobilien/anfrage" className="block px-3 py-2 text-sm text-blue-600 font-medium rounded-lg hover:bg-blue-50">Mietanfrage</Link>
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
                <Link to="/kontakt" className="mt-2">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                    {t('nav.contact')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
