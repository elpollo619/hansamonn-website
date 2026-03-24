import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { servicesData } from '@/components/servicesData';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    return <Navigate to="/leistungen" replace />;
  }

  const Icon = service.icon;

  const related = servicesData.filter(
    (s) => s.category === service.category && s.slug !== service.slug
  );

  return (
    <>
      <Helmet>
        <title>{service.title} - Hans Amonn AG</title>
        <meta name="description" content={service.shortDescription} />
      </Helmet>

      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={service.coverImage}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        <div className="absolute inset-0 flex flex-col justify-end pb-10 px-6">
          <div className="container mx-auto">
            <Link
              to="/leistungen"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 text-sm transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              Alle Leistungen
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/70 text-sm capitalize">{service.category}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-light text-white">
              {service.title}
            </h1>
          </div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  {service.shortDescription}
                </p>
                <p className="text-gray-700 leading-relaxed mb-10">
                  {service.fullDescription}
                </p>

                {/* Bullet Points */}
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Was wir für Sie tun
                </h2>
                <ul className="space-y-4 mb-10">
                  {service.bullets.map((bullet, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{bullet}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Haben Sie Fragen?
                </h3>
                <p className="text-gray-600 text-sm mb-5">
                  Wir beraten Sie gerne unverbindlich zu diesem Leistungsbereich.
                </p>
                <div className="space-y-3">
                  <a href="tel:+41319518554" className="w-full">
                    <Button className="w-full brand-gradient text-white flex items-center gap-2">
                      <Phone size={16} />
                      +41 (0)31 951 85 54
                    </Button>
                  </a>
                  <a href="mailto:office@reto-amonn.ch" className="w-full">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Mail size={16} />
                      E-Mail schreiben
                    </Button>
                  </a>
                  <Link to="/kontakt" className="w-full">
                    <Button variant="outline" className="w-full">
                      Kontaktformular
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Related Services */}
              {related.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Weitere Leistungen
                  </h3>
                  <ul className="space-y-3">
                    {related.map((s) => {
                      const RelIcon = s.icon;
                      return (
                        <li key={s.slug}>
                          <Link
                            to={`/leistungen/${s.slug}`}
                            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                              <RelIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium">{s.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <Link
                    to="/leistungen"
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <ArrowLeft size={14} className="mr-1" />
                    Alle Leistungen
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetailPage;
