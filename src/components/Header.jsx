import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown,
  BedDouble, Building2, Map, Calculator,
  ClipboardList, Briefcase, Layers, Newspaper,
  Users, Info, Phone, Heart, Search,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/i18n';
import { useFavorites } from '@/context/FavoritesContext';
import GlobalSearch from '@/components/GlobalSearch';

/* ─── Dropdown: Immobilien ─────────────────────────────────────────────── */
const ImmobilienDropdown = ({ onClose }) => (
  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-72">
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="bg-white shadow-xl border border-gray-100 rounded-2xl p-3"
    >
      {/* Section label */}
      <p className="px-4 pt-1 pb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
        Wohnen &amp; Übernachten
      </p>

      <Link to="/immobilien/long-stay" onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group">
        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
          <BedDouble size={14} className="text-[#1D3D78]" />
        </div>
        <span className="text-sm font-medium">Long Stay</span>
      </Link>

      <Link to="/immobilien/short-stay" onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group">
        <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
          <BedDouble size={14} className="text-sky-600" />
        </div>
        <span className="text-sm font-medium">Short Stay</span>
      </Link>

      <Link to="/immobilien/apartments" onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <Building2 size={14} className="text-indigo-600" />
        </div>
        <span className="text-sm font-medium">Apartments</span>
      </Link>

      <div className="my-2 border-t border-gray-100" />

      <p className="px-4 pb-1 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
        Kaufen &amp; Mehr
      </p>

      <Link to="/immobilien/verkauf" onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors group">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <Building2 size={14} className="text-emerald-600" />
        </div>
        <span className="text-sm font-medium">Verkauf</span>
      </Link>

      <Link to="/karte" onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-slate-50 hover:text-slate-700 transition-colors group">
        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Map size={14} className="text-slate-600" />
        </div>
        <span className="text-sm font-medium">Karte</span>
      </Link>

      <Link to="/hyporechner" onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors group">
        <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Calculator size={14} className="text-amber-600" />
        </div>
        <span className="text-sm font-medium">Hypothekenrechner</span>
      </Link>

      <div className="my-2 border-t border-gray-100" />

      <Link to="/immobilien/anfrage" onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#1D3D78] hover:bg-[#162E5A] transition-colors">
        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <ClipboardList size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Mietanfrage stellen</p>
          <p className="text-xs text-blue-100">Zimmer oder Wohnung anfragen</p>
        </div>
      </Link>
    </motion.div>
  </div>
);

/* ─── Dropdown: Architektur ────────────────────────────────────────────── */
const ArchitekturDropdown = ({ onClose }) => (
  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-60">
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="bg-white shadow-xl border border-gray-100 rounded-2xl p-3"
    >
      <Link to="/projekte" onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-stone-50 hover:text-stone-800 transition-colors">
        <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
          <Layers size={14} className="text-stone-600" />
        </div>
        <span className="text-sm font-medium">Projekte</span>
      </Link>

      <Link to="/leistungen" onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-stone-50 hover:text-stone-800 transition-colors">
        <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
          <Briefcase size={14} className="text-stone-600" />
        </div>
        <span className="text-sm font-medium">Leistungen</span>
      </Link>

      <Link to="/neuigkeiten" onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-stone-50 hover:text-stone-800 transition-colors">
        <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
          <Newspaper size={14} className="text-stone-600" />
        </div>
        <span className="text-sm font-medium">Neuigkeiten</span>
      </Link>
    </motion.div>
  </div>
);

/* ─── Dropdown: Über uns ───────────────────────────────────────────────── */
const UberUnsDropdown = ({ onClose }) => (
  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 w-56">
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="bg-white shadow-xl border border-gray-100 rounded-2xl p-3"
    >
      <Link to="/uber-uns" onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Info size={14} className="text-gray-600" />
        </div>
        <span className="text-sm font-medium">Über uns</span>
      </Link>

      <Link to="/team" onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Users size={14} className="text-gray-600" />
        </div>
        <span className="text-sm font-medium">Team</span>
      </Link>

      <Link to="/kontakt" onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Phone size={14} className="text-gray-600" />
        </div>
        <span className="text-sm font-medium">Kontakt</span>
      </Link>
    </motion.div>
  </div>
);

