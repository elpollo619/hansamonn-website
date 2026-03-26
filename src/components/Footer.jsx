import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from '@/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Footer = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const handleServiceLinkClick = (hash) => {
    if (location.pathname === '/leistungen') {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { to: '/',           label: t('nav.home') },
    { to: '/uber-uns',   label: t('nav.about') },
    { to: '/projekte',   label: t('nav.projects') },
    { to: '/leistungen', label: t('nav.services') },
    { to: '/immobilien', label: t('nav.immobilien') },
    { to: '/kontakt',    label: t('nav.contact') },
  ];

  const serviceLabels = t('footer.servicesList') || ['Architekturplanung', 'Neubauten', 'Sanierungen & Umbauten', 'Kauf & Verkauf', 'Projektentwicklung', 'Bewirtschaftung'];
  const servicePaths = [
    '/leistungen/planung-entwurf',
    '/leistungen/neubauten',
    '/leistungen/sanierungen-umbauten',
    '/leistungen/kauf-verkauf',
    '/leistungen/projektentwicklung',
    '/leistungen/immobilienbewirtschaftung',
  ];
  const serviceLinks = servicePaths.map((to, i) => ({ to, label: serviceLabels[i] || servicePaths[i] }));

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="text-xl font-bold gradient-text block mb-4">
              HANS AMONN AG
            </Link>
            <p className="text-gray-400 mb-5 leading-relaxed text-sm">
              {t('footer.tagline')}
            </p>

            {/* Social icons */}
            <div className="flex space-x-3 mb-5">
              <a
                href="https://www.facebook.com/people/Hans-Amonn-AG/100084327557360/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://www.instagram.com/amonnarchitektur/?hl=de"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://www.linkedin.com/in/hans-amonn-689b7938b"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>

            {/* Language switcher in footer */}
            <LanguageSwitcher variant="dark" />
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              {t('footer.navigation')}
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              {t('footer.services')}
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                    onClick={() => handleServiceLinkClick(link.to.split('#')[1])}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              {t('footer.contact')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="text-gray-400 text-sm leading-relaxed">
                  <p>Hans Amonn AG</p>
                  <p>Blümlisalpstrasse 4</p>
                  <p>3074 Muri bei Bern</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-gray-500 flex-shrink-0" />
                <a
                  href="tel:+41319518554"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  +41 (0)31 951 85 54
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-gray-500 flex-shrink-0" />
                <a
                  href="mailto:office@reto-amonn.ch"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  office@reto-amonn.ch
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-500 text-sm">
            {t('footer.copyright', { year })}
          </p>
          <div className="flex gap-5 text-sm">
            <Link to="/impressum" className="text-gray-500 hover:text-white transition-colors">
              {t('footer.impressum')}
            </Link>
            <Link to="/datenschutz" className="text-gray-500 hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
