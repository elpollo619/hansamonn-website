import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { servicesData } from '@/components/servicesData';

const ServiceCard = ({ service, index }) => {
  const Icon = service.icon;
  const isArchitektur = service.category === 'architektur';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link to={`/leistungen/${service.slug}`} className="block h-full">
        <div className="bg-white rounded-lg p-6 shadow-lg hover-lift h-full flex flex-col">
          <div className="mb-6">
            <div
              className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${
                isArchitektur
                  ? 'bg-gray-100 group-hover:bg-blue-600'
                  : 'bg-blue-50 group-hover:bg-blue-600'
              }`}
            >
              <Icon
                className={`w-7 h-7 transition-colors duration-300 ${
                  isArchitektur
                    ? 'text-gray-700 group-hover:text-white'
                    : 'text-blue-600 group-hover:text-white'
                }`}
              />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              {service.title}
            </h4>
            <p className="text-gray-600 mb-4 leading-relaxed text-sm">
              {service.shortDescription}
            </p>
          </div>

          <ul className="space-y-2 mb-6 flex-1">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-center text-xs text-gray-600">
                <div
                  className={`w-1.5 h-1.5 rounded-full mr-3 ${
                    isArchitektur ? 'bg-gray-400' : 'bg-blue-400'
                  }`}
                />
                {feature}
              </li>
            ))}
          </ul>

          <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
            <span>Mehr erfahren</span>
            <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Services = () => {
  const architectureServices = servicesData.filter((s) => s.category === 'architektur');
  const realEstateServices = servicesData.filter((s) => s.category === 'immobilien');

  return (
    <section id="services" className="py-20 bg-gray-50">
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
            Unsere <span className="font-bold">Leistungen</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Die Hans Amonn AG steht für durchdachte Architektur, die Funktionalität,
            Ästhetik und Nachhaltigkeit vereint. Unser Ziel ist es, Räume zu schaffen,
            die begeistern und dabei die individuellen Wünsche unserer Kunden in den
            Mittelpunkt stellen.
          </p>
        </motion.div>

        {/* Architecture Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-semibold text-gray-900 mb-4 text-center">
            Architektur – Von der Vision zur Realität
          </h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Von der Planung bis zur Schlüsselübergabe begleiten wir Ihr Bauvorhaben
            mit Erfahrung, Präzision und gestalterischem Anspruch.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {architectureServices.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Real Estate Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-semibold text-gray-900 mb-6">
              Immobilien – Ihr Zuhause, Ihr Investment, Ihre Zukunft
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Mit langjähriger Erfahrung und einem engagierten Team begleiten wir Sie
              bei jedem Schritt rund um Ihre Immobilie.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {realEstateServices.map((service, index) => (
              <ServiceCard key={service.slug} service={service} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Why Us */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-white rounded-lg p-8 shadow-lg mb-16"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Warum Hans Amonn AG?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Erfahrung und Kompetenz</h4>
              <p className="text-gray-600 text-sm">Über 55 Jahre in der Immobilien- und Baubranche</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Persönliche Betreuung</h4>
              <p className="text-gray-600 text-sm">Enge Zusammenarbeit und transparente Kommunikation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Regional verankert</h4>
              <p className="text-gray-600 text-sm">Tiefe Kenntnisse des lokalen Marktes und starkes Netzwerk</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Haben Sie ein Projekt im Kopf?
            </h3>
            <p className="text-gray-600 mb-6">
              Egal ob Sie eine Immobilie suchen, verkaufen möchten oder Unterstützung
              bei einem Bauvorhaben benötigen – bei uns sind Sie in besten Händen.
            </p>
            <Link to="/kontakt">
              <Button
                size="lg"
                className="brand-gradient hover:brand-gradient-hover text-white px-8"
              >
                Kostenlose Beratung anfragen
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
