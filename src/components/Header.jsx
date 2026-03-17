import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-2xl font-bold text-slate-800 tracking-tight"
            >
              AMONN ARCHITEKTUR
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div
              className="relative"
              onMouseEnter={() => setOpenDesktopDropdown(true)}
              onMouseLeave={() => setOpenDesktopDropdown(false)}
            >
              <div className="flex items-center gap-1">
                <Link
                  to="/vermietung"
                  className={`font-medium transition-colors ${
                    isActive("/vermietung")
                      ? "text-sky-500 font-semibold"
                      : "text-slate-700 hover:text-sky-500"
                  }`}
                >
                  Vermietung
                </Link>

                <button
                  type="button"
                  onClick={() => setOpenDesktopDropdown((prev) => !prev)}
                  className="text-slate-700 hover:text-sky-500"
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              {openDesktopDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
                  <div className="bg-white shadow-xl border border-slate-200 rounded-2xl p-8 w-[min(92vw,1000px)]">
                    <div className="grid grid-cols-4 gap-10">
                      <div>
                        <Link
                          to="/vermietung/long-stay"
                          className="block font-semibold text-slate-900 mb-4 hover:text-sky-600"
                        >
                          Long Stay
                        </Link>

                        <Link
                          to="/long-stay/kerzers"
                          className="block py-1.5 text-slate-600 hover:text-sky-600"
                        >
                          Kerzers
                        </Link>

                        <Link
                          to="/long-stay/munchenbuchsee"
                          className="block py-1.5 text-slate-600 hover:text-sky-600"
                        >
                          Münchenbuchsee
                        </Link>

                        <Link
                          to="/long-stay/muri"
                          className="block py-1.5 text-slate-600 hover:text-sky-600"
                        >
                          Muri bei Bern
                        </Link>
                      </div>

                      <div>
                        <Link
                          to="/vermietung/short-stay"
                          className="block font-semibold text-slate-900 mb-4 hover:text-sky-600"
                        >
                          Short Stay
                        </Link>

                        <Link
                          to="/ns-hotel"
                          className="block py-1.5 text-slate-600 hover:text-sky-600"
                        >
                          N&apos;s Hotel
                        </Link>

                        <Link
                          to="/casa-reto"
                          className="block py-1.5 text-slate-600 hover:text-sky-600"
                        >
                          Casa Reto
                        </Link>
                      </div>

                      <div>
                        <Link
                          to="/vermietung/apartments"
                          className="block font-semibold text-slate-900 mb-4 hover:text-sky-600"
                        >
                          Apartments
                        </Link>

                        <Link
                          to="/vermietung/apartments"
                          className="block py-1.5 text-slate-600 hover:text-sky-600"
                        >
                          Alle Apartments
                        </Link>
                      </div>

                      <div>
                        <Link
                          to="/vermieten"
                          className="block font-semibold text-slate-900 mb-4 hover:text-sky-600"
                        >
                          Mietanfrage
                        </Link>

                        <p className="text-sm leading-6 text-slate-500">
                          Allgemeine Anfrage für Long Stay, Apartments und Short Stay.
                        </p>

                        <Link
                          to="/vermieten"
                          className="inline-block mt-4 text-sky-600 font-medium hover:text-sky-700"
                        >
                          Formular öffnen
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/uber-uns"
              className={`transition-colors font-medium ${
                isActive("/uber-uns")
                  ? "text-sky-500 font-semibold"
                  : "text-slate-700 hover:text-sky-500"
              }`}
            >
              Über uns
            </Link>

            <Link
              to="/team"
              className={`transition-colors font-medium ${
                isActive("/team")
                  ? "text-sky-500 font-semibold"
                  : "text-slate-700 hover:text-sky-500"
              }`}
            >
              Team
            </Link>

            <Link
              to="/projekte"
              className={`transition-colors font-medium ${
                isActive("/projekte")
                  ? "text-sky-500 font-semibold"
                  : "text-slate-700 hover:text-sky-500"
              }`}
            >
              Projekte
            </Link>

            <Link
              to="/leistungen"
              className={`transition-colors font-medium ${
                isActive("/leistungen")
                  ? "text-sky-500 font-semibold"
                  : "text-slate-700 hover:text-sky-500"
              }`}
            >
              Leistungen
            </Link>

            <Link to="/kontakt">
              <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                Kontakt
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg"
          >
            <div className="flex flex-col px-4">
              <div className="flex items-center justify-between py-4">
                <Link
                  to="/vermietung"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium text-slate-800"
                >
                  Vermietung
                </Link>

                <button
                  onClick={() => setOpenMobileDropdown((prev) => !prev)}
                  className="text-slate-700"
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              {openMobileDropdown && (
                <div className="pb-3 pl-3 flex flex-col gap-2">
                  <Link
                    to="/vermietung/long-stay"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-medium text-slate-800"
                  >
                    Long Stay
                  </Link>

                  <Link
                    to="/long-stay/kerzers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-slate-700"
                  >
                    Kerzers
                  </Link>

                  <Link
                    to="/long-stay/munchenbuchsee"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-slate-700"
                  >
                    Münchenbuchsee
                  </Link>

                  <Link
                    to="/long-stay/muri"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-slate-700"
                  >
                    Muri bei Bern
                  </Link>

                  <Link
                    to="/vermietung/short-stay"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-medium text-slate-800 mt-2"
                  >
                    Short Stay
                  </Link>

                  <Link
                    to="/ns-hotel"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-slate-700"
                  >
                    N&apos;s Hotel
                  </Link>

                  <Link
                    to="/casa-reto"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-slate-700"
                  >
                    Casa Reto
                  </Link>

                  <Link
                    to="/vermietung/apartments"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-medium text-slate-800 mt-2"
                  >
                    Apartments
                  </Link>

                  <Link
                    to="/vermietung/apartments"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-slate-700"
                  >
                    Alle Apartments
                  </Link>

                  <Link
                    to="/vermieten"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-medium text-slate-800 mt-2"
                  >
                    Mietanfrage
                  </Link>
                </div>
              )}

              <Link
                to="/uber-uns"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-4 border-t text-slate-700"
              >
                Über uns
              </Link>

              <Link
                to="/team"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-4 border-t text-slate-700"
              >
                Team
              </Link>

              <Link
                to="/projekte"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-4 border-t text-slate-700"
              >
                Projekte
              </Link>

              <Link
                to="/leistungen"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-4 border-t text-slate-700"
              >
                Leistungen
              </Link>

              <Link to="/kontakt" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="bg-sky-600 hover:bg-sky-700 text-white w-full mt-4">
                  Kontakt
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}