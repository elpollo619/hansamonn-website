import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Menu, X, ChevronDown, Heart, Search, ArrowRight, ArrowUpRight, Phone, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from '@/i18n';
import { useFavorites } from '@/context/FavoritesContext';
import GlobalSearch from '@/components/GlobalSearch';
import AmonnLogo from '@/components/AmonnLogo';

const BRAND = 'var(--brand-color, #1D3D78)';
const PHONE = { href: 'tel:+41319518554', label: '+41 (0)31 951 85 54' };
const EMAIL = { href: 'mailto:office@reto-amonn.ch', label: 'office@reto-amonn.ch' };

/* ─── Menu structure ───────────────────────────────────────────────────── */
const useMenus = (t) => [
  {
    key: 'immobilien',
    label: t('nav.immobilien'),
    to: '/immobilien',
    active: ['/immobilien', '/long-stay', '/ns-hotel', '/casa-reto', '/karte', '/hyporechner'],
    groups: [
      {
        title: 'Wohnen & Übernachten',
        links: [
          { to: '/immobilien/long-stay', label: 'Long Stay', sub: 'Möbliert wohnen ab einem Monat' },
          { to: '/immobilien/short-stay', label: 'Short Stay', sub: "N's Hotel & Casa Reto" },
          { to: '/immobilien/apartments', label: 'Apartments', sub: 'Mietwohnungen' },
        ],
      },
      {
        title: 'Kaufen & Mehr',
        links: [
          { to: '/immobilien/verkauf', label: 'Verkauf', sub: 'Objekte zum Kauf' },
          { to: '/karte', label: 'Karte', sub: 'Alle Objekte auf einen Blick' },
          { to: '/hyporechner', label: 'Hypothekenrechner', sub: 'Tragbarkeit berechnen' },
        ],
      },
    ],
    feature: {
      to: '/immobilien/anfrage',
      image: '/images/kerzers/01.jpg',
      eyebrow: 'Mietanfrage',
      title: 'Mietanfrage stellen',
      sub: 'Zimmer oder Wohnung anfragen',
    },
  },
  {
    key: 'architektur',
    label: 'Architektur',
    to: '/architektur',
    active: ['/architektur', '/projekte', '/leistungen', '/neuigkeiten'],
    groups: [
      {
        title: 'Architektur',
        links: [
          { to: '/architektur', label: 'Übersicht', sub: 'Vom Plan zum Gebäude' },
          { to: '/projekte', label: 'Projekte', sub: 'Realisierte Bauten' },
          { to: '/leistungen', label: 'Leistungen', sub: 'Planung bis Bauleitung' },
          { to: '/neuigkeiten', label: 'Neuigkeiten', sub: 'Aktuelles aus dem Büro' },
        ],
      },
    ],
    feature: {
      to: '/architektur',
      image: '/images/ns-hotel/drohne-2.jpg',
      eyebrow: 'Amonn Architektur',
      title: 'Architektur entdecken',
      sub: 'Planung, Neubauten und Sanierungen',
    },
  },
  {
    key: 'uberUns',
    label: 'Über uns',
    to: '/uber-uns',
    active: ['/uber-uns', '/team', '/kontakt'],
    groups: [
      {
        title: 'Hans Amonn AG',
        links: [
          { to: '/uber-uns', label: 'Über uns', sub: 'Familienunternehmen seit 1968' },
          { to: '/team', label: 'Team', sub: 'Die Menschen hinter den Projekten' },
          { to: '/kontakt', label: 'Kontakt', sub: 'Wir freuen uns auf Ihre Anfrage' },
        ],
      },
    ],
    contact: true,
  },
];

/* ─── Section logo logic ───────────────────────────────────────────────── */
const SECTION_VARIANTS = [
  { paths: ['/immobilien', '/long-stay', '/ns-hotel', '/casa-reto'], variant: 'immobilien' },
  { paths: ['/architektur', '/leistungen', '/projekte', '/neuigkeiten'], variant: 'architektur' },
  { paths: ['/team'], variant: 'team' },
  { paths: ['/uber-uns'], variant: 'default' },
];

function useSectionVariant(pathname) {
  for (const cfg of SECTION_VARIANTS) {
    if (cfg.paths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
      return cfg.variant;
    }
  }
  return 'main';
}

/* ─── Favorites link (shared desktop/mobile) ──────────────────────────── */
const FavoritesLink = ({ count, className = '' }) => (
  <Link
    to="/favoriten"
    className={`relative p-2 text-gray-500 hover:text-[#0F1B2D] transition-colors ${className}`}
    aria-label="Meine Favoriten"
  >
    <Heart size={18} className={count > 0 ? 'fill-red-500 text-red-500' : ''} />
    {count > 0 && (
      <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
        {count > 9 ? '9+' : count}
      </span>
    )}
  </Link>
);

