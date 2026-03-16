import React from 'react';
import { motion } from 'framer-motion';
import { Building2, PenTool, Cog, Home, Briefcase, Users, Key, TrendingUp, Shield, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const Services = () => {
  const architectureServices = [
    {
      icon: PenTool,
      title: 'Planung und Entwurf',
      description: 'Jede erfolgreiche Baugeschichte beginnt mit einer klaren Vision. Gemeinsam entwickeln wir kreative und maßgeschneiderte Konzepte, die genau auf Ihre Anforderungen abgestimmt sind.',
      features: ['Entwurfsplanung', 'Genehmigungsplanung', 'Ausführungsplanung']
    },
    {
      icon: Building2,
      title: 'Neubauten',
      description: 'Ob Wohnhäuser, Gewerbeimmobilien oder öffentliche Bauten – wir realisieren Projekte, die höchsten architektonischen und baulichen Ansprüchen genügen.',
      features: ['Wohnhäuser', 'Gewerbeimmobilien', 'Öffentliche Bauten']
    },
    {
      icon: Cog,
      title: 'Sanierungen und Umbauten',
      description: 'Bestehende Gebäude erhalten durch uns eine neue Perspektive. Wir schaffen moderne Lösungen, die den Charakter des Bestands bewahren und gleichzeitig zeitgemäße Standards erfüllen.',
      features: ['Modernisierung', 'Energetische Sanierung', 'Umbauten']
    },
    {
      icon: Users,
      title: 'Projektbegleitung',
      description: 'Von der ersten Idee bis zur Fertigstellung – wir stehen Ihnen in jeder Phase Ihres Bauvorhabens zur Seite und sorgen für eine termingerechte, wirtschaftliche und hochwertige Umsetzung.',
      features: ['Bauüberwachung', 'Qualitätskontrolle', 'Terminplanung']
    }
  ];

  const realEstateServices = [
    {
      icon: Key,
      title: 'Kauf und Verkauf',
      description: 'Profitieren Sie von unserer Expertise und unserem breiten Netzwerk, um Ihre Traumimmobilie zu finden oder Ihre Immobilie erfolgreich zu verkaufen. Wir stehen Ihnen mit einer individuellen Beratung und professionellen Vermarktung zur Seite.',
      features: ['Immobilienbewertung', 'Professionelle Vermarktung', 'Verhandlungsführung']
    },
    {
      icon: Home,
      title: 'Vermietung',
      description: 'Ob Wohn- oder Gewerbeimmobilien – wir finden den passenden Mieter für Ihre Liegenschaft und kümmern uns um alle Details, von der Inseration bis zur Vertragsabwicklung.',
      features: ['Mietersuche', 'Vertragsabwicklung', 'Objektpräsentation']
    },
    {
      icon: TrendingUp,
      title: 'Projektentwicklung',
      description: 'Sie haben eine Vision? Wir entwickeln maßgeschneiderte Immobilienprojekte, die sowohl funktional als auch nachhaltig überzeugen.',
      features: ['Standortanalyse', 'Konzeptentwicklung', 'Realisierung']
    },
    {
      icon: Shield,
      title: 'Immobilienbewirtschaftung',
      description: 'Wir übernehmen die Verwaltung Ihrer Liegenschaften und sorgen für einen reibungslosen Ablauf – von der Mieterbetreuung bis zur Instandhaltung.',
      features: ['Mieterbetreuung', 'Instandhaltung', 'Finanzmanagement']
    }
  ];

  const handleServiceClick = () => {
    toast({
      title: "🚧 Diese Funktion ist noch nicht implementiert",
      description: "Aber keine Sorge! Du kannst sie in deinem nächsten Prompt anfordern! 🚀"
    });
  };

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
            die begeistern und dabei die individuellen Wünsche unserer Kunden in den Mittelpunkt stellen.
          </p>
        </motion.div>

        {/* Architecture Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
            Architektur – Von der Vision zur Realität
          </h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Die Hans Amonn AG steht für durchdachte Architektur, die Funktionalität, Ästhetik und Nachhaltigkeit vereint. 
            Unser Ziel ist es, Räume zu schaffen, die begeistern und dabei die individuellen Wünsche unserer Kunden 
            in den Mittelpunkt stellen.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {architectureServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-lg hover-lift cursor-pointer group"
                onClick={handleServiceClick}
              >
                <div className="mb-6">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:brand-gradient transition-all duration-300">
                    <service.icon className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                    {service.description}
                  </p>
                </div>

                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Real Estate Services Section */}
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
              Bei der Hans Amonn AG stehen Ihre Wünsche und Bedürfnisse im Mittelpunkt. Wir bieten Ihnen umfassende 
              Lösungen rund um Immobilien – ob Kauf, Verkauf, Vermietung oder Entwicklung. Mit langjähriger Erfahrung 
              und einem engagierten Team begleiten wir Sie bei jedem Schritt und sorgen dafür, dass Sie die Immobilie 
              finden, die perfekt zu Ihnen passt.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {realEstateServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg p-6 shadow-lg hover-lift cursor-pointer group"
                onClick={handleServiceClick}
              >
                <div className="mb-6">
                  <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:brand-gradient transition-all duration-300">
                    <service.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                    {service.description}
                  </p>
                </div>

                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us Section */}
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
              <p className="text-gray-600 text-sm">Über 50 Jahre in der Immobilienbranche</p>
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

        {/* CTA Section */}
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
              Egal, ob Sie eine Immobilie suchen, verkaufen möchten oder Unterstützung bei einem Projekt benötigen – 
              bei uns sind Sie in besten Händen. Kontaktieren Sie uns und entdecken Sie, wie wir Ihre Immobilienwünsche 
              Realität werden lassen können.
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