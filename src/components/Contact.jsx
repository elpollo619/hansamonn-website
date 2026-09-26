import React, { useState, useRef } from 'react';
import FormPrivacyNote from '@/components/FormPrivacyNote';
import ConsentEmbed from '@/components/ConsentEmbed';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from '@/i18n';
import { supabase } from '@/lib/supabase';
import { getSetting } from '@/data/settingsStore';
import PageHero from '@/components/PageHero';

const BRAND = 'var(--brand-color, #1D3D78)';
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};
const inputCls =
  'w-full px-4 py-3 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1D3D78] transition-colors';
const labelCls = 'block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2';

const Contact = () => {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef(null);
  const phone   = getSetting('phone');
  const email   = getSetting('email');
  const address = getSetting('address');

  const contactInfo = [
    {
      icon: MapPin,
      title: t('common.address'),
      details: ['Hans Amonn AG', ...address.split(',').map(s => s.trim())]
    },
    {
      icon: Phone,
      title: t('common.phone'),
      details: [phone],
      href: `tel:${phone.replace(/\D/g, '')}`
    },
    {
      icon: Mail,
      title: t('common.email'),
      details: [email],
      href: `mailto:${email}`
    },
    {
      icon: Clock,
      title: t('common.hours'),
      details: ['Mo-Fr: 08:00 - 18:00', 'Sa: Nach Vereinbarung']
    }
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const fd = new FormData(e.target);
    const firstName = fd.get('firstName') || '';
    const lastName  = fd.get('lastName')  || '';
    const name      = `${firstName} ${lastName}`.trim();
    const email     = fd.get('email')     || '';
    const telefon   = fd.get('telefon')   || '';
    const betreff   = fd.get('betreff')   || '';
    const nachricht = fd.get('nachricht') || '';

    setSubmitting(true);
    try {
      // 1. Save to Supabase
      const { error } = await supabase.from('kontakt_anfragen').insert([{
        name, email, telefon, betreff, nachricht,
      }]);
      if (error) throw error;

      // 2. Fire-and-forget email notification
      supabase.functions.invoke('send-email', {
        body: {
          subject: `Neue Kontaktanfrage: ${name}`,
          replyTo: email,
          html: `
            <h2>Neue Kontaktanfrage</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>E-Mail:</strong> ${email}</p>
            ${telefon ? `<p><strong>Telefon:</strong> ${telefon}</p>` : ''}
            ${betreff ? `<p><strong>Betreff:</strong> ${betreff}</p>` : ''}
            <p><strong>Nachricht:</strong></p>
            <p>${nachricht.replace(/\n/g, '<br>')}</p>
          `,
        },
      }).catch(() => { /* ignore email errors */ });

      toast({
        title: t('contact.form.success'),
        description: t('contact.form.successDetail'),
      });
      e.target.reset();
    } catch (err) {
      toast({
        title: 'Fehler beim Senden',
        description: err.message || 'Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <>
      <PageHero
        title={t('contact.title')}
        size="sm"
      />

      <section id="contact" className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid gap-14 lg:grid-cols-12">
            {/* Contact Information */}
            <motion.div {...fadeUp} className="lg:col-span-5 min-w-0">
              <h2 className="display-heading uppercase text-3xl md:text-4xl mb-10 hyphens-auto break-words">
                {t('contact.infoTitle')}
              </h2>

              <div className="border-t border-gray-100">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-5 py-6 border-b border-gray-100"
                  >
                    <div className="w-11 h-11 surface-warm flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5" style={{ color: BRAND }} />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                        {info.title}
                      </h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-gray-900 leading-relaxed">
                          {info.href ? (
                            <a href={info.href} className="hover:text-[#1D3D78] transition-colors">{detail}</a>
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
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-10 surface-warm p-8"
              >
                <h3 className="font-display uppercase text-xl font-semibold text-[#0F1B2D] mb-5">{t('contact.whyUs')}</h3>
                <ul className="space-y-3 text-gray-600 leading-relaxed">
                  {(t('contact.whyUsItems') || []).map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2.5 h-px w-4 shrink-0" style={{ backgroundColor: BRAND }} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div {...fadeUp} className="lg:col-span-7 min-w-0">
              <div className="border border-gray-100 p-6 md:p-10">
                <h2 className="display-heading uppercase text-3xl md:text-4xl mb-8 hyphens-auto break-words">
                  {t('contact.sendMessage')}
                </h2>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelCls}>
                        {t('contact.form.firstName')} *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        className={inputCls}
                        placeholder={t('contact.form.firstNamePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>
                        {t('contact.form.lastName')} *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        className={inputCls}
                        placeholder={t('contact.form.lastNamePlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>
                      {t('contact.form.email')} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className={inputCls}
                      placeholder={t('contact.form.emailPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      name="telefon"
                      className={inputCls}
                      placeholder={t('contact.form.phonePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      {t('contact.form.projectType')}
                    </label>
                    <select name="betreff" className={inputCls}>
                      <option value="">{t('contact.form.projectPlaceholder')}</option>
                      <option value="architektur">{t('contact.form.optArchitektur')}</option>
                      <option value="neubau">{t('contact.form.optNeubau')}</option>
                      <option value="sanierung">{t('contact.form.optSanierung')}</option>
                      <option value="immobilien">{t('contact.form.optImmobilien')}</option>
                      <option value="beratung">{t('contact.form.optBeratung')}</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>
                      {t('contact.form.message')} *
                    </label>
                    <textarea
                      required
                      name="nachricht"
                      rows={5}
                      className={`${inputCls} resize-none`}
                      placeholder={t('contact.form.messagePlaceholder')}
                    ></textarea>
                  </div>

                  <FormPrivacyNote className="mb-3" />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full text-white px-6 py-3.5 text-sm font-semibold transition-colors disabled:opacity-60"
                    style={{ backgroundColor: BRAND }}
                    onMouseOver={e => !e.currentTarget.disabled && e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                    onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
                  >
                    {submitting ? 'Wird gesendet…' : t('contact.form.submit')}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="surface-warm py-20 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div {...fadeUp} className="grid gap-6 lg:grid-cols-12 lg:items-end mb-12">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-3">Muri bei Bern</p>
              <h2 className="display-heading uppercase text-3xl md:text-4xl">
                Unser Standort
              </h2>
            </div>
            <p className="lg:col-span-7 text-lg text-gray-600 leading-relaxed">
              Besuchen Sie uns in unserem Büro in Muri bei Bern. Wir freuen uns auf ein persönliches Gespräch
              über Ihr Bau- oder Immobilienprojekt.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="bg-white border border-gray-100 overflow-hidden">
            {/* Map Container */}
            <div className="relative h-96 md:h-[500px] bg-gray-100">
              <ConsentEmbed className="absolute inset-0 pt-40 sm:pt-6">
                <iframe
                  src="https://www.google.com/maps?q=Bl%C3%BCmlisalpstrasse+4,+3074+Muri+bei+Bern&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hans Amonn AG Standort - Blümlisalpstrasse 4, 3074 Muri bei Bern"
                  className="w-full h-full"
                ></iframe>
              </ConsentEmbed>

              {/* Map Overlay with Company Info */}
              <div className="absolute top-4 left-4 right-4 sm:right-auto bg-white p-5 border border-gray-100 max-w-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0" style={{ backgroundColor: BRAND }}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display uppercase font-semibold text-[#0F1B2D] text-lg leading-none">Hans Amonn AG</h3>
                    <p className="text-xs text-gray-600 mt-2">
                      Blümlisalpstrasse 4<br />
                      3074 Muri bei Bern
                    </p>
                    <a href="tel:+41319518554" className="inline-block text-xs mt-2 font-semibold hover:underline" style={{ color: BRAND }}>
                      +41 (0)31 951 85 54
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Footer with Directions */}
            <div className="border-t border-gray-100">
              <div className="p-6 md:p-8">
                <svg className="w-5 h-5 mb-4" style={{ color: BRAND }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Anfahrt</h3>
                <p className="text-gray-900 leading-relaxed">
                  Parkplätze vorhanden<br />
                  ÖV: Bus Linie 21
                </p>
              </div>
            </div>

            {/* Directions Button */}
            <div className="border-t border-gray-100 p-6 md:px-8 flex justify-start md:justify-end">
              <a
                href="https://www.google.com/maps/dir//Bl%C3%BCmlisalpstrasse+4,+3074+Muri+bei+Bern,+Switzerland"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm text-white font-semibold transition-colors"
                style={{ backgroundColor: BRAND }}
                onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
              >
                <MapPin className="w-4 h-4" />
                Route planen
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Additional Contact CTA */}
      <section className="bg-[#0B1220] text-white py-20 md:py-24">
        <motion.div
          {...fadeUp}
          className="container mx-auto px-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10"
        >
          <div className="max-w-2xl">
            <h2 className="font-display uppercase font-semibold text-3xl md:text-4xl leading-none mb-5">
              Bereit für Ihr nächstes Projekt?
            </h2>
            <p className="text-white/70 leading-relaxed text-lg">
              Ob Architekturplanung, Neubau, Sanierung oder Immobilienvermittlung -
              wir sind Ihr kompetenter Partner für alle Bau- und Immobilienprojekte in der Region Bern.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="tel:+41319518554"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Jetzt anrufen
            </a>
            <a
              href="mailto:office@reto-amonn.ch"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              <Mail className="w-4 h-4" />
              E-Mail senden
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Contact;
