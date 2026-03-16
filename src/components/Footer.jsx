import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Footer = () => {
  const location = useLocation();

  const handleSocialClick = () => {
    toast({
      title: "🚧 Diese Funktion ist noch nicht implementiert",
      description: "Aber keine Sorge! Du kannst sie in deinem nächsten Prompt anfordern! 🚀"
    });
  };

  const handleServiceLinkClick = (hash) => {
    if (location.pathname === '/leistungen') {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const servicesLinks = [
    { to: '/leistungen#architekturplanung', label: 'Architekturplanung' },
    { to: '/leistungen#neubauten', label: 'Neubauten' },
    { to: '/leistungen#sanierungen', label: 'Sanierungen & Umbauten' },
    { to: '/leistungen#immobilienvermittlung', label: 'Immobilienvermittlung' },
    { to: '/leistungen#kauf-verkauf', label: 'Kauf & Verkauf' },
    { to: '/leistungen#projektentwicklung', label: 'Projektentwicklung' }
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="text-2xl font-bold mb-4 gradient-text">
              HANS AMONN AG
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Ihr Partner für Bau und Immobilien seit 1968. Qualität, Zuverlässigkeit 
              und Innovation in der Bau- und Immobilienbranche.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/people/Hans-Amonn-AG/100084327557360/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="Besuchen Sie uns auf Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/amonnarchitektur/?hl=de"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="Besuchen Sie uns auf Instagram"
              >
                <Instagram size={18} />
              </a>
              <button
                onClick={handleSocialClick}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                aria-label="Besuchen Sie uns auf LinkedIn"
              >
                <Linkedin size={18} />
              </button>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Startseite</Link></li>
              <li><Link to="/uber-uns" className="text-gray-400 hover:text-white transition-colors">Über uns</Link></li>
              <li><Link to="/projekte" className="text-gray-400 hover:text-white transition-colors">Projekte</Link></li>
              <li><Link to="/leistungen" className="text-gray-400 hover:text-white transition-colors">Leistungen</Link></li>
              <li><Link to="/kontakt" className="text-gray-400 hover:text-white transition-colors">Kontakt</Link></li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Leistungen</h3>
            <ul className="space-y-3">
              {servicesLinks.map(link => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={() => handleServiceLinkClick(link.to.split('#')[1])}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                <div className="text-gray-400">
                  <p>Hans Amonn AG</p>
                  <p>Blümlisalpstrasse 4</p>
                  <p>3074 Muri bei Bern</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-gray-400 flex-shrink-0" />
                <a href="tel:+41319518554" className="text-gray-400 hover:text-white transition-colors">+41 (0)31 951 85 54</a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-gray-400 flex-shrink-0" />
                <a href="mailto:office@reto-amonn.ch" className="text-gray-400 hover:text-white transition-colors">office@reto-amonn.ch</a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              Copyright © 2025 Hans Amonn AG. Alle Rechte vorbehalten.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/impressum" className="text-gray-400 hover:text-white transition-colors">Impressum</Link>
              <Link to="/datenschutz" className="text-gray-400 hover:text-white transition-colors">Datenschutzerklärung</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;