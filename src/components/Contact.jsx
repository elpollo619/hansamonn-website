import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['Hans Amonn AG', 'Blümlisalpstrasse 4', '3074 Muri bei Bern']
    },
    {
      icon: Phone,
      title: 'Telefon',
      details: ['+41 (0)31 951 85 54'],
      href: 'tel:+41319518554'
    },
    {
      icon: Mail,
      title: 'E-Mail',
      details: ['office@reto-amonn.ch'],
      href: 'mailto:office@reto-amonn.ch'
    },
    {
      icon: Clock,
      title: 'Öffnungszeiten',
      details: ['Mo-Fr: 08:00 - 18:00', 'Sa: Nach Vereinbarung']
    }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "🚧 Diese Funktion ist noch nicht implementiert",
      description: "Aber keine Sorge! Du kannst sie in deinem nächsten Prompt anfordern! 🚀"
    });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">
            <span className="font-bold">Kontakt</span> aufnehmen
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Wir freuen uns auf Ihre Anfrage und beraten Sie gerne zu Ihrem Bau- oder Immobilienprojekt. 
            Kontaktieren Sie uns für ein persönliches Gespräch.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">
              Kontaktinformationen
            </h3>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {info.title}
                    </h4>
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-gray-600">
                        {info.href ? (
                          <a href={info.href} className="hover:text-blue-600 transition-colors">{detail}</a>
                        ) : (
                          detail
                        )}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Why Choose Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8 bg-gray-50 p-6 rounded-lg"
            >
              <h4 className="font-semibold text-gray-900 mb-4">Warum Hans Amonn AG?</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Über 50 Jahre Erfahrung in der Architektur und Bauplanung</li>
                <li>• Individuelle Beratung und enge Zusammenarbeit mit unseren Kunden</li>
                <li>• Nachhaltige Lösungen, die ökologisch und wirtschaftlich überzeugen</li>
                <li>• Vertrauen Sie auf unsere Expertise und Leidenschaft</li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">
              Nachricht senden
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vorname *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="Ihr Vorname"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nachname *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="Ihr Nachname"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="ihre.email@beispiel.ch"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  placeholder="+41 XX XXX XX XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Projekttyp
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all">
                  <option value="">Bitte wählen</option>
                  <option value="architektur">Architekturplanung</option>
                  <option value="neubau">Neubau</option>
                  <option value="sanierung">Sanierung & Umbau</option>
                  <option value="immobilien">Immobilienvermittlung</option>
                  <option value="beratung">Beratung</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nachricht *
                </label>
                <textarea
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
                  placeholder="Beschreiben Sie Ihr Projekt..."
                ></textarea>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full brand-gradient hover:brand-gradient-hover text-white py-3"
              >
                Nachricht senden
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Google Maps Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-semibold text-gray-900 mb-4">
              Unser <span className="gradient-text">Standort</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Besuchen Sie uns in unserem Büro in Muri bei Bern. Wir freuen uns auf ein persönliches Gespräch 
              über Ihr Bau- oder Immobilienprojekt.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Map Container */}
            <div className="relative h-96 md:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2723.8234567890123!2d7.4916667!3d46.9333333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478e39c0d43a9b91%3A0x12345678!2sBl%C3%BCmlisalpstrasse%204%2C%203074%20Muri%20bei%20Bern%2C%20Switzerland!5e0!3m2!1sen!2sch!4v1234567890123!5m2!1sen!2sch"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hans Amonn AG Standort - Blümlisalpstrasse 4, 3074 Muri bei Bern"
                className="w-full h-full"
              ></iframe>
              
              {/* Map Overlay with Company Info */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Hans Amonn AG</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Blümlisalpstrasse 4<br />
                      3074 Muri bei Bern
                    </p>
                    <a href="tel:+41319518554" className="text-xs text-blue-600 mt-2 font-medium hover:underline">
                      +41 (0)31 951 85 54
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Footer with Directions */}
            <div className="p-6 bg-gray-50">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Adresse</h4>
                  <p className="text-sm text-gray-600">
                    Blümlisalpstrasse 4<br />
                    3074 Muri bei Bern
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Öffnungszeiten</h4>
                  <p className="text-sm text-gray-600">
                    Mo-Fr: 08:00 - 18:00<br />
                    Sa: Nach Vereinbarung
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Anfahrt</h4>
                  <p className="text-sm text-gray-600">
                    Parkplätze vorhanden<br />
                    ÖV: Bus Linie 21
                  </p>
                </div>
              </div>
              
              {/* Directions Button */}
              <div className="text-center mt-6">
                <a
                  href="https://www.google.com/maps/dir//Bl%C3%BCmlisalpstrasse+4,+3074+Muri+bei+Bern,+Switzerland"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Route planen
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 bg-blue-50 rounded-lg p-8 text-center"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Bereit für Ihr nächstes Projekt?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Ob Architekturplanung, Neubau, Sanierung oder Immobilienvermittlung - 
            wir sind Ihr kompetenter Partner für alle Bau- und Immobilienprojekte in der Region Bern.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+41319518554"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
            >
              <Phone className="w-5 h-5 mr-2" />
              Jetzt anrufen
            </a>
            <a
              href="mailto:office@reto-amonn.ch"
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium rounded-lg transition-colors duration-300"
            >
              <Mail className="w-5 h-5 mr-2" />
              E-Mail senden
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;