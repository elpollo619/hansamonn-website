import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BedDouble, Building2, ArrowRight, MapPin, Clock, Tag } from 'lucide-react';
import { useTranslation } from '@/i18n';

const ImmobilienOverviewPage = () => {
  const { t } = useTranslation();

  const CARDS = [
    {
      to: '/immobilien/vermietung',
      icon: BedDouble,
      tag: t('immobilien.vermietung.tag'),
      title: t('immobilien.vermietung.title'),
      subtitle: t('immobilien.vermietung.subtitle'),
      description: t('immobilien.vermietung.desc'),
      highlights: (t('immobilien.vermietung.highlights') || []).map((text, i) => ({
        icon: [BedDouble, Clock, MapPin][i] || MapPin,
        text,
      })),
      cta: t('immobilien.vermietung.cta'),
    },
    {
      to: '/immobilien/verkauf',
      icon: Building2,
      tag: t('immobilien.verkauf.tag'),
      title: t('immobilien.verkauf.title'),
      subtitle: t('immobilien.verkauf.subtitle'),
      description: t('immobilien.verkauf.desc'),
      highlights: (t('immobilien.verkauf.highlights') || []).map((text, i) => ({
        icon: [Building2, Tag, MapPin][i] || MapPin,
        text,
      })),
      cta: t('immobilien.verkauf.cta'),
    },
  ];

  return (
  <>
    <Helmet>
      <title>Immobilien – Vermietung & Verkauf | Hans Amonn AG</title>
      <meta name="description" content="Entdecken Sie das Immobilienangebot der Hans Amonn AG: Vermietung von Long Stay, Short Stay und Apartments sowie Kaufobjekte in der Region." />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Immobilien – Vermietung & Verkauf | Hans Amonn AG" />
      <meta property="og:description" content="Long Stay, Short Stay, Apartments und Kaufobjekte in der Region Bern – Hans Amonn AG." />
      <meta property="og:image" content="https://www.hansamonn.ch/images/kerzers/titel.jpg" />
      <meta property="og:url" content="https://www.hansamonn.ch/immobilien" />
      <meta property="og:site_name" content="Hans Amonn AG" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>

    <section className="min-h-screen bg-white py-16 border-t border-gray-100">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gray-400 mb-3">Hans Amonn AG</p>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            {t('immobilien.hero.title')}
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            {t('immobilien.hero.subtitle')}
          </p>
        </motion.div>

        {/* Two main cards */}
        <div className="grid md:grid-cols-2 gap-px bg-gray-100 border border-gray-100 max-w-5xl mx-auto">
          {CARDS.map(({ to, icon: Icon, tag, title, subtitle, description, highlights, cta }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Link
                to={to}
                className="group flex flex-col h-full bg-white hover:bg-gray-50 transition-colors overflow-hidden"
              >
                <div className="flex-1 p-8">
                  {/* Icon + tag */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                      <Icon size={22} className="text-gray-500" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">{tag}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-light text-gray-900 mb-1 group-hover:text-[#1D3D78] transition-colors">
                    {title}
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">{subtitle}</p>
                  <p className="text-gray-500 leading-relaxed mb-6 text-sm">{description}</p>

                  {/* Highlights */}
                  <ul className="space-y-2 mb-8">
                    {highlights.map(({ icon: HIcon, text }) => (
                      <li key={text} className="flex items-center gap-2.5 text-sm text-gray-500">
                        <HIcon size={14} className="text-gray-300 flex-shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-8 pb-8">
                  <span className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 transition-colors" style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}>
                    {cta}
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom contact strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 max-w-5xl mx-auto bg-white border border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm font-semibold text-gray-900">{t('immobilien.contact.title')}</p>
            <p className="text-sm text-gray-500">{t('immobilien.hero.subtitle')}</p>
          </div>
          <Link
            to="/immobilien/anfrage"
            className="inline-flex items-center gap-2 text-white px-5 py-2.5 text-sm font-semibold transition-colors flex-shrink-0"
            style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
          >
            {t('immobilien.contact.cta')}
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  </>
  );
};

export default ImmobilienOverviewPage;