/* ─── Desktop mega panel ──────────────────────────────────────────────── */
const MegaPanel = ({ menu, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
    className="absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-[0_24px_48px_-24px_rgba(15,27,45,0.25)]"
  >
    <div className="container mx-auto px-6 py-10 grid grid-cols-12 gap-10">
      <div className={`col-span-8 grid gap-10 ${menu.groups.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {menu.groups.map((g) => (
          <div key={g.title}>
            <p className="eyebrow mb-4">{g.title}</p>
            <ul className={menu.groups.length > 1 ? 'space-y-1' : 'grid grid-cols-2 gap-x-10 gap-y-1'}>
              {g.links.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.03 * i }}
                >
                  <Link
                    to={l.to}
                    onClick={onClose}
                    className="group flex items-start justify-between gap-4 py-3 border-b border-gray-100 hover:border-[#0F1B2D] transition-colors"
                  >
                    <span>
                      <span className="block font-display uppercase text-xl font-semibold text-[#0F1B2D] leading-tight">
                        {l.label}
                      </span>
                      <span className="block text-sm text-gray-500 mt-0.5">{l.sub}</span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="mt-1 text-gray-300 group-hover:text-[#0F1B2D] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="col-span-4">
        {menu.feature && (
          <Link to={menu.feature.to} onClick={onClose} className="group relative block aspect-[4/3] overflow-hidden bg-[#0B1220]">
            <img
              src={menu.feature.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-[11px] font-semibold tracking-hairline uppercase text-white/70 mb-2">{menu.feature.eyebrow}</p>
              <p className="font-display uppercase text-2xl font-semibold leading-none flex items-center gap-2">
                {menu.feature.title}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </p>
              <p className="text-sm text-white/70 mt-2">{menu.feature.sub}</p>
            </div>
          </Link>
        )}
        {menu.contact && (
          <div className="h-full bg-[#0B1220] text-white p-7 flex flex-col">
            <p className="text-[11px] font-semibold tracking-hairline uppercase text-white/60 mb-4">Direkt erreichbar</p>
            <a href={PHONE.href} className="flex items-center gap-3 py-3 border-b border-white/10 hover:text-white/80">
              <Phone size={16} /> <span className="font-semibold">{PHONE.label}</span>
            </a>
            <a href={EMAIL.href} className="flex items-center gap-3 py-3 border-b border-white/10 hover:text-white/80">
              <Mail size={16} /> <span className="font-semibold">{EMAIL.label}</span>
            </a>
            <p className="text-sm text-white/60 mt-4 leading-relaxed">Blümlisalpstrasse 4<br />3074 Muri bei Bern</p>
            <Link
              to="/termin"
              onClick={onClose}
              className="mt-auto inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-5 py-3 text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Termin buchen <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

/* ─── Mobile fullscreen menu ──────────────────────────────────────────── */
const MobileMenu = ({ menus, isActive, onClose, top }) => {
  const [open, setOpen] = useState(null);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{ top }}
      className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-[#0B1220] text-white overflow-y-auto"
    >
      <div className="px-6 pt-6 pb-10 min-h-full flex flex-col">
        <nav className="flex-1">
          {menus.map((m, i) => {
            const expanded = open === m.key;
            return (
              <motion.div
                key={m.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 + i * 0.06 }}
                className="border-b border-white/10"
              >
                <button
                  onClick={() => setOpen(expanded ? null : m.key)}
                  className="w-full flex items-center justify-between py-5 text-left"
                  aria-expanded={expanded}
                >
                  <span className={`font-display uppercase text-4xl font-semibold leading-none ${isActive(m.active) ? 'text-white' : 'text-white/80'}`}>
                    {m.label}
                  </span>
                  <ChevronDown size={22} className={`text-white/60 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-5 space-y-1">
                        {m.groups.flatMap((g) => g.links).map((l) => (
                          <Link
                            key={l.to}
                            to={l.to}
                            onClick={onClose}
                            className="flex items-center justify-between py-2.5 text-white/75 hover:text-white"
                          >
                            <span className="text-base font-medium">{l.label}</span>
                            <ArrowUpRight size={16} className="text-white/40" />
                          </Link>
                        ))}
                        {m.feature && (
                          <Link to={m.feature.to} onClick={onClose} className="flex items-center gap-2 pt-2 text-sm font-semibold text-white">
                            {m.feature.title} <ArrowRight size={14} />
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="pt-10 space-y-3"
        >
          <a href={PHONE.href} className="flex items-center gap-3 text-white/80"><Phone size={16} /> {PHONE.label}</a>
          <a href={EMAIL.href} className="flex items-center gap-3 text-white/80"><Mail size={16} /> {EMAIL.label}</a>
          <Link
            to="/kontakt"
            onClick={onClose}
            className="mt-4 flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-4 text-sm font-semibold"
          >
            Kontakt aufnehmen <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ─── Header ───────────────────────────────────────────────────────────── */
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const sectionVariant = useSectionVariant(location.pathname);
  const { favorites } = useFavorites();
  const menus = useMenus(t);
  const closeTimer = useRef(null);
  const lastY = useRef(0);

  // Reading progress line along the bottom edge of the header
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  // Shrink after 50px; hide while scrolling down, reveal when scrolling up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 50);
      if (y > 240 && y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4 || y < 240) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  // Lock page scroll behind the mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isMobileMenuOpen]);

  const isActive = (paths) =>
    paths.some((p) => location.pathname === p || location.pathname.startsWith(p + '/'));

  const openNow = (key) => { clearTimeout(closeTimer.current); setOpenMenu(key); };
  const closeSoon = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpenMenu(null), 120); };

  const pinned = openMenu || isMobileMenuOpen;
  const activeMenu = menus.find((m) => m.key === openMenu);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: hidden && !pinned ? '-100%' : 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        isScrolled || pinned ? 'bg-white shadow-[0_1px_0_rgba(15,27,45,0.08)]' : 'bg-white/90 backdrop-blur-md'
      }`}
      onMouseLeave={closeSoon}
    >
      <nav className="container mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between gap-4 transition-[height] duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0" aria-label="Hans Amonn AG – Startseite">
            <AnimatePresence mode="wait">
              <motion.div
                key={sectionVariant}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
              >
                <AmonnLogo variant={sectionVariant} size="sm" />
              </motion.div>
            </AnimatePresence>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-2 h-full">
            {menus.map((m) => {
              const active = isActive(m.active);
              const open = openMenu === m.key;
              return (
                <div key={m.key} className="relative h-full flex items-center" onMouseEnter={() => openNow(m.key)}>
                  <Link
                    to={m.to}
                    onFocus={() => openNow(m.key)}
                    className={`flex items-center gap-1.5 px-3 h-full text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                      active || open ? 'text-[#0F1B2D]' : 'text-gray-500 hover:text-[#0F1B2D]'
                    }`}
                    aria-expanded={open}
                  >
                    {m.label}
                    <ChevronDown size={13} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </Link>
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute left-3 right-3 bottom-0 h-[2px]"
                      style={{ backgroundColor: BRAND }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right controls (desktop) */}
          <div className="hidden lg:flex items-center gap-1" onMouseEnter={closeSoon}>
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-gray-500 hover:text-[#0F1B2D] transition-colors"
              aria-label="Suche öffnen"
            >
              <Search size={18} />
            </button>
            <FavoritesLink count={favorites.length} />
            <LanguageSwitcher variant="light" />
            <Link
              to="/kontakt"
              className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:brightness-110"
              style={{ backgroundColor: BRAND }}
            >
              Kontakt <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setSearchOpen(true)} className="p-2 text-gray-500" aria-label="Suche">
              <Search size={18} />
            </button>
            <FavoritesLink count={favorites.length} />
            <LanguageSwitcher variant="light" />
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="p-2 -mr-2 text-[#0F1B2D]"
              aria-label={isMobileMenuOpen ? 'Menü schliessen' : 'Menü öffnen'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop mega panel */}
      <div className="hidden lg:block" onMouseEnter={() => openMenu && openNow(openMenu)}>
        <AnimatePresence>
          {activeMenu && <MegaPanel key={activeMenu.key} menu={activeMenu} onClose={() => setOpenMenu(null)} />}
        </AnimatePresence>
      </div>

      {/* Reading progress */}
      <motion.div
        className="absolute left-0 right-0 bottom-0 h-[2px] origin-left"
        style={{ scaleX: progress, backgroundColor: BRAND }}
        aria-hidden="true"
      />

      {/* Mobile menu – portalled so the header's transform can't offset it */}
      {createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <MobileMenu
              menus={menus}
              isActive={isActive}
              top={isScrolled ? 56 : 64}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* Global Search overlay */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </motion.header>
  );
};

export default Header;
