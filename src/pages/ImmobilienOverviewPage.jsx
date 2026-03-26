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
      tagColor: 'bg-blue-100 text-blue-700',
      title: t('immobilien.vermietung.title'),
      subtitle: t('immobilien.vermietung.subtitle'),
      description: t('immobilien.vermietung.desc'),
      highlights: (t('immobilien.vermietung.highlights') || []).map((text, i) => ({
        icon: [BedDouble, Clock, MapPin][i] || MapPin,
        text,
      })),
      cta: t('immobilien.vermietung.cta'),
      accentFrom: 'from-blue-600',
      accentTo: 'to-blue-800',
      bgLight: 'bg-blue-50',
      borderColor: 'border-blue-100 hover:border-blue-300',
      ctaClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      to: '/immobilien/verkauf',
      icon: Building2,
      tag: t('immobilien.verkauf.tag'),
      tagColor: 'bg-emerald-100 text-emerald-700',
      title: t('immobilien.verkauf.title'),
      subtitle: t('immobilien.verkauf.subtitle'),
      description: t('immobilien.verkauf.desc'),
      highlights: (t('immobilien.verkauf.highlights') || []).map((text, i) => ({
        icon: [Building2, Tag, MapPin][i] || MapPin,
        text,
      })),
      cta: t('immobilien.verkauf.cta'),
      accentFrom: 'from-emerald-600',
      accentTo: 'to-emerald-800',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-100 hover:border-emerald-300',
      ctaClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
  ];

  return (
  <>
    <Helmet>
      <title>Immobilien – Vermietung & Verkauf | Hans Amonn AG</title>
      <meta name="description" content="Entdecken Sie das Immobilienangebot der Hans Amonn AG: Vermietung von Long Stay, Short Stay und Apartments sowie Kaufobjekte in der Region." />
    </Helmet>

    <section className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-3">Hans Amonn AG</p>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            {t('immobilien.hero.title')}
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            {t('immobilien.hero.subtitle')}
          </p>
        </motion.div>

        {/* Two main cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {CARDS.map(({ to, icon: Icon, tag, tagColor, title, subtitle, description, highlights, cta, accentFrom, accentTo, bgLight, borderColor, ctaClass }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Link
                to={to}
                className={`group flex flex-col h-full bg-white rounded-2xl border ${borderColor} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}
              >
                {/* Top accent bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${accentFrom} ${accentTo}`} />

                <div className="flex-1 p-8">
                  {/* Icon + tag */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${bgLight} flex items-center justify-center`}>
                      <Icon size={26} className="text-gray-700" />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${tagColor}`}>{tag}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {title}
                  </h2>
                  <p className="text-sm font-medium text-gray-500 mb-4">{subtitle}</p>
                  <p className="text-gray-600 leading-relaxed mb-6">{description}</p>

                  {/* Highlights */}
                  <ul className="space-y-2.5 mb-8">
                    {highlights.map(({ icon: HIcon, text }) => (
                      <li key={text} className="flex items-center gap-2.5 text-sm text-gray-600">
                        <HIcon size={15} className="text-gray-400 flex-shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-8 pb-8">
                  <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${ctaClass}`}>
                    {cta}
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
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
          className="mt-12 max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm font-semibold text-gray-900">{t('immobilien.contact.title')}</p>
            <p className="text-sm text-gray-500">{t('immobilien.hero.subtitle')}</p>
          </div>
          <Link
            to="/immobilien/anfrage"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors flex-shrink-0"
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
