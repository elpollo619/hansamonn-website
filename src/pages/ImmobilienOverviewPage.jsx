import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BedDouble, Building2, ArrowRight, MapPin, Clock, Tag } from 'lucide-react';
import { useTranslation } from '@/i18n';
import PageHero from '@/components/PageHero';

const BRAND = 'var(--brand-color, #1D3D78)';

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

    <PageHero
      eyebrow="Hans Amonn AG"
      title={t('immobilien.hero.title')}
      subtitle={t('immobilien.hero.subtitle')}
      image="/images/kerzers/01.jpg"
      size="lg"
    />

    <section className="surface-warm py-20 md:py-24">
      <div className="container mx-auto px-6">
        {/* Two main cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {CARDS.map(({ to, icon: Icon, tag, title, subtitle, description, highlights, cta }, i) => (
            <motion.div
              key={to}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
            >
              <Link
                to={to}
                className="group flex flex-col h-full bg-white border border-gray-100 hover:border-gray-300 transition-colors overflow-hidden"
              >
                <div className="flex-1 p-8 md:p-10">
                  {/* Icon + tag */}
                  <div className="flex items-start justify-between mb-10">
                    <Icon size={28} style={{ color: BRAND }} />
                    <span className="text-[11px] font-semibold tracking-hairline uppercase text-gray-400">{tag}</span>
                  </div>

                  {/* Title */}
                  <h2 className="display-heading uppercase text-4xl md:text-5xl mb-2 group-hover:text-[#1D3D78] transition-colors">
                    {title}
                  </h2>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-5">{subtitle}</p>
                  <p className="text-gray-600 leading-relaxed mb-8">{description}</p>

                  {/* Highlights */}
                  <ul className="border-t border-gray-100 mb-2">
                    {highlights.map(({ icon: HIcon, text }) => (
                      <li key={text} className="flex items-center gap-3 text-sm text-gray-600 py-3 border-b border-gray-100">
                        <HIcon size={15} className="flex-shrink-0" style={{ color: BRAND }} />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-8 md:px-10 pb-8 md:pb-10">
                  <span className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 transition-colors" style={{ backgroundColor: BRAND }}>
                    {cta}
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Bottom contact strip */}
    <section className="bg-white border-t border-gray-100 py-20 md:py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div className="max-w-2xl">
            <h2 className="display-heading uppercase text-4xl md:text-5xl mb-4">{t('immobilien.contact.title')}</h2>
            <p className="text-gray-600 leading-relaxed">{t('immobilien.hero.subtitle')}</p>
          </div>
          <Link
            to="/immobilien/anfrage"
            className="inline-flex items-center gap-2 text-white px-6 py-3 text-sm font-semibold transition-colors flex-shrink-0 self-start md:self-auto"
            style={{ backgroundColor: BRAND }}
          >
            {t('immobilien.contact.cta')}
            <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  </>
  );
};

export default ImmobilienOverviewPage;