/* ─── Section logo logic ───────────────────────────────────────────────── */
const SECTION_LOGOS = [
  { paths: ['/immobilien', '/long-stay', '/ns-hotel', '/casa-reto'], logo: 'AMONN IMMOBILIEN' },
  { paths: ['/architektur', '/leistungen', '/projekte', '/neuigkeiten'], logo: 'AMONN ARCHITEKTUR' },
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

/* ─── NavDropdown wrapper (desktop) ───────────────────────────────────── */
const NavDropdown = ({ label, to, isActive, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to={to}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'text-[#1D3D78] bg-[#EFF4FB] font-semibold'
            : 'text-gray-700 hover:text-[#1D3D78] hover:bg-gray-50'
        }`}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </Link>
      <AnimatePresence>
        {open && React.cloneElement(children, { onClose: () => setOpen(false) })}
      </AnimatePresence>
    </div>
  );
};

/* ─── Header ───────────────────────────────────────────────────────────── */
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState({ immobilien: false, architektur: false, uberUns: false });
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const sectionLogo = useSectionLogo(location.pathname);
  const { favorites } = useFavorites();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileOpen({ immobilien: false, architektur: false, uberUns: false });
  }, [location.pathname]);

  const isActive = (paths) =>
    paths.some((p) => location.pathname === p || location.pathname.startsWith(p + '/'));

  const toggleMobile = (key) =>
    setMobileOpen((prev) => ({ ...prev, [key]: !prev[key] }));

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

          {/* Desktop nav — 3 items */}
          <div className="hidden lg:flex items-center gap-1">
            <NavDropdown
              label={t('nav.immobilien')}
              to="/immobilien"
              isActive={isActive(['/immobilien', '/long-stay', '/ns-hotel', '/casa-reto', '/karte', '/hyporechner'])}
            >
              <ImmobilienDropdown />
            </NavDropdown>

            <NavDropdown
              label="Architektur"
              to="/architektur"
              isActive={isActive(['/architektur', '/projekte', '/leistungen', '/neuigkeiten'])}
            >
              <ArchitekturDropdown />
            </NavDropdown>

            <NavDropdown
              label="Über uns"
              to="/uber-uns"
              isActive={isActive(['/uber-uns', '/team', '/kontakt'])}
            >
              <UberUnsDropdown />
            </NavDropdown>
          </div>

          {/* Right controls */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-[#1D3D78] hover:bg-gray-50 transition-colors"
              aria-label="Suche öffnen"
            >
              <Search size={18} />
            </button>

            <Link
              to="/favoriten"
              className="relative p-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Meine Favoriten"
            >
              <Heart size={18} className={favorites.length > 0 ? 'fill-red-500 text-red-500' : ''} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>

            <LanguageSwitcher variant="light" />
          </div>

          {/* Mobile: search + favorites + language + hamburger */}
          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Suche"
            >
              <Search size={18} />
            </button>
            <Link
              to="/favoriten"
              className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Favoriten"
            >
              <Heart size={18} className={favorites.length > 0 ? 'fill-red-500 text-red-500' : ''} />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>
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

                {/* Immobilien */}
                <div>
                  <button
                    onClick={() => toggleMobile('immobilien')}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(['/immobilien', '/long-stay', '/ns-hotel', '/casa-reto', '/karte', '/hyporechner'])
                        ? 'text-[#1D3D78] bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t('nav.immobilien')}
                    <ChevronDown size={14} className={`transition-transform ${mobileOpen.immobilien ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileOpen.immobilien && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-4 mt-1 space-y-0.5"
                      >
                        <p className="px-3 pt-1 pb-0.5 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">Wohnen &amp; Übernachten</p>
                        <Link to="/immobilien/long-stay" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-[#1D3D78] rounded-lg hover:bg-gray-50"><BedDouble size={13} className="text-gray-400" /> Long Stay</Link>
                        <Link to="/immobilien/short-stay" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-[#1D3D78] rounded-lg hover:bg-gray-50"><BedDouble size={13} className="text-gray-400" /> Short Stay</Link>
                        <Link to="/immobilien/apartments" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-[#1D3D78] rounded-lg hover:bg-gray-50"><Building2 size={13} className="text-gray-400" /> Apartments</Link>
                        <div className="mx-3 my-1 border-t border-gray-100" />
                        <Link to="/immobilien/verkauf" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 rounded-lg hover:bg-gray-50"><Building2 size={13} className="text-gray-400" /> Verkauf</Link>
                        <Link to="/karte" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-slate-700 rounded-lg hover:bg-gray-50"><Map size={13} className="text-gray-400" /> Karte</Link>
                        <Link to="/hyporechner" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-amber-700 rounded-lg hover:bg-gray-50"><Calculator size={13} className="text-gray-400" /> Hypothekenrechner</Link>
                        <div className="mx-3 my-1 border-t border-gray-100" />
                        <Link to="/immobilien/anfrage" className="block px-3 py-2 text-sm text-[#1D3D78] font-medium rounded-lg hover:bg-blue-50">Mietanfrage stellen</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Architektur */}
                <div>
                  <button
                    onClick={() => toggleMobile('architektur')}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(['/projekte', '/leistungen', '/neuigkeiten'])
                        ? 'text-[#1D3D78] bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Architektur
                    <ChevronDown size={14} className={`transition-transform ${mobileOpen.architektur ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileOpen.architektur && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-4 mt-1 space-y-0.5"
                      >
                        <Link to="/projekte" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-stone-800 rounded-lg hover:bg-gray-50"><Layers size={13} className="text-gray-400" /> Projekte</Link>
                        <Link to="/leistungen" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-stone-800 rounded-lg hover:bg-gray-50"><Briefcase size={13} className="text-gray-400" /> Leistungen</Link>
                        <Link to="/neuigkeiten" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-stone-800 rounded-lg hover:bg-gray-50"><Newspaper size={13} className="text-gray-400" /> Neuigkeiten</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Über uns */}
                <div>
                  <button
                    onClick={() => toggleMobile('uberUns')}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(['/uber-uns', '/team', '/kontakt'])
                        ? 'text-[#1D3D78] bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Über uns
                    <ChevronDown size={14} className={`transition-transform ${mobileOpen.uberUns ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileOpen.uberUns && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-4 mt-1 space-y-0.5"
                      >
                        <Link to="/uber-uns" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"><Info size={13} className="text-gray-400" /> Über uns</Link>
                        <Link to="/team" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"><Users size={13} className="text-gray-400" /> Team</Link>
                        <Link to="/kontakt" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"><Phone size={13} className="text-gray-400" /> Kontakt</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Global Search overlay */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </motion.header>
  );
};

export default Header;
