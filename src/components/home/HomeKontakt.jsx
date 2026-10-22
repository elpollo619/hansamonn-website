import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Mail, MapPin, Phone } from 'lucide-react';
import { getSetting } from '@/data/settingsStore';
import { OFFICE_HOURS } from '@/data/officeHours';
import { NewsletterForm } from '@/components/NewsletterSection';

/** Closing block: how to reach us, and the alert for new rentals. Replaces the footer CTA on the home page. */
export default function HomeKontakt() {
  const phone = getSetting('phone');
  const email = getSetting('email');

  return (
    <section className="bg-white">
      <div className="container mx-auto px-6 py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <h2 className="display-heading text-3xl md:text-4xl">So erreichen Sie uns</h2>
            <ul className="mt-8 grid gap-5">
              <li className="flex gap-4">
                <Phone size={20} className="mt-1 shrink-0 text-[#1F497D]" aria-hidden="true" />
                <div>
                  <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="font-display text-2xl font-semibold text-[#121D2B] hover:text-[#1F497D]">
                    {phone}
                  </a>
                  <p className="mt-1 text-sm text-gray-600">Mo–Fr {OFFICE_HOURS.phone}</p>
                  <p className="text-sm text-gray-600">{OFFICE_HOURS.urgent}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Mail size={20} className="mt-0.5 shrink-0 text-[#1F497D]" aria-hidden="true" />
                <div>
                  <a href={`mailto:${email}`} className="text-lg font-semibold text-[#121D2B] hover:text-[#1F497D] break-all">{email}</a>
                </div>
              </li>
              <li className="flex gap-4">
                <MapPin size={20} className="mt-0.5 shrink-0 text-[#1F497D]" aria-hidden="true" />
                <div className="text-gray-700 leading-relaxed">
                  Blümlisalpstrasse 4, 3074 Muri bei Bern
                  <span className="block text-sm text-gray-600">Büro Mo–Fr {OFFICE_HOURS.office}</span>
                </div>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 bg-[#1F497D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#173963] transition-colors"
              >
                Nachricht schreiben <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link
                to="/termin"
                className="inline-flex items-center gap-2 border border-gray-300 px-5 py-3 text-sm font-semibold text-[#121D2B] hover:border-[#1F497D] transition-colors"
              >
                <CalendarDays size={15} aria-hidden="true" /> Termin vereinbaren
              </Link>
            </div>
          </div>

          <div className="min-w-0 lg:border-l lg:border-gray-200 lg:pl-16">
            <h2 className="font-display text-2xl font-semibold text-[#121D2B]">Neue Unterkünfte per E-Mail</h2>
            <p className="mt-3 mb-6 text-gray-600 leading-relaxed max-w-md">
              Wir schreiben Ihnen, sobald ein Zimmer oder eine Wohnung frei wird. Abmelden können Sie sich jederzeit.
            </p>
            <NewsletterForm id="home-newsletter-email" />
          </div>
        </div>
      </div>
    </section>
  );
}
