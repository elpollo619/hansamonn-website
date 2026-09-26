import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShieldCheck, Percent, Home } from 'lucide-react';
import MortgageCalculator from '@/components/MortgageCalculator';
import PageHero from '@/components/PageHero';

const RULES = [
  {
    icon: <Percent size={22} style={{ color: 'var(--brand-color, #1D3D78)' }} />,
    title: 'Maximale Belehnung (LTV)',
    body: 'Banken finanzieren in der Schweiz maximal 80% des Kaufpreises. Die restlichen 20% müssen als Eigenkapital eingebracht werden, wovon mindestens 10% aus eigenen Mitteln (nicht Pensionskasse) stammen müssen.',
  },
  {
    icon: <ShieldCheck size={22} style={{ color: 'var(--brand-color, #1D3D78)' }} />,
    title: 'Tragbarkeit (max. 33%)',
    body: 'Die jährlichen Wohnkosten (Zinsen kalkulatorisch mit 5%, Amortisation, Nebenkosten) dürfen in der Regel nicht mehr als ein Drittel des Bruttoeinkommens betragen. Dieser Richtwert gilt auch bei niedrigem Marktzins.',
  },
  {
    icon: <Home size={22} style={{ color: 'var(--brand-color, #1D3D78)' }} />,
    title: 'Amortisation',
    body: 'Die Hypothek ist innert 15 Jahren auf 65% des Verkehrswertes amortisiert zu haben (Richtwert). Direkte oder indirekte Amortisation via Säule 3a sind möglich.',
  },
];

const HyporechnerPage = () => {
  return (
    <>
      <Helmet>
        <title>Hypothekenrechner | Hans Amonn AG</title>
        <meta
          name="description"
          content="Berechnen Sie Ihre Hypothek, Monatsrate und Tragbarkeit nach Schweizer Standard. Unverbindlicher Hypothekenrechner von Hans Amonn AG."
        />
      </Helmet>

      {/* Hero */}
      <PageHero
        eyebrow="Immobilien · Verkauf"
        title={<>Hypothek & Tragbarkeit<br />berechnen</>}
        subtitle={
          <>
            Ermitteln Sie Ihre monatliche Rate, jährliche Zinslast und Tragbarkeit nach
            Schweizer Standard, in Echtzeit und vollständig kostenlos.
          </>
        }
        size="sm"
      />

      {/* Calculator */}
      <section className="container mx-auto px-4 sm:px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <MortgageCalculator />
        </motion.div>
      </section>

      {/* Swiss mortgage rules */}
      <section className="surface-warm border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <p className="eyebrow mb-3">Schweizer Standard</p>
            <h2 className="display-heading uppercase text-3xl sm:text-3xl md:text-4xl mb-4">
              Schweizer Hypothekenregeln
            </h2>
            <p className="text-gray-600 leading-relaxed mb-10">
              Was Banken und FINMA in der Schweiz bei der Hypothekenvergabe prüfen.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {RULES.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-white p-6 md:p-7 border border-gray-100 hover:border-gray-300 transition-colors"
                >
                  <div className="mb-5">
                    {r.icon}
                  </div>
                  <h3 className="font-display uppercase text-xl font-semibold text-[#0F1B2D] mb-3">{r.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HyporechnerPage;
