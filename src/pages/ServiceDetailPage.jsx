import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Phone, Mail } from 'lucide-react';
import { servicesData } from '@/components/servicesData';
import PageHero from '@/components/PageHero';

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
      <PageHero
        image={service.coverImage}
        size="sm"
        back={{ to: '/leistungen', label: 'Alle Leistungen' }}
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <Icon size={14} /> Hans Amonn AG · {service.category}
          </span>
        }
        title={<span className="break-words hyphens-auto">{service.title}</span>}
      />

      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xl md:text-2xl text-[#0F1B2D] leading-relaxed mb-8">
                  {service.shortDescription}
                </p>
                <p className="text-gray-600 leading-relaxed mb-12">
                  {service.fullDescription}
                </p>

                {/* Bullet Points */}
                <h2 className="display-heading uppercase text-3xl md:text-4xl mb-8">
                  Was wir für Sie tun
                </h2>
                <ul className="border-t border-gray-100 mb-10">
                  {service.bullets.map((bullet, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="flex items-start gap-4 py-4 border-b border-gray-100"
                    >
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: 'var(--brand-color, #1D3D78)' }} />
                      <span className="text-gray-600 leading-relaxed">{bullet}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 border border-gray-200 px-2.5 py-1"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 lg:sticky lg:top-28 self-start">
              {/* CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="surface-warm p-8 border border-gray-100"
              >
                <h3 className="font-display uppercase text-2xl font-semibold text-[#0F1B2D] mb-3">
                  Haben Sie Fragen?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Wir beraten Sie gerne unverbindlich zu diesem Leistungsbereich.
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:+41319518554"
                    className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 px-6 text-sm transition-colors"
                    style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                    onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                    onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
                  >
                    <Phone size={15} /> +41 (0)31 951 85 54
                  </a>
                  <a
                    href="mailto:office@reto-amonn.ch"
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 text-sm transition-colors"
                  >
                    <Mail size={15} /> E-Mail schreiben
                  </a>
                  <Link
                    to="/kontakt"
                    className="w-full flex items-center justify-center bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 text-sm transition-colors"
                  >
                    Kontaktformular
                  </Link>
                </div>
              </motion.div>

              {/* Related Services */}
              {related.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35 }}
                  className="surface-warm p-8 border border-gray-100"
                >
                  <h3 className="font-display uppercase text-2xl font-semibold text-[#0F1B2D] mb-5">
                    Weitere Leistungen
                  </h3>
                  <ul className="space-y-2">
                    {related.map((s) => {
                      const RelIcon = s.icon;
                      return (
                        <li key={s.slug}>
                          <Link
                            to={`/leistungen/${s.slug}`}
                            className="flex items-center gap-3 bg-white border border-gray-100 hover:border-gray-300 p-3 text-gray-700 hover:text-[#1D3D78] transition-colors group"
                          >
                            <div className="w-9 h-9 border border-gray-200 flex items-center justify-center group-hover:border-gray-400 transition-colors shrink-0">
                              <RelIcon className="w-4 h-4" style={{ color: 'var(--brand-color, #1D3D78)' }} />
                            </div>
                            <span className="text-sm font-semibold">{s.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <Link
                    to="/leistungen"
                    className="mt-5 inline-flex items-center text-sm font-semibold" style={{ color: 'var(--brand-color, #1D3D78)' }}
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
